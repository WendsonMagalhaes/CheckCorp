import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

import {
    CreateChecklistData,
    UpdateChecklistData,
} from "@/validations/checklist-schema"

export async function createChecklistService(
    data: CreateChecklistData
) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Usuário não autenticado")
    }

    return prisma.checklist.create({
        data: {
            title: data.title,
            description: data.description,
            frequency: data.frequency,
            sectorId: data.sectorId,

            createdById: session.user.id,
        },
    })
}

export async function updateChecklistService(
    data: UpdateChecklistData
) {

    return prisma.checklist.update({
        where: {
            id: data.id,
        },

        data: {
            title: data.title,
            description: data.description,
            frequency: data.frequency,
            sectorId: data.sectorId,
            active: data.active,
        },
    })
}

export async function deleteChecklistService(
    checklistId: string
) {

    const checklist =
        await prisma.checklist.findUnique({
            where: {
                id: checklistId,
            },
        })

    if (!checklist) {

        throw new Error(
            "Checklist não encontrado"
        )
    }

    await prisma.checklist.delete({
        where: {
            id: checklistId,
        },
    })
}