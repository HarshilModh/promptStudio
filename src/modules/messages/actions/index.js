"use server"
import { getCurrentUser } from "@/modules/auth/actions"
import db from "@/lib/db";
import { inngest } from "@/inngest/client"
import { MessageRole, MessageType } from "@prisma/client";
import { consumeCredits } from "@/lib/usage";
import { th } from "date-fns/locale";

export const createMessage = async (value, projectId) => {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }
    const project = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.id
        }
    })
    if (!project) return { error: "Project not found" }
    try{
        await consumeCredits();
    }
    catch(err) {
        if(err instanceof Error){
            throw new Error({
                code:"bad_request",
                message:"Something went wrong while consuming credits",
            });   
        }else{
            throw new Error({
                code:"TOO_MANY_REQUESTS",
                message:"You have exhausted your credits. Please wait before making more requests.",
            });
        }
    }
    const newMessage = await db.message.create({
        data: {
            content: value,
            projectId,
            role: MessageRole.USER,
            type: MessageType.RESULT
        }
    })
    await inngest.send({
        name: "code-agent/run",
        data: {
            value: value,
            projectId: projectId,
        }
    })
    return newMessage
}
export const getMessages = async (projectId) => {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }
    const project = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.id
        }
    })
    if (!project) return { error: "Project not found" }
    const messages = await db.message.findMany({
        where: {
            projectId: projectId,
        },
        orderBy: {
            updatedAt: "asc"
        },
        include: {
            fragments: true
        }
    })
    return messages
}