"use client"

import Link from "next/link"

import {
    useEffect,
    useState,
} from "react"

import {
    useSession,
} from "next-auth/react"

import {
    ClipboardList,
    Pencil,
    Trash2,
    Play,
    Check,
} from "lucide-react"

import {
    getChecklistsAction,
} from "@/app/(dashboard)/checklists/actions"

import type {
    ChecklistData,
} from "@/types/checklist"

import {
    EditChecklistModal,
} from "./edit-checklist-modal"

import {
    DeleteChecklistDialog,
} from "./delete-checklist-dialog"

/* =========================================================
   COMPONENT
========================================================= */

export function ChecklistsTable() {

    const { data: session } =
        useSession()

    const [
        checklists,
        setChecklists,
    ] = useState<ChecklistData[]>([])

    const [
        loading,
        setLoading,
    ] = useState(true)

    const [
        openEditModal,
        setOpenEditModal,
    ] = useState(false)

    const [
        selectedChecklist,
        setSelectedChecklist,
    ] = useState<ChecklistData | null>(null)

    const [
        openDeleteDialog,
        setOpenDeleteDialog,
    ] = useState(false)

    const [
        selectedChecklistId,
        setSelectedChecklistId,
    ] = useState("")

    const userId =
        session?.user?.id

    const userRole =
        session?.user?.role

    /* =========================================================
       PERMISSION
    ========================================================= */

    function canManageChecklist(
        checklist: ChecklistData
    ) {

        if (userRole === "ADMIN") {
            return true
        }

        return (
            checklist.createdById === userId
        )
    }

    /* =========================================================
       LOAD
    ========================================================= */

    async function loadChecklists() {

        try {

            const response =
                await getChecklistsAction()

            setChecklists(response)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {
        loadChecklists()
    }, [])

    /* =========================================================
       FREQUENCY
    ========================================================= */

    function getFrequencyLabel(
        frequency: ChecklistData["frequency"]
    ) {

        switch (frequency) {

            case "DAILY":
                return "Diário"

            case "WEEKLY":
                return "Semanal"

            case "MONTHLY":
                return "Mensal"

            default:
                return "Não definido"
        }
    }

    /* =========================================================
       EXECUTION
    ========================================================= */

    function getExecutionState(
        checklist: ChecklistData
    ) {

        const execution =
            checklist.execution

        return {

            isCompleted:
                execution?.status ===
                "COMPLETED",

            isInProgress:
                execution?.status ===
                "IN_PROGRESS",
        }
    }

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <div className="
                bg-card
                border
                border-border
                rounded-3xl
                p-6
                sm:p-8
                text-muted-foreground
            ">
                Carregando checklists...
            </div>
        )
    }

    if (!checklists.length) {

        return (
            <div className="
                bg-card
                border
                border-border
                rounded-3xl
                p-8
                sm:p-12
                text-center
            ">
                <h3 className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-foreground
                ">
                    Nenhum checklist encontrado
                </h3>

                <p className="
                    text-sm
                    sm:text-base
                    text-muted-foreground
                    mt-2
                ">
                    Crie o primeiro checklist
                </p>
            </div>
        )
    }

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <>
            {/* DESKTOP */}

            <div className="
                hidden
                lg:block
                bg-card
                border
                border-border
                rounded-3xl
                overflow-hidden
            ">
                <div className="
                    overflow-x-auto
                ">
                    <table className="
                        w-full
                        min-w-[950px]
                    ">

                        <thead className="
                            bg-muted/50
                            border-b
                            border-border
                        ">
                            <tr>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                ">
                                    Checklist
                                </th>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                ">
                                    Destino
                                </th>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                ">
                                    Frequência
                                </th>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                ">
                                    Status
                                </th>

                                <th className="
                                    text-right
                                    px-6
                                    py-4
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                ">
                                    Ações
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {
                                checklists.map((checklist) => {

                                    const canEdit =
                                        canManageChecklist(
                                            checklist
                                        )

                                    const {
                                        isCompleted,
                                        isInProgress,
                                    } = getExecutionState(
                                        checklist
                                    )

                                    return (
                                        <tr
                                            key={checklist.id}
                                            className="
                                                border-b
                                                border-border
                                                hover:bg-muted/40
                                                transition
                                            "
                                        >

                                            {/* CHECKLIST */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                ">

                                                    {/* EXECUTION */}

                                                    {
                                                        isCompleted ? (

                                                            <div className="
                                                                w-11
                                                                h-11
                                                                rounded-2xl
                                                                bg-primary/15
                                                                text-primary
                                                                flex
                                                                items-center
                                                                justify-center
                                                                shrink-0
                                                            ">
                                                                <Check
                                                                    size={18}
                                                                />
                                                            </div>

                                                        ) : (

                                                            <Link
                                                                href={`/checklists/${checklist.id}/executar`}
                                                                className={`
                                                                    w-11
                                                                    h-11
                                                                    rounded-2xl
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    shrink-0
                                                                    transition

                                                                    ${isInProgress
                                                                        ? "bg-yellow-500/15 text-yellow-600"
                                                                        : "bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
                                                                    }
                                                                `}
                                                            >
                                                                <Play
                                                                    size={18}
                                                                />
                                                            </Link>
                                                        )
                                                    }

                                                    {/* CONTENT */}

                                                    <Link
                                                        href={`/checklists/${checklist.id}`}
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-4
                                                            min-w-0
                                                            flex-1
                                                        "
                                                    >

                                                        <div className="
                                                            w-12
                                                            h-12
                                                            rounded-2xl
                                                            bg-primary
                                                            text-primary-foreground
                                                            flex
                                                            items-center
                                                            justify-center
                                                            shrink-0
                                                        ">
                                                            <ClipboardList
                                                                size={20}
                                                            />
                                                        </div>

                                                        <div className="
                                                            min-w-0
                                                        ">
                                                            <h4 className="
                                                                font-bold
                                                                text-foreground
                                                                truncate
                                                            ">
                                                                {
                                                                    checklist.title
                                                                }
                                                            </h4>

                                                            <p className="
                                                                text-sm
                                                                text-muted-foreground
                                                                truncate
                                                            ">
                                                                {
                                                                    checklist.description ||
                                                                    "Sem descrição"
                                                                }
                                                            </p>
                                                        </div>

                                                    </Link>

                                                </div>
                                            </td>

                                            {/* DESTINATION */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                <span className="
                                                    text-sm
                                                    text-muted-foreground
                                                ">
                                                    {
                                                        checklist.sector?.name ||
                                                        checklist.assignedUser?.name ||
                                                        "Individual"
                                                    }
                                                </span>
                                            </td>

                                            {/* FREQUENCY */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                <div className="
                                                    inline-flex
                                                    items-center
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    bg-secondary
                                                    text-secondary-foreground
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {
                                                        getFrequencyLabel(
                                                            checklist.frequency
                                                        )
                                                    }
                                                </div>
                                            </td>

                                            {/* STATUS */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                <span className={`
                                                    inline-flex
                                                    items-center
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    text-sm
                                                    font-semibold

                                                    ${checklist.active
                                                        ? "bg-primary/15 text-primary"
                                                        : "bg-destructive/15 text-destructive"
                                                    }
                                                `}>
                                                    {
                                                        checklist.active
                                                            ? "Ativo"
                                                            : "Inativo"
                                                    }
                                                </span>
                                            </td>

                                            {/* ACTIONS */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                {
                                                    canEdit && (
                                                        <div className="
                                                            flex
                                                            justify-end
                                                            gap-2
                                                        ">

                                                            {/* EDIT */}

                                                            <button
                                                                onClick={() => {

                                                                    setSelectedChecklist(
                                                                        checklist
                                                                    )

                                                                    setOpenEditModal(true)
                                                                }}
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    rounded-xl
                                                                    border
                                                                    border-border
                                                                    bg-background
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    hover:bg-muted
                                                                    transition
                                                                "
                                                            >
                                                                <Pencil
                                                                    size={18}
                                                                />
                                                            </button>

                                                            {/* DELETE */}

                                                            <button
                                                                onClick={() => {

                                                                    setSelectedChecklistId(
                                                                        checklist.id
                                                                    )

                                                                    setOpenDeleteDialog(true)
                                                                }}
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    rounded-xl
                                                                    bg-destructive/10
                                                                    text-destructive
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    hover:bg-destructive
                                                                    hover:text-white
                                                                    transition
                                                                "
                                                            >
                                                                <Trash2
                                                                    size={18}
                                                                />
                                                            </button>

                                                        </div>
                                                    )
                                                }
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                    </table>
                </div>
            </div>

            {/* MOBILE */}

            <div className="
                flex
                flex-col
                gap-4
                lg:hidden
            ">
                {
                    checklists.map((checklist) => {

                        const canEdit =
                            canManageChecklist(
                                checklist
                            )

                        const {
                            isCompleted,
                            isInProgress,
                        } = getExecutionState(
                            checklist
                        )

                        return (
                            <div
                                key={checklist.id}
                                className="
                                    bg-card
                                    border
                                    border-border
                                    rounded-3xl
                                    p-5
                                    shadow-sm
                                "
                            >

                                <div className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                ">

                                    <div className="
                                        flex
                                        items-start
                                        gap-4
                                        min-w-0
                                        flex-1
                                    ">

                                        {/* EXECUTION */}

                                        {
                                            isCompleted ? (

                                                <div className="
                                                    w-11
                                                    h-11
                                                    rounded-2xl
                                                    bg-primary/15
                                                    text-primary
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                ">
                                                    <Check
                                                        size={18}
                                                    />
                                                </div>

                                            ) : (

                                                <Link
                                                    href={`/checklists/${checklist.id}/executar`}
                                                    className={`
                                                        w-11
                                                        h-11
                                                        rounded-2xl
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0

                                                        ${isInProgress
                                                            ? "bg-yellow-500/15 text-yellow-600"
                                                            : "bg-primary/15 text-primary"
                                                        }
                                                    `}
                                                >
                                                    <Play
                                                        size={18}
                                                    />
                                                </Link>
                                            )
                                        }

                                        {/* CONTENT */}

                                        <Link
                                            href={`/checklists/${checklist.id}`}
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div className="
                                                w-12
                                                h-12
                                                rounded-2xl
                                                bg-primary
                                                text-primary-foreground
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            ">
                                                <ClipboardList
                                                    size={20}
                                                />
                                            </div>

                                            <div className="
                                                min-w-0
                                            ">
                                                <h4 className="
                                                    font-bold
                                                    text-foreground
                                                    truncate
                                                ">
                                                    {
                                                        checklist.title
                                                    }
                                                </h4>

                                                <p className="
                                                    text-sm
                                                    text-muted-foreground
                                                    truncate
                                                ">
                                                    {
                                                        checklist.description ||
                                                        "Sem descrição"
                                                    }
                                                </p>
                                            </div>

                                        </Link>

                                    </div>

                                    {/* STATUS */}

                                    <span className={`
                                        inline-flex
                                        items-center
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-bold
                                        whitespace-nowrap

                                        ${checklist.active
                                            ? "bg-primary/15 text-primary"
                                            : "bg-destructive/15 text-destructive"
                                        }
                                    `}>
                                        {
                                            checklist.active
                                                ? "Ativo"
                                                : "Inativo"
                                        }
                                    </span>

                                </div>

                                {/* INFO */}

                                <div className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                ">

                                    <div className="
                                        inline-flex
                                        items-center
                                        px-3
                                        py-1.5
                                        rounded-full
                                        bg-secondary
                                        text-secondary-foreground
                                        text-sm
                                        font-medium
                                    ">
                                        {
                                            getFrequencyLabel(
                                                checklist.frequency
                                            )
                                        }
                                    </div>

                                    <div className="
                                        inline-flex
                                        items-center
                                        px-3
                                        py-1.5
                                        rounded-full
                                        bg-muted
                                        text-muted-foreground
                                        text-sm
                                    ">
                                        {
                                            checklist.sector?.name ||
                                            checklist.assignedUser?.name ||
                                            "Individual"
                                        }
                                    </div>

                                </div>

                                {/* ACTIONS */}

                                {
                                    canEdit && (
                                        <div className="
                                            mt-5
                                            flex
                                            justify-end
                                            gap-2
                                        ">

                                            {/* EDIT */}

                                            <button
                                                onClick={() => {

                                                    setSelectedChecklist(
                                                        checklist
                                                    )

                                                    setOpenEditModal(true)
                                                }}
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-2xl
                                                    border
                                                    border-border
                                                    bg-background
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                            >
                                                <Pencil
                                                    size={18}
                                                />
                                            </button>

                                            {/* DELETE */}

                                            <button
                                                onClick={() => {

                                                    setSelectedChecklistId(
                                                        checklist.id
                                                    )

                                                    setOpenDeleteDialog(true)
                                                }}
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-2xl
                                                    bg-destructive/10
                                                    text-destructive
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                            >
                                                <Trash2
                                                    size={18}
                                                />
                                            </button>

                                        </div>
                                    )
                                }

                            </div>
                        )
                    })
                }
            </div>

            {/* EDIT MODAL */}

            {
                selectedChecklist && (
                    <EditChecklistModal
                        open={openEditModal}
                        onClose={() =>
                            setOpenEditModal(false)
                        }
                        checklist={selectedChecklist}
                    />
                )
            }

            {/* DELETE DIALOG */}

            <DeleteChecklistDialog
                open={openDeleteDialog}
                onClose={() =>
                    setOpenDeleteDialog(false)
                }
                checklistId={selectedChecklistId}
            />

        </>
    )
}