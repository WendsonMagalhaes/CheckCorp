"use server"

import { prisma } from "@/lib/prisma"

import {
    createUserSchema,
} from "@/validations/user-schema"

import {
    createUserService,
} from "@/services/user-service"

import {
    updateUserSchema,
} from "@/validations/user-schema"

import {
    updateUserService,
} from "@/services/user-service"

import {
    deleteUserService,
} from "@/services/user-service"

export async function createUserAction(
    data: unknown
) {

    const parsed =
        createUserSchema.safeParse(data)

    if (!parsed.success) {

        return {
            success: false,
            message: "Dados inválidos",
            errors: parsed.error.flatten(),
        }
    }

    try {

        await createUserService(
            parsed.data
        )

        return {
            success: true,
            message: "Usuário criado com sucesso",
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

export async function getUsersAction() {

    try {

        const users =
            await prisma.user.findMany({
                orderBy: {
                    createdAt: "desc",
                },

                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    active: true,

                    sector: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })

        return users

    } catch (error) {

        console.log(error)

        return []
    }
}

export async function updateUserAction(
    data: unknown
) {

    const parsed =
        updateUserSchema.safeParse(data)

    if (!parsed.success) {

        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    try {

        await updateUserService(
            parsed.data
        )

        return {
            success: true,
            message: "Usuário atualizado",
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

export async function deleteUserAction(
    userId: string
) {

    try {

        await deleteUserService(
            userId
        )

        return {
            success: true,
            message: "Usuário removido",
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