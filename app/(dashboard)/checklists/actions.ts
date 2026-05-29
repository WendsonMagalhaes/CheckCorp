"use server"

import { prisma } from "@/lib/prisma"
import { getCycleKey } from "@/lib/cycle-key"
import { auth } from "@/lib/auth"

import type { ChecklistData } from "@/types/checklist"
import { ExecutionStatus } from "@prisma/client"

import {
    createChecklistSchema,
    updateChecklistSchema,
} from "@/validations/checklist-schema"

import {
    createChecklistService,
    updateChecklistService,
    deleteChecklistService,
} from "@/services/checklist-service"

/* =========================================================
   CREATE
========================================================= */

export async function createChecklistAction(data: unknown) {
    const parsed = createChecklistSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    try {
        await createChecklistService(parsed.data)

        return {
            success: true,
            message: "Checklist criado com sucesso",
        }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Erro interno",
        }
    }
}

/* =========================================================
   GET ALL CHECKLISTS
========================================================= */

export async function getChecklistsAction(): Promise<ChecklistData[]> {
    const session = await auth()

    if (!session?.user?.id) return []

    const userId = session.user.id

    const checklists = await prisma.checklist.findMany({
        include: {
            sector: true,
            assignedUser: true,
            items: true,
        },
    })

    const enriched: ChecklistData[] = await Promise.all(
        checklists.map(async (checklist) => {
            const cycleKey = getCycleKey(
                new Date(),
                checklist.frequency
            )

            const execution = await prisma.checklistExecution.findFirst({
                where: {
                    checklistId: checklist.id,
                    userId,
                    cycleKey,
                },
                select: {
                    id: true,
                    status: true,
                    items: {
                        select: {
                            id: true,
                            executionId: true,
                            itemId: true,
                            checked: true,
                            observation: true,
                        },
                    },
                },
            })

            return {
                ...checklist,
                execution: execution
                    ? {
                        ...execution,
                        status: execution.status as ExecutionStatus,
                    }
                    : null,
            }
        })
    )

    return enriched
}

/* =========================================================
   GET BY ID
========================================================= */

export async function getChecklistByIdAction(id: string) {
    try {
        return await prisma.checklist.findUnique({
            where: { id },
            include: {
                sector: true,
                createdBy: true,
            },
        })
    } catch (error) {
        console.log(error)
        return null
    }
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateChecklistAction(data: unknown) {
    const parsed = updateChecklistSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    try {
        await updateChecklistService(parsed.data)

        return {
            success: true,
            message: "Checklist atualizado",
        }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Erro interno",
        }
    }
}

/* =========================================================
   DELETE
========================================================= */

export async function deleteChecklistAction(checklistId: string) {
    try {
        await deleteChecklistService(checklistId)

        return {
            success: true,
            message: "Checklist removido",
        }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Erro interno",
        }
    }
}