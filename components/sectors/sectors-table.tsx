"use client"

import { useEffect, useState } from "react"

import {
    Building2,
    Pencil,
    Trash2,
} from "lucide-react"

import {
    getSectorsAction,
} from "@/app/(dashboard)/setores/actions"

import {
    EditSectorModal,
} from "./edit-sector-modal"

import {
    DeleteSectorDialog,
} from "./delete-sector-dialog"

interface SectorData {
    id: string
    name: string
    description?: string | null
    active: boolean
}

export function SectorsTable() {

    const [sectors, setSectors] =
        useState<SectorData[]>([])

    const [loading, setLoading] =
        useState(true)

    const [
        openEditModal,
        setOpenEditModal,
    ] = useState(false)

    const [
        selectedSector,
        setSelectedSector,
    ] = useState<SectorData | null>(null)

    const [
        openDeleteDialog,
        setOpenDeleteDialog,
    ] = useState(false)

    const [
        selectedSectorId,
        setSelectedSectorId,
    ] = useState("")

    async function loadSectors() {

        try {

            const response =
                await getSectorsAction()

            setSectors(response)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {
        loadSectors()
    }, [])

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
                Carregando setores...
            </div>
        )
    }

    if (!sectors.length) {

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
                    Nenhum setor encontrado
                </h3>

                <p className="
                    text-sm
                    sm:text-base
                    text-muted-foreground
                    mt-2
                ">
                    Crie o primeiro setor
                </p>
            </div>
        )
    }

    return (
        <>
            {/* DESKTOP TABLE */}

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
                        min-w-[850px]
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
                                sectors.map((sector) => (
                                    <tr
                                        key={sector.id}
                                        className="
                                            border-b
                                            border-border
                                            hover:bg-muted/40
                                            transition
                                        "
                                    >
                                        {/* SETOR */}
                                        <td className="
                                            px-6
                                            py-5
                                        ">
                                            <div className="
                                                flex
                                                items-center
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
                                                    shrink-0
                                                ">
                                                    <Building2 size={20} />
                                                </div>

                                                <div>
                                                    <h4 className="
                                                        font-bold
                                                        text-foreground
                                                    ">
                                                        {sector.name}
                                                    </h4>

                                                    <p className="
                                                        text-sm
                                                        text-muted-foreground
                                                        mt-1
                                                    ">
                                                        {
                                                            sector.description ||
                                                            "Sem descrição"
                                                        }
                                                    </p>
                                                </div>
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

                                                ${sector.active
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-destructive/15 text-destructive"
                                                }
                                            `}>
                                                {
                                                    sector.active
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

                                                        setSelectedSector(sector)

                                                        setOpenEditModal(true)
                                                    }}
                                                    className="
                                                        w-10
                                                        h-10
                                                        rounded-xl
                                                        border
                                                        border-border
                                                        bg-background
                                                        text-muted-foreground
                                                        hover:bg-muted
                                                        hover:text-foreground
                                                        transition
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* EXCLUIR */}
                                                <button
                                                    onClick={() => {

                                                        setSelectedSectorId(
                                                            sector.id
                                                        )

                                                        setOpenDeleteDialog(true)
                                                    }}
                                                    className="
                                                        w-10
                                                        h-10
                                                        rounded-xl
                                                        bg-destructive/10
                                                        text-destructive
                                                        hover:bg-destructive
                                                        hover:text-white
                                                        transition
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE CARDS */}

            <div className="
                flex
                flex-col
                gap-4
                lg:hidden
            ">
                {
                    sectors.map((sector) => (
                        <div
                            key={sector.id}
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
                                    items-center
                                    gap-4
                                    min-w-0
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
                                        shrink-0
                                    ">
                                        <Building2 size={20} />
                                    </div>

                                    <div className="
                                        min-w-0
                                    ">
                                        <h4 className="
                                            font-bold
                                            text-foreground
                                            truncate
                                        ">
                                            {sector.name}
                                        </h4>

                                        <p className="
                                            text-sm
                                            text-muted-foreground
                                            truncate
                                            mt-1
                                        ">
                                            {
                                                sector.description ||
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
                                    whitespace-nowrap

                                    ${sector.active
                                        ? "bg-primary/15 text-primary"
                                        : "bg-destructive/15 text-destructive"
                                    }
                                `}>
                                    {
                                        sector.active
                                            ? "Ativo"
                                            : "Inativo"
                                    }
                                </span>
                            </div>

                            {/* AÇÕES */}
                            <div className="
                                mt-5
                                flex
                                justify-end
                                gap-2
                            ">
                                {/* EDITAR */}
                                <button
                                    onClick={() => {

                                        setSelectedSector(sector)

                                        setOpenEditModal(true)
                                    }}
                                    className="
                                        w-11
                                        h-11
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-background
                                        text-muted-foreground
                                        hover:bg-muted
                                        hover:text-foreground
                                        transition
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Pencil size={18} />
                                </button>

                                {/* EXCLUIR */}
                                <button
                                    onClick={() => {

                                        setSelectedSectorId(
                                            sector.id
                                        )

                                        setOpenDeleteDialog(true)
                                    }}
                                    className="
                                        w-11
                                        h-11
                                        rounded-2xl
                                        bg-destructive/10
                                        text-destructive
                                        hover:bg-destructive
                                        hover:text-white
                                        transition
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* MODAL EDIT */}

            {
                selectedSector && (
                    <EditSectorModal
                        open={openEditModal}
                        onClose={() =>
                            setOpenEditModal(false)
                        }
                        sector={selectedSector}
                    />
                )
            }

            {/* DIALOG DELETE */}

            <DeleteSectorDialog
                open={openDeleteDialog}
                onClose={() =>
                    setOpenDeleteDialog(false)
                }
                sectorId={selectedSectorId}
            />
        </>
    )
}