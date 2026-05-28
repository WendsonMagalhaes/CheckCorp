import { prisma } from "@/lib/prisma"

import {
    CreateSectorData,
} from "@/validations/sector-schema"

export async function createSectorService(
    data: CreateSectorData
) {

    const existingSector =
        await prisma.sector.findUnique({
            where: {
                name: data.name,
            },
        })

    if (existingSector) {
        throw new Error(
            "Setor já existe"
        )
    }

    return prisma.sector.create({
        data,
    })
}