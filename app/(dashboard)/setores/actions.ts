"use server"

import { prisma } from "@/lib/prisma"

import {
    createSectorSchema,
    updateSectorSchema,
} from "@/validations/sector-schema"

export async function createSectorAction(
    data: unknown
) {

    const parsed =
        createSectorSchema.safeParse(data)

    if (!parsed.success) {

        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    await prisma.sector.create({
        data: parsed.data,
    })

    return {
        success: true,
        message: "Setor criado com sucesso",
    }
}

export async function updateSectorAction(
    data: unknown
) {

    const parsed =
        updateSectorSchema.safeParse(data)

    if (!parsed.success) {

        return {
            success: false,
            message: "Dados inválidos",
        }
    }

    await prisma.sector.update({
        where: {
            id: parsed.data.id,
        },

        data: {
            name: parsed.data.name,
            description:
                parsed.data.description,

            active: parsed.data.active,
        },
    })

    return {
        success: true,
        message: "Setor atualizado",
    }
}

export async function deleteSectorAction(
    id: string
) {

    await prisma.sector.delete({
        where: {
            id,
        },
    })

    return {
        success: true,
        message: "Setor excluído",
    }
}

export async function getSectorsAction() {

    const sectors =
        await prisma.sector.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })

    return sectors
}