"use client"

import {
    useTransition,
    useEffect,
    useState,
} from "react"

import { X } from "lucide-react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "sonner"

import {
    createUserSchema,
    CreateUserData,
} from "@/validations/user-schema"

import { createUserAction }
    from "@/app/(dashboard)/usuarios/actions"

import {
    getSectorsAction,
} from "@/app/(dashboard)/setores/actions"

interface Props {
    open: boolean
    onClose: () => void
}
interface SectorData {
    id: string
    name: string
}

export function CreateUserModal({
    open,
    onClose,
}: Props) {

    const [isPending, startTransition] =
        useTransition()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserData>({
        resolver:
            zodResolver(createUserSchema),
    })

    const [sectors, setSectors] =
        useState<SectorData[]>([])


    useEffect(() => {

        async function loadSectors() {

            try {

                const response =
                    await getSectorsAction()

                setSectors(response)

            } catch (error) {

                console.log(error)
            }
        }

        if (open) {

            document.body.style.overflow = "hidden"

            loadSectors()

        } else {

            document.body.style.overflow = "auto"
        }

        return () => {

            document.body.style.overflow = "auto"
        }

    }, [open])
    async function onSubmit(
        data: CreateUserData
    ) {

        startTransition(async () => {

            const response =
                await createUserAction(data)

            if (!response.success) {

                toast.error(
                    response.message
                )

                return
            }

            toast.success(
                response.message
            )

            reset()

            onClose()
        })
    }

    if (!open) return null

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/60
                backdrop-blur-sm
                flex
                items-end
                sm:items-center
                justify-center
                p-0
                sm:p-4
            "
        >
            <div
                className="
                    w-full
                    sm:max-w-lg
                    bg-background
                    rounded-t-[32px]
                    sm:rounded-3xl
                    shadow-2xl
                    border
                    border-border

                    max-h-[95vh]
                    overflow-y-auto

                    animate-in
                    slide-in-from-bottom
                    sm:zoom-in-95
                    duration-300
                "
            >
                {/* HEADER */}
                <div
                    className="
                        sticky
                        top-0
                        bg-background
                        border-b
                        border-border
                        px-5
                        sm:px-8
                        py-5
                        flex
                        items-start
                        justify-between
                        gap-4
                        rounded-t-[32px]
                        sm:rounded-t-3xl
                    "
                >
                    <div>
                        <h2
                            className="
                                text-2xl
                                font-black
                                tracking-tight
                            "
                        >
                            Novo usuário
                        </h2>

                        <p
                            className="
                                text-sm
                                text-muted-foreground
                                mt-1
                            "
                        >
                            Crie um usuário do sistema
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            w-10
                            h-10
                            rounded-xl
                            border
                            border-border
                            flex
                            items-center
                            justify-center
                            hover:bg-accent
                            transition
                            shrink-0
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="
                        p-5
                        sm:p-8
                        flex
                        flex-col
                        gap-4
                    "
                >
                    {/* NOME */}
                    <div>
                        <input
                            placeholder="Nome"
                            {...register("name")}
                            className="
                                w-full
                                h-12
                                sm:h-13
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-primary/30
                                focus:border-primary
                            "
                        />

                        {errors.name && (
                            <span
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                    block
                                "
                            >
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <input
                            placeholder="E-mail"
                            {...register("email")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-primary/30
                                focus:border-primary
                            "
                        />

                        {errors.email && (
                            <span
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                    block
                                "
                            >
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    {/* SENHA */}
                    <div>
                        <input
                            type="password"
                            placeholder="Senha"
                            {...register("password")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-primary/30
                                focus:border-primary
                            "
                        />

                        {errors.password && (
                            <span
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                    block
                                "
                            >
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* ROLE */}
                    <div>
                        <select
                            {...register("role")}
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-border
                                bg-background
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-primary/30
                                focus:border-primary
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
                        <div>
                            <select
                                {...register("sectorId")}
                                className="
            w-full
            h-12
            px-4
            rounded-2xl
            border
            border-border
            bg-background
            outline-none
            transition
            focus:ring-2
            focus:ring-primary/30
            focus:border-primary
        "
                            >
                                <option value="">
                                    Selecione um setor
                                </option>

                                {
                                    sectors.map((sector) => (
                                        <option
                                            key={sector.id}
                                            value={sector.id}
                                        >
                                            {sector.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {errors.role && (
                            <span
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                    block
                                "
                            >
                                {errors.role.message}
                            </span>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        disabled={isPending}
                        className="
                            h-12
                            rounded-2xl
                            bg-primary
                            text-primary-foreground
                            font-bold
                            shadow-lg
                            hover:opacity-90
                            disabled:opacity-50
                            transition
                            mt-2
                        "
                    >
                        {isPending
                            ? "Criando..."
                            : "Criar usuário"}
                    </button>
                </form>
            </div>
        </div>
    )
}