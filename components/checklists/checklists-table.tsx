"use client"

import Link from "next/link"

import {
    useEffect,
    useState,
} from "react"

import {
    ClipboardList,
    Pencil,
    Trash2,
} from "lucide-react"

import {
    getChecklistsAction,
} from "@/app/(dashboard)/checklists/actions"

import {
    EditChecklistModal,
} from "./edit-checklist-modal"

import {
    DeleteChecklistDialog,
} from "./delete-checklist-dialog"

interface ChecklistData {
    id: string
    title: string
    description?: string | null

    frequency:
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"

    active: boolean

    sector: {
        id: string
        name: string
    }
}

export function ChecklistsTable() {

    const [
        checklists,
        setChecklists,
    ] = useState<ChecklistData[]>([])

    const [
        loading,
        setLoading,
    ] = useState(true)

    // EDIT
    const [
        openEditModal,
        setOpenEditModal,
    ] = useState(false)

    const [
        selectedChecklist,
        setSelectedChecklist,
    ] = useState<ChecklistData | null>(null)

    // DELETE
    const [
        openDeleteDialog,
        setOpenDeleteDialog,
    ] = useState(false)

    const [
        selectedChecklistId,
        setSelectedChecklistId,
    ] = useState("")

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

    function getFrequencyLabel(
        frequency: string
    ) {

        switch (frequency) {

            case "DAILY":
                return "Diário"

            case "WEEKLY":
                return "Semanal"

            default:
                return "Mensal"
        }
    }

    if (loading) {

        return (
            <div className="
                bg-card
                border
                border-border
                rounded-3xl
                p-6
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
                p-12
                text-center
            ">
                <h3 className="
                    text-xl
                    font-bold
                ">
                    Nenhum checklist encontrado
                </h3>

                <p className="
                    text-muted-foreground
                    mt-2
                ">
                    Crie o primeiro checklist
                </p>
            </div>
        )
    }

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
                                    Setor
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
                                checklists.map(
                                    (
                                        checklist
                                    ) => (
                                        <tr
                                            key={
                                                checklist.id
                                            }
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
                                                <Link
                                                    href={`/checklists/${checklist.id}/executar`}
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-4
                                                        group
                                                    "
                                                >
                                                    <div className="
                                                        w-12
                                                        h-12
                                                        rounded-2xl
                                                        bg-primary/15
                                                        text-primary
                                                        flex
                                                        items-center
                                                        justify-center
                                                        transition
                                                        group-hover:bg-primary
                                                        group-hover:text-white
                                                    ">
                                                        <ClipboardList
                                                            size={20}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="
                                                            font-bold
                                                            transition
                                                            group-hover:text-primary
                                                        ">
                                                            {
                                                                checklist.title
                                                            }
                                                        </h4>

                                                        <p className="
                                                            text-sm
                                                            text-muted-foreground
                                                            mt-1
                                                        ">
                                                            {
                                                                checklist.description ||
                                                                "Sem descrição"
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* SETOR */}

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
                                                        checklist
                                                            .sector
                                                            .name
                                                    }
                                                </div>
                                            </td>

                                            {/* FREQUÊNCIA */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                <span className="
                                                    text-sm
                                                    font-semibold
                                                ">
                                                    {
                                                        getFrequencyLabel(
                                                            checklist.frequency
                                                        )
                                                    }
                                                </span>
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

                                            {/* AÇÕES */}

                                            <td className="
                                                px-6
                                                py-5
                                            ">
                                                <div className="
                                                    flex
                                                    justify-end
                                                    gap-2
                                                ">

                                                    {/* EDITAR */}

                                                    <button
                                                        onClick={() => {

                                                            setSelectedChecklist(
                                                                checklist
                                                            )

                                                            setOpenEditModal(
                                                                true
                                                            )
                                                        }}
                                                        className="
                                                            w-10
                                                            h-10
                                                            rounded-xl
                                                            border
                                                            border-border
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

                                                    {/* EXCLUIR */}

                                                    <button
                                                        onClick={() => {

                                                            setSelectedChecklistId(
                                                                checklist.id
                                                            )

                                                            setOpenDeleteDialog(
                                                                true
                                                            )
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
                                            </td>

                                        </tr>
                                    )
                                )
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
                    checklists.map(
                        (
                            checklist
                        ) => (
                            <Link
                                href={`/checklists/${checklist.id}/executar`}
                                key={
                                    checklist.id
                                }
                                className="
                                    bg-card
                                    border
                                    border-border
                                    rounded-3xl
                                    p-5
                                    transition
                                    hover:border-primary/30
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
                                        gap-4
                                    ">

                                        <div className="
                                            w-12
                                            h-12
                                            rounded-2xl
                                            bg-primary/15
                                            text-primary
                                            flex
                                            items-center
                                            justify-center
                                        ">
                                            <ClipboardList
                                                size={20}
                                            />
                                        </div>

                                        <div>
                                            <h4 className="
                                                font-bold
                                            ">
                                                {
                                                    checklist.title
                                                }
                                            </h4>

                                            <p className="
                                                text-sm
                                                text-muted-foreground
                                                mt-1
                                            ">
                                                {
                                                    checklist.description ||
                                                    "Sem descrição"
                                                }
                                            </p>
                                        </div>

                                    </div>

                                    <span className={`
                                        inline-flex
                                        items-center
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-bold

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

                                <div className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    gap-2
                                ">

                                    <div className="
                                        px-3
                                        py-1.5
                                        rounded-full
                                        bg-secondary
                                        text-secondary-foreground
                                        text-sm
                                        font-medium
                                    ">
                                        {
                                            checklist
                                                .sector
                                                .name
                                        }
                                    </div>

                                    <div className="
                                        px-3
                                        py-1.5
                                        rounded-full
                                        border
                                        border-border
                                        text-sm
                                        font-medium
                                    ">
                                        {
                                            getFrequencyLabel(
                                                checklist.frequency
                                            )
                                        }
                                    </div>

                                </div>

                                {/* AÇÕES */}

                                <div
                                    onClick={(e) =>
                                        e.preventDefault()
                                    }
                                    className="
                                        mt-5
                                        flex
                                        justify-end
                                        gap-2
                                    "
                                >

                                    {/* EDITAR */}

                                    <button
                                        onClick={() => {

                                            setSelectedChecklist(
                                                checklist
                                            )

                                            setOpenEditModal(
                                                true
                                            )
                                        }}
                                        className="
                                            w-11
                                            h-11
                                            rounded-2xl
                                            border
                                            border-border
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <Pencil
                                            size={18}
                                        />
                                    </button>

                                    {/* EXCLUIR */}

                                    <button
                                        onClick={() => {

                                            setSelectedChecklistId(
                                                checklist.id
                                            )

                                            setOpenDeleteDialog(
                                                true
                                            )
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

                            </Link>
                        )
                    )
                }
            </div>

            {/* MODAL EDIT */}

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

            {/* DIALOG DELETE */}

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