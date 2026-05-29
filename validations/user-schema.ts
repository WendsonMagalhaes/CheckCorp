import { z } from "zod"

/* =========================================================
   CREATE USER
========================================================= */

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

    // SETOR PRINCIPAL
    sectorId: z
        .string()
        .optional(),

    // SETORES SUPERVISIONADOS
    supervisedSectorIds: z
        .array(z.string())
        .optional(),
})

export type CreateUserData =
    z.infer<typeof createUserSchema>

/* =========================================================
   UPDATE USER
========================================================= */

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

        // SETOR PRINCIPAL
        sectorId: z
            .string()
            .optional(),

        // SETORES SUPERVISIONADOS
        supervisedSectorIds: z
            .array(z.string())
            .optional(),

        active: z.boolean(),
    })

export type UpdateUserData =
    z.infer<typeof updateUserSchema>