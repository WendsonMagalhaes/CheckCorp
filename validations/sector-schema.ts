import { z } from "zod"

export const createSectorSchema =
    z.object({
        name:
            z.string().min(3),

        description:
            z.string().optional(),
    })

export const updateSectorSchema =
    z.object({
        id:
            z.string(),

        name:
            z.string().min(3),

        description:
            z.string().optional(),

        active:
            z.boolean(),
    })

export type CreateSectorData =
    z.infer<
        typeof createSectorSchema
    >

export type UpdateSectorData =
    z.infer<
        typeof updateSectorSchema
    >