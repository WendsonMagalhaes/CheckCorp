import { z } from "zod"

export const createChecklistSchema =
    z.object({

        title: z
            .string()
            .min(3, "Título obrigatório"),

        description: z
            .string()
            .optional(),

        frequency: z.enum([
            "DAILY",
            "WEEKLY",
            "MONTHLY",
        ]),

        sectorId: z
            .string()
            .min(1, "Setor obrigatório"),
    })

export type CreateChecklistData =
    z.infer<typeof createChecklistSchema>

export const updateChecklistSchema =
    z.object({

        id: z.string(),

        title: z
            .string()
            .min(3, "Título obrigatório"),

        description: z
            .string()
            .optional(),

        frequency: z.enum([
            "DAILY",
            "WEEKLY",
            "MONTHLY",
        ]),

        sectorId: z.string(),

        active: z.boolean(),
    })

export type UpdateChecklistData =
    z.infer<typeof updateChecklistSchema>


