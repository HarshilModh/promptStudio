"use server"
import { getCurrentUser } from "@/modules/auth/actions"
import db from "@/lib/db";
import { Inngest } from "@/inngest/client"
import { MessageRole, MessageType } from "@prisma/client";

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
    const newMessage = await db.message.create({
        data: {
            content: value,
            projectId,
            userId: user.id,
            role: MessageRole.USER,
            type: MessageType.RESULT
        }
    })
    await Inngest.send({
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