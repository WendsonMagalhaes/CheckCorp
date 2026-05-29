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

    if (!session?.user?.id) {
        return []
    }

    const user =
        await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },

            include: {
                supervisedSectors: true,
            },
        })

    if (!user) {
        return []
    }

    let whereClause = {}

    // =========================
    // ADMIN
    // =========================

    if (user.role === "ADMIN") {

        whereClause = {}

    } else {

        // SETORES DO USUÁRIO

        const sectorIds =
            user.role === "SUPERVISOR"
                ? user.supervisedSectors.map(
                    sector => sector.id
                )
                : user.sectorId
                    ? [user.sectorId]
                    : []

        // EMPLOYEE E SUPERVISOR

        whereClause = {
            OR: [

                // CHECKLISTS DO SETOR

                {
                    sectorId: {
                        in: sectorIds,
                    },
                },

                // CHECKLISTS CRIADOS PARA O USUÁRIO

                {
                    assignedUserId: user.id,
                },

                // CHECKLISTS CRIADOS PELO USUÁRIO

                {
                    createdById: user.id,
                },
            ],
        }
    }

    const checklists =
        await prisma.checklist.findMany({
            where: whereClause,

            include: {
                sector: true,
                assignedUser: true,
                items: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        })

    const enriched: ChecklistData[] =
        await Promise.all(

            checklists.map(async (checklist) => {

                const cycleKey =
                    getCycleKey(
                        new Date(),
                        checklist.frequency
                    )

                const execution =
                    await prisma.checklistExecution.findFirst({
                        where: {
                            checklistId: checklist.id,
                            userId: user.id,
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
                            status:
                                execution.status as ExecutionStatus,
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