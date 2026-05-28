import { prisma } from "@/lib/prisma"

import {
    CreateChecklistData,
    UpdateChecklistData,
} from "@/validations/checklist-schema"

export async function createChecklistService(
    data: CreateChecklistData
) {

    return prisma.checklist.create({
        data: {
            title: data.title,
            description: data.description,
            frequency: data.frequency,
            sectorId: data.sectorId,
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