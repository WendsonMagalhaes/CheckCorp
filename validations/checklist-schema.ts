import { z } from "zod"

export const createChecklistSchema =
    z.object({

        title: z
            .string()
            .min(
                3,
                "Título obrigatório"
            ),

        description: z
            .string()
            .optional(),

        frequency: z.enum([
            "DAILY",
            "WEEKLY",
            "MONTHLY",
        ]),

        // CHECKLIST POR SETOR
        sectorId: z
            .string()
            .optional(),

        // CHECKLIST INDIVIDUAL
        assignedUserId: z
            .string()
            .optional(),
    })

        // OBRIGA TER UM DESTINO
        .refine(

            (data) =>
                !!data.sectorId ||
                !!data.assignedUserId,

            {
                message:
                    "Selecione um setor ou usuário",

                path: ["sectorId"],
            }
        )

        // NÃO PODE TER OS DOIS
        .refine(

            (data) =>
                !(
                    data.sectorId &&
                    data.assignedUserId
                ),

            {
                message:
                    "Selecione apenas um destino",

                path: ["assignedUserId"],
            }
        )

export type CreateChecklistData =
    z.infer<
        typeof createChecklistSchema
    >

export const updateChecklistSchema =
    z.object({

        id: z.string(),

        title: z
            .string()
            .min(
                3,
                "Título obrigatório"
            ),

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
            .optional(),

        assignedUserId: z
            .string()
            .optional(),

        active: z.boolean(),
    })

        // OBRIGA DESTINO
        .refine(

            (data) =>
                !!data.sectorId ||
                !!data.assignedUserId,

            {
                message:
                    "Selecione um setor ou usuário",

                path: ["sectorId"],
            }
        )

        // NÃO PODE OS DOIS
        .refine(

            (data) =>
                !(
                    data.sectorId &&
                    data.assignedUserId
                ),

            {
                message:
                    "Selecione apenas um destino",

                path: ["assignedUserId"],
            }
        )

export type UpdateChecklistData =
    z.infer<
        typeof updateChecklistSchema
    >