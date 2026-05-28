import { z } from "zod"

export const createUserSchema = z.object({

    name: z
        .string()
        .min(3, "Nome obrigatório"),

    email: z
        .string()
        .email("E-mail inválido"),

    password: z
        .string()
        .min(6, "Mínimo 6 caracteres"),

    role: z.enum([
        "ADMIN",
        "SUPERVISOR",
        "EMPLOYEE",
    ]),
    sectorId: z.string().optional(),
})

export type CreateUserData =
    z.infer<typeof createUserSchema>

export const updateUserSchema =
    z.object({

        id: z.string(),

        name: z
            .string()
            .min(3, "Nome obrigatório"),

        email: z
            .string()
            .email("E-mail inválido"),

        role: z.enum([
            "ADMIN",
            "SUPERVISOR",
            "EMPLOYEE",
        ]),
        sectorId: z.string().optional(),
        active: z.boolean(),
    })

export type UpdateUserData =
    z.infer<typeof updateUserSchema>