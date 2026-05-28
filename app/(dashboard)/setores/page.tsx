"use client"

import { useState } from "react"

import {
    CreateSectorModal,
} from "@/components/sectors/create-sector-modal"
import { SectorsTable } from "@/components/sectors/sectors-table"



export default function SectorsPage() {

    const [
        openCreateModal,
        setOpenCreateModal,
    ] = useState(false)

    return (
        <div>
            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                mb-8
            ">
                <div>

                </div>

                <button
                    onClick={() =>
                        setOpenCreateModal(true)
                    }
                    className="
                        h-11
                        px-5
                        rounded-2xl
                        bg-primary
                        text-white
                        font-bold
                    "
                >
                    Novo setor
                </button>
            </div>

            <SectorsTable />

            <CreateSectorModal
                open={openCreateModal}
                onClose={() =>
                    setOpenCreateModal(false)
                }
            />
        </div>
    )
}