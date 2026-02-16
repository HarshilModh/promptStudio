"use server"
import db from "@/lib/db"
import { getCurrentUser } from "@/modules/auth/actions"
import { MessageRole, MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/inngest/client";
import { consumeCredits } from "@/lib/usage";

export const createProject = async (value) => {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    try {
        await consumeCredits();
    } catch (error) {
        if (error instanceof Error) {
            console.error("Credit consumption error:", error);
            throw new Error("Something went wrong while consuming credits. Please check logs.");
        }
        else {
            throw new Error("You have exhausted your credits. Please wait before making more requests.");
        }
    }
    const newProject = await db.project.create({
        data: {
            name: generateSlug(2, { format: "kebab" }),
            userId: user.id,
            messages: {
                create: {
                    content: value,
                    role: MessageRole.USER,
                    type: MessageType.RESULT
                }
            }
        }
    })
    await inngest.send({
        name: "code-agent/run",
        data: {
            value: value,
            projectId: newProject.id
        }
    })
    return newProject
}
export const getProject = async () => {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }
    const projects = await db.project.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return projects
}
export const getProjectById = async (projectId) => {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }
    const project = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.id
        }
    })
    if (!project) {
        throw new Error("Project not found")
    }
    return project
}
