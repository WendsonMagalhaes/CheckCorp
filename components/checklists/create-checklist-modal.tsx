"use client"

import {
    useEffect,
    useState,
    useTransition,
} from "react"

import { X } from "lucide-react"

import {
    useForm,
} from "react-hook-form"

import {
    zodResolver,
} from "@hookform/resolvers/zod"

import {
    useSession,
} from "next-auth/react"

import { toast } from "sonner"

import {
    createChecklistSchema,
    CreateChecklistData,
} from "@/validations/checklist-schema"

import {
    createChecklistAction,
} from "@/app/(dashboard)/checklists/actions"

import {
    getSectorsAction,
} from "@/app/(dashboard)/setores/actions"

import {
    getUsersAction,
} from "@/app/(dashboard)/usuarios/actions"

interface SectorData {
    id: string
    name: string
}

interface UserData {
    id: string
    name: string
    role: string
    sectorId?: string | null
    supervisedSectorIds?: string[]
}

type TargetType =
    | "SECTOR"
    | "USER"

export function CreateChecklistModal() {

    const { data: session } =
        useSession()

    const [
        open,
        setOpen,
    ] = useState(false)

    const [
        sectors,
        setSectors,
    ] = useState<SectorData[]>([])

    const [
        users,
        setUsers,
    ] = useState<UserData[]>([])

    const [
        targetType,
        setTargetType,
    ] = useState<TargetType>("SECTOR")

    const [
        isPending,
        startTransition,
    ] = useTransition()

    const userRole =
        session?.user?.role

    const supervisedSectorIds =
        session?.user?.supervisedSectorIds || []

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {
            errors,
        },
    } = useForm<CreateChecklistData>({
        resolver:
            zodResolver(
                createChecklistSchema
            ),

        defaultValues: {
            sectorId: "",
            assignedUserId: "",
        },
    })

    const selectedSectorId =
        watch("sectorId")

    useEffect(() => {

        async function loadData() {

            try {

                const [
                    sectorsResponse,
                    usersResponse,
                ] = await Promise.all([
                    getSectorsAction(),
                    getUsersAction(),
                ])

                // ======================
                // ADMIN
                // ======================

                if (
                    userRole === "ADMIN"
                ) {

                    setSectors(
                        sectorsResponse
                    )

                    setUsers(
                        usersResponse
                    )

                    return
                }

                // ======================
                // SUPERVISOR
                // ======================

                if (
                    userRole ===
                    "SUPERVISOR"
                ) {

                    const filteredSectors =
                        sectorsResponse.filter(
                            (
                                sector: SectorData
                            ) =>
                                supervisedSectorIds.includes(
                                    sector.id
                                )
                        )

                    const filteredUsers =
                        usersResponse.filter(
                            (
                                user: UserData
                            ) => {

                                // ELE MESMO

                                if (
                                    user.id ===
                                    session?.user?.id
                                ) {
                                    return true
                                }

                                // USUÁRIOS DOS
                                // SETORES SUPERVISIONADOS

                                return (
                                    !!user.sectorId &&
                                    supervisedSectorIds.includes(
                                        user.sectorId
                                    )
                                )
                            }
                        )

                    setSectors(
                        filteredSectors
                    )

                    setUsers(
                        filteredUsers
                    )

                    return
                }

                // ======================
                // EMPLOYEE
                // ======================

                if (
                    userRole ===
                    "EMPLOYEE"
                ) {

                    setTargetType("USER")

                    setValue(
                        "assignedUserId",
                        session?.user?.id || ""
                    )

                    const currentUser =
                        usersResponse.filter(
                            (
                                user: UserData
                            ) =>
                                user.id ===
                                session?.user?.id
                        )

                    setUsers(
                        currentUser
                    )

                    setSectors([])
                }

            } catch (error) {

                console.log(error)

                toast.error(
                    "Erro ao carregar dados"
                )
            }
        }

        if (open) {

            document.body.style.overflow =
                "hidden"

            loadData()

        } else {

            document.body.style.overflow =
                "auto"
        }

        return () => {

            document.body.style.overflow =
                "auto"
        }

    }, [
        open,
        session,
        userRole,
        supervisedSectorIds,
        setValue,
    ])

    // FILTRA USUÁRIOS
    // PELO SETOR SELECIONADO

    const filteredUsers =
        userRole === "SUPERVISOR"

            ? users.filter(
                (user) => {

                    // O próprio supervisor

                    if (
                        user.id ===
                        session?.user?.id
                    ) {
                        return true
                    }

                    // Usuários dos setores supervisionados

                    return (
                        !!user.sectorId &&
                        supervisedSectorIds.includes(
                            user.sectorId
                        )
                    )
                }
            )

            : users

    async function onSubmit(
        data: CreateChecklistData
    ) {

        // REMOVE STRING VAZIA

        if (!data.sectorId) {
            data.sectorId =
                undefined
        }

        if (!data.assignedUserId) {
            data.assignedUserId =
                undefined
        }

        // ======================
        // LIMPA DESTINO
        // ======================

        if (
            targetType === "SECTOR"
        ) {

            data.assignedUserId =
                undefined

        } else {

            data.sectorId =
                undefined
        }

        // ======================
        // EMPLOYEE
        // ======================

        if (
            userRole ===
            "EMPLOYEE"
        ) {

            data.assignedUserId =
                session?.user?.id || ""

            data.sectorId =
                undefined
        }

        startTransition(async () => {

            const response =
                await createChecklistAction(
                    data
                )

            if (!response.success) {

                toast.error(
                    response.message
                )

                return
            }

            toast.success(
                response.message
            )

            reset({
                title: "",
                description: "",
                frequency: undefined,
                sectorId: "",
                assignedUserId: "",
            })

            setTargetType(
                userRole === "EMPLOYEE"
                    ? "USER"
                    : "SECTOR"
            )

            setOpen(false)
        })
    }

    return (
        <>
            {/* BUTTON */}

            <button
                onClick={() =>
                    setOpen(true)
                }
                className="
                    h-12
                    px-5
                    rounded-2xl
                    bg-primary
                    text-primary-foreground
                    font-bold
                    hover:opacity-90
                    transition
                "
            >
                Novo checklist
            </button>

            {/* MODAL */}

            {
                open && (
                    <div className="
                        fixed
                        inset-0
                        z-50
                        bg-black/60
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-4
                    ">

                        <div className="
                            w-full
                            max-w-xl
                            bg-background
                            rounded-3xl
                            border
                            border-border
                            shadow-2xl
                            overflow-hidden
                        ">

                            {/* HEADER */}

                            <div className="
                                px-6
                                py-5
                                border-b
                                border-border
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-black
                                    ">
                                        Novo checklist
                                    </h2>

                                    <p className="
                                        text-sm
                                        text-muted-foreground
                                        mt-1
                                    ">
                                        Configure o destino
                                        do checklist
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(false)
                                    }
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
                                    "
                                >
                                    <X size={18} />
                                </button>

                            </div>

                            {/* FORM */}

                            <form
                                onSubmit={
                                    handleSubmit(
                                        onSubmit
                                    )
                                }
                                className="
                                    p-6
                                    flex
                                    flex-col
                                    gap-5
                                "
                            >

                                {/* TARGET TYPE */}

                                {
                                    userRole !==
                                    "EMPLOYEE" && (
                                        <div className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                        ">

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setTargetType(
                                                        "SECTOR"
                                                    )

                                                    setValue(
                                                        "assignedUserId",
                                                        ""
                                                    )
                                                }}
                                                className={`
                                                    h-14
                                                    rounded-2xl
                                                    border
                                                    text-sm
                                                    font-semibold
                                                    transition
                                                    ${targetType === "SECTOR"
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border"
                                                    }
                                                `}
                                            >
                                                Por setor
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setTargetType(
                                                        "USER"
                                                    )

                                                    setValue(
                                                        "sectorId",
                                                        ""
                                                    )
                                                }}
                                                className={`
                                                    h-14
                                                    rounded-2xl
                                                    border
                                                    text-sm
                                                    font-semibold
                                                    transition
                                                    ${targetType === "USER"
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border"
                                                    }
                                                `}
                                            >
                                                Individual
                                            </button>

                                        </div>
                                    )
                                }

                                {/* TITLE */}

                                <div>

                                    <input
                                        placeholder="Título"
                                        {...register(
                                            "title"
                                        )}
                                        className="
                                            w-full
                                            h-12
                                            px-4
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-background
                                        "
                                    />

                                    {
                                        errors.title && (
                                            <span className="
                                                text-sm
                                                text-destructive
                                            ">
                                                {
                                                    errors
                                                        .title
                                                        .message
                                                }
                                            </span>
                                        )
                                    }

                                </div>

                                {/* DESCRIPTION */}

                                <div>

                                    <textarea
                                        placeholder="Descrição"
                                        {...register(
                                            "description"
                                        )}
                                        className="
                                            w-full
                                            min-h-[120px]
                                            p-4
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-background
                                            resize-none
                                        "
                                    />

                                </div>

                                {/* FREQUENCY */}

                                <div>

                                    <select
                                        {...register(
                                            "frequency"
                                        )}
                                        className="
                                            w-full
                                            h-12
                                            px-4
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-background
                                        "
                                    >

                                        <option value="">
                                            Frequência
                                        </option>

                                        <option value="DAILY">
                                            Diário
                                        </option>

                                        <option value="WEEKLY">
                                            Semanal
                                        </option>

                                        <option value="MONTHLY">
                                            Mensal
                                        </option>

                                    </select>

                                    {
                                        errors.frequency && (
                                            <span className="
                                                text-sm
                                                text-destructive
                                            ">
                                                {
                                                    errors
                                                        .frequency
                                                        .message
                                                }
                                            </span>
                                        )
                                    }

                                </div>

                                {/* SETOR */}

                                {
                                    targetType ===
                                    "SECTOR" && (
                                        <div>

                                            <select
                                                {...register(
                                                    "sectorId"
                                                )}
                                                className="
                                                    w-full
                                                    h-12
                                                    px-4
                                                    rounded-2xl
                                                    border
                                                    border-border
                                                    bg-background
                                                "
                                            >

                                                <option value="">
                                                    Selecione o setor
                                                </option>

                                                {
                                                    sectors.map(
                                                        (
                                                            sector
                                                        ) => (
                                                            <option
                                                                key={
                                                                    sector.id
                                                                }
                                                                value={
                                                                    sector.id
                                                                }
                                                            >
                                                                {
                                                                    sector.name
                                                                }
                                                            </option>
                                                        )
                                                    )
                                                }

                                            </select>

                                        </div>
                                    )
                                }

                                {/* USER */}

                                {
                                    targetType ===
                                    "USER" && (
                                        <div>

                                            <select
                                                {...register(
                                                    "assignedUserId"
                                                )}
                                                className="
                                                    w-full
                                                    h-12
                                                    px-4
                                                    rounded-2xl
                                                    border
                                                    border-border
                                                    bg-background
                                                "
                                            >

                                                <option value="">
                                                    Selecione o usuário
                                                </option>

                                                {
                                                    filteredUsers.map(
                                                        (
                                                            user
                                                        ) => (
                                                            <option
                                                                key={
                                                                    user.id
                                                                }
                                                                value={
                                                                    user.id
                                                                }
                                                            >
                                                                {
                                                                    user.name
                                                                }
                                                            </option>
                                                        )
                                                    )
                                                }

                                            </select>

                                        </div>
                                    )
                                }

                                {/* EMPLOYEE INFO */}

                                {
                                    userRole ===
                                    "EMPLOYEE" && (
                                        <div className="
                                            rounded-2xl
                                            border
                                            border-primary/20
                                            bg-primary/5
                                            p-4
                                            text-sm
                                        ">
                                            Este checklist
                                            será criado
                                            automaticamente
                                            para você.
                                        </div>
                                    )
                                }

                                {/* INFO */}

                                {
                                    targetType ===
                                    "SECTOR" && (
                                        <div className="
                                            text-xs
                                            text-muted-foreground
                                            bg-muted
                                            rounded-2xl
                                            p-3
                                        ">
                                            O checklist será
                                            compartilhado para
                                            todos os usuários
                                            do setor.
                                        </div>
                                    )
                                }

                                {/* ERRORS */}

                                {
                                    (
                                        errors.sectorId ||
                                        errors.assignedUserId
                                    ) && (
                                        <span className="
                                            text-sm
                                            text-destructive
                                        ">
                                            {
                                                errors
                                                    .sectorId
                                                    ?.message ||
                                                errors
                                                    .assignedUserId
                                                    ?.message
                                            }
                                        </span>
                                    )
                                }

                                {/* BUTTON */}

                                <button
                                    disabled={
                                        isPending
                                    }
                                    className="
                                        h-12
                                        rounded-2xl
                                        bg-primary
                                        text-primary-foreground
                                        font-bold
                                        mt-2
                                        hover:opacity-90
                                        transition
                                        disabled:opacity-50
                                    "
                                >

                                    {
                                        isPending
                                            ? "Criando..."
                                            : "Criar checklist"
                                    }

                                </button>

                            </form>

                        </div>

                    </div>
                )
            }
        </>
    )
}