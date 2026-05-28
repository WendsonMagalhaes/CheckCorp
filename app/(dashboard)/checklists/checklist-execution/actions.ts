"use server"

import { prisma } from "@/lib/prisma"

import { auth } from "@/lib/auth"

export async function startChecklistExecutionAction(
    checklistId: string
) {

    try {

        const session =
            await auth()

        if (!session?.user?.id) {

            return {
                success: false,
                message: "Não autorizado",
            }
        }

        // checklist
        const checklist =
            await prisma.checklist.findUnique({
                where: {
                    id: checklistId,
                },

                include: {
                    items: true,
                },
            })

        if (!checklist) {

            return {
                success: false,
                message: "Checklist não encontrado",
            }
        }

        // create execution
        const execution =
            await prisma.checklistExecution.create({

                data: {

                    checklistId,

                    userId:
                        session.user.id,

                    items: {

                        create:
                            checklist.items.map(
                                (item) => ({
                                    itemId: item.id,
                                })
                            ),
                    },
                },

                include: {
                    items: true,
                },
            })

        return {
            success: true,
            execution,
        }

    } catch (error) {

        return {
            success: false,
            message: "Erro interno",
        }
    }
}

export async function toggleExecutionItemAction(
    executionItemId: string
) {

    try {

        const item =
            await prisma.checklistExecutionItem.findUnique({
                where: {
                    id: executionItemId,
                },
            })

        if (!item) {

            return {
                success: false,
                message: "Item não encontrado",
            }
        }

        await prisma.checklistExecutionItem.update({

            where: {
                id: executionItemId,
            },

            data: {
                checked: !item.checked,
            },
        })

        return {
            success: true,
        }

    } catch {

        return {
            success: false,
            message: "Erro interno",
        }
    }
}

export async function finishChecklistExecutionAction(
    executionId: string
) {

    try {

        await prisma.checklistExecution.update({

            where: {
                id: executionId,
            },

            data: {
                finishedAt: new Date(),
            },
        })

        return {
            success: true,
        }

    } catch {

        return {
            success: false,
            message: "Erro interno",
        }
    }
}