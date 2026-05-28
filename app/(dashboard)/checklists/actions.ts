"use server"

import { prisma } from "@/lib/prisma"

import {
    createChecklistSchema,
    updateChecklistSchema,
} from "@/validations/checklist-schema"

import {
    createChecklistService,
    updateChecklistService,
    deleteChecklistService,
} from "@/services/checklist-service"

export async function createChecklistAction(
    data: unknown
) {

    const parsed =
        createChecklistSchema.safeParse(data)

    if (!parsed.success) {

        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    try {

        await createChecklistService(
            parsed.data
        )

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

export async function getChecklistsAction() {

    try {

        return await prisma.checklist.findMany({

            include: {
                sector: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        })

    } catch (error) {

        console.log(error)

        return []
    }
}

export async function updateChecklistAction(
    data: unknown
) {

    const parsed =
        updateChecklistSchema.safeParse(data)

    if (!parsed.success) {

        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    try {

        await updateChecklistService(
            parsed.data
        )

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

export async function deleteChecklistAction(
    checklistId: string
) {

    try {

        await deleteChecklistService(
            checklistId
        )

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