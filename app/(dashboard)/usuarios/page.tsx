"use client"

import { useState } from "react"

import { Plus } from "lucide-react"

import { CreateUserModal } from "@/components/users/create-user-modal"

import { UsersTable } from "@/components/users/users-table"

export default function UsersPage() {

    const [
        openCreateModal,
        setOpenCreateModal,
    ] = useState(false)

    return (
        <div className="
            w-full
        ">
            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    mb-8
                "
            >
                <div>

                </div>

                <button
                    onClick={() =>
                        setOpenCreateModal(true)
                    }
                    className="
                        h-11
                        sm:h-12
                        px-5
                        sm:px-6
                        rounded-2xl
                        bg-primary
                        text-primary-foreground
                        font-bold
                        flex
                        items-center
                        justify-center
                        gap-2
                        shadow-lg
                        hover:opacity-90
                        transition
                        w-full
                        sm:w-auto
                    "
                >
                    <Plus size={18} />

                    Novo usuário
                </button>
            </div>

            <div className="
                overflow-x-auto
            ">
                <UsersTable />
            </div>

            <CreateUserModal
                open={openCreateModal}
                onClose={() =>
                    setOpenCreateModal(false)
                }
            />
        </div>
    )
}