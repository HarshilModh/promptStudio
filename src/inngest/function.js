import { inngest } from "./client";
import { gemini, createAgent, createTool, createNetwork, openai,createState } from "@inngest/agent-kit";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import Sandbox from "@e2b/code-interpreter";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "../../prompt";
import { lastAssistantTextMessageContent } from "./util";

const model = openai({ model: "gpt-5-mini" });
export const codeAgent = inngest.createFunction(
    { id: "code-agent" },
    { event: "code-agent/run" },
    async ({ event, step }) => {
        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("prompt-studio-nextjs-template")
            return sandbox.sandboxId
        })

        const previousMessages = await step.run("get-previous-messages", async () => {
                const formatedMessages =[]
                const messages = await db.message.findMany({
                    where: {
                        projectId: event.data.projectId
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                })
                for(const message of messages){
                    formatedMessages.push({
                        type:"text",
                        content: message.content,
                        role:message.role === "ASSISTANT" ? "assistant" : "user",
                    })

                }
                return formatedMessages
        })
        const state=createState({
            data:{
                files:{},
                summary:"",
            },
            messages:previousMessages
        })
        const codeAgent = createAgent({
            name: "code-agent",
            description: "You are a code agent that can run code in a sandbox",
            system: PROMPT,
            model: model,
            tools: [
                //terminal
                createTool({
                    name: "terminal",
                    description: "Use the terminal to run commands",
                    parameters: z.object({
                        command: z.string(),
                    }),
                    handler: async ({ command }, { step }) => {
                        return await step?.run("terminal", async () => {
                            const buffers = { stdout: "", stderr: "" }
                            try {
                                const sandbox = await Sandbox.connect(sandboxId)
                                const result = await sandbox.commands.run(command, {
                                    onStdout: (data) => {
                                        buffers.stdout += data.text
                                    },
                                    onStderr: (data) => {
                                        buffers.stderr += data.text
                                    }
                                })
                                return result.stdout;
                            }
                            catch (error) {
                                console.log(
                                    `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`
                                );

                                return `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`;


                            }
                        })
                    }
                }),
                //createOrUpdateFiles
                createTool({
                    name: "createOrUpdateFiles",
                    description: "Create or update files in the sanbox",
                    parameters: z.object({
                        files: z.array(
                            z.object({
                                path: z.string(),
                                content: z.string(),
                            })
                        ),
                    }),
                    handler: async ({ files }, { step, network }) => {
                        const newFiles = await step?.run("createOrUpdateFiles", async () => {
                            try {
                                const updateFiles = network?.state?.data.files || {}
                                const sandbox = await Sandbox.connect(sandboxId)
                                for (const file of files) {
                                    await sandbox.files.write(file.path, file.content)
                                    updateFiles[file.path] = file.content
                                }
                                return updateFiles
                            } catch (error) {
                                console.log(
                                    `createOrUpdateFiles failed: ${error}`
                                );
                                return `createOrUpdateFiles failed: ${error}`;
                            }
                        })

                        if (typeof newFiles === "object") {
                            network.state.data.files = newFiles;
                        }

                        return newFiles;
                    }

                }),
                //readFiles
                createTool({
                    name: "readFiles",
                    description: "Read files in the sandbox",
                    parameters: z.object({
                        files: z.array(z.string()),
                    }),
                    handler: async ({ files }, { step }) => {
                        return await step?.run("readFiles", async () => {
                            try {
                                const sandbox = await Sandbox.connect(sandboxId)
                                const contents = []
                                for (const file of files) {
                                    const content = await sandbox.files.read(file)
                                    contents.push({ path: file, content });
                                }
                                return JSON.stringify(contents)
                            } catch (error) {
                                console.log(
                                    `readFiles failed: ${error}`
                                );
                                return `readFiles failed: ${error}`;
                            }
                        })
                    }
                }),
            ],
            lifecycle: {
                onResponse: async ({ result, network }) => {
                    const lastAssistantMessageText = lastAssistantTextMessageContent(result);

                    if (lastAssistantMessageText && network) {
                        if (lastAssistantMessageText.includes("<task_summary>")) {
                            network.state.data.summary = lastAssistantMessageText
                        }
                    }

                    return result;
                }
            }
        })
        const network = createNetwork({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: 10,
            router: async ({ network }) => {
                const summary = network.state.data.summary;

                if (summary) {
                    return
                }

                return codeAgent
            }
        })
        const result = await network.run(event.data.value)
        const fragementTitleGenerator = createAgent({
            name: "fragement-title-generator",
            description: "Generate a title for the code fragment based on the content of the code. The title should be concise and descriptive.",
            model: model,
            system:FRAGMENT_TITLE_PROMPT,
        })

        const responseGenerator= createAgent({
            name:"response-generator",
            description:"Generate a user-friendly message explaining what was built based on the code and summary. The message should be casual and concise, as if you're wrapping up the process for the user.",
            model:model,
            system:RESPONSE_PROMPT,
        })
        const {output:fragmentTitleOutput} = await fragementTitleGenerator.run(result.state.data.summary)
    const {output:responseOutput} = await responseGenerator.run(
      result.state.data.summary
    )

    const generateFragmentTitle = ()=>{
      if(fragmentTitleOutput[0].type !=="text"){
        return "Untitled"
      }

      if(Array.isArray(fragmentTitleOutput[0].content)){
            return fragmentTitleOutput[0].content.map((c) => c).join("");
      }
      else{
        return fragmentTitleOutput[0].content
      }
    }
    const generateResponse = ()=>{
       if (responseOutput[0].type !== "text") {
        return "Here you go";
      }

      if (Array.isArray(responseOutput[0].content)) {
        return responseOutput[0].content.map((c) => c).join("");
      } else {
        return responseOutput[0].content;
      }
    }
        const isError = !result.state.data.summary && Object.keys(result.state.data.files || {}).length === 0;

        const sandBoxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await Sandbox.connect(sandboxId);
            const host = sandbox.getHost(3000);

            return `http://${host}`
        })

        await step.run("save-result", async () => {
            const content = generateResponse() ||result.state.data.summary || lastAssistantTextMessageContent(result) || "Generated Code";

            if (isError) {
                return await db.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: "Something went wrong. Please try again",
                        role: MessageRole.ASSISTANT,
                        type: MessageType.ERROR
                    }
                })
            }


            if (result.state.data.files && Object.keys(result.state.data.files).length > 0) {
                return await db.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: generateResponse(),
                        role: MessageRole.ASSISTANT,
                        type: MessageType.RESULT,
                        fragments: {
                            create: {
                                sandboxUrl: sandBoxUrl,
                                title: generateFragmentTitle(),
                                files: result.state.data.files
                            }
                        }
                    }
                })
            }

            return await db.message.create({
                data: {
                    projectId: event.data.projectId,
                    content: generateResponse(),
                    role: MessageRole.ASSISTANT,
                    type: MessageType.RESULT
                }
            })
        })



        return {
            url: sandBoxUrl,
            title: generateFragmentTitle(),
            files: result.state.data.files,
            summary: result.state.data.summary,
        };
    }
);