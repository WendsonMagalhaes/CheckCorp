"use client"

import {
    UseFormRegister,
    FieldErrors,
} from "react-hook-form"

import {
    CreateUserData,
} from "@/validations/user-schema"

interface Props {
    register: UseFormRegister<CreateUserData>
    errors: FieldErrors<CreateUserData>
}

export function UserForm({
    register,
    errors,
}: Props) {

    return (
        <>
            <div>
                <input
                    placeholder="Nome"
                    {...register("name")}
                    className="
                        w-full
                        h-12
                        px-4
                        bg-background
                        border
                        border-border
                        rounded-2xl
                        outline-none
                        focus:ring-2
                        focus:ring-primary
                    "
                />

                {
                    errors.name && (
                        <span className="
                            text-sm
                            text-destructive
                        ">
                            {errors.name.message}
                        </span>
                    )
                }
            </div>

            <div>
                <input
                    placeholder="E-mail"
                    {...register("email")}
                    className="
                        w-full
                        h-12
                        px-4
                        bg-background
                        border
                        border-border
                        rounded-2xl
                        outline-none
                        focus:ring-2
                        focus:ring-primary
                    "
                />

                {
                    errors.email && (
                        <span className="
                            text-sm
                            text-destructive
                        ">
                            {errors.email.message}
                        </span>
                    )
                }
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Senha"
                    {...register("password")}
                    className="
                        w-full
                        h-12
                        px-4
                        bg-background
                        border
                        border-border
                        rounded-2xl
                        outline-none
                        focus:ring-2
                        focus:ring-primary
                    "
                />

                {
                    errors.password && (
                        <span className="
                            text-sm
                            text-destructive
                        ">
                            {errors.password.message}
                        </span>
                    )
                }
            </div>

            <div>
                <select
                    {...register("role")}
                    className="
                        w-full
                        h-12
                        px-4
                        bg-background
                        border
                        border-border
                        rounded-2xl
                        outline-none
                        focus:ring-2
                        focus:ring-primary
                    "
                >
                    <option value="">
                        Selecione um cargo
                    </option>

                    <option value="ADMIN">
                        Administrador
                    </option>

                    <option value="SUPERVISOR">
                        Supervisor
                    </option>

                    <option value="EMPLOYEE">
                        Funcionário
                    </option>
                </select>

                {
                    errors.role && (
                        <span className="
                            text-sm
                            text-destructive
                        ">
                            {errors.role.message}
                        </span>
                    )
                }
            </div>
        </>
    )
}