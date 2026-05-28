"use client"

import { useEffect, useState } from "react"

import {
    Shield,
    User,
    UserCog,
    Pencil,
    Trash2,
} from "lucide-react"

import { getUsersAction } from "@/app/(dashboard)/usuarios/actions"

import {
    EditUserModal,
} from "./edit-user-modal"

import {
    DeleteUserDialog,
} from "./delete-user-dialog"

interface UserData {
    id: string
    name: string
    email: string
    role: string
    active: boolean

    sector?: {
        id: string
        name: string
    } | null
}

export function UsersTable() {

    const [users, setUsers] =
        useState<UserData[]>([])

    const [loading, setLoading] =
        useState(true)

    const [
        openEditModal,
        setOpenEditModal,
    ] = useState(false)

    const [
        selectedUser,
        setSelectedUser,
    ] = useState<UserData | null>(null)

    const [
        openDeleteDialog,
        setOpenDeleteDialog,
    ] = useState(false)

    const [
        selectedUserId,
        setSelectedUserId,
    ] = useState("")

    async function loadUsers() {

        try {

            const response =
                await getUsersAction()

            setUsers(response)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    function getRoleLabel(role: string) {

        switch (role) {

            case "ADMIN":
                return "Administrador"

            case "SUPERVISOR":
                return "Supervisor"

            default:
                return "Funcionário"
        }
    }

    function getRoleIcon(role: string) {

        switch (role) {

            case "ADMIN":
                return <Shield size={16} />

            case "SUPERVISOR":
                return <UserCog size={16} />

            default:
                return <User size={16} />
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
                sm:p-8
                text-muted-foreground
            ">
                Carregando usuários...
            </div>
        )
    }

    if (!users.length) {

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
                    Nenhum usuário encontrado
                </h3>

                <p className="
                    text-sm
                    sm:text-base
                    text-muted-foreground
                    mt-2
                ">
                    Crie o primeiro usuário
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
                                    Usuário
                                </th>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                ">
                                    Cargo
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
                                users.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="
                                            border-b
                                            border-border
                                            hover:bg-muted/40
                                            transition
                                        "
                                    >

                                        {/* USER */}

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
                                                    bg-primary
                                                    text-primary-foreground
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-bold
                                                    shrink-0
                                                ">
                                                    {
                                                        user.name
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    }
                                                </div>

                                                <div>
                                                    <h4 className="
                                                        font-bold
                                                        text-foreground
                                                    ">
                                                        {user.name}
                                                    </h4>

                                                    <p className="
                                                        text-sm
                                                        text-muted-foreground
                                                    ">
                                                        {user.email}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        {/* ROLE */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">
                                            <div className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-1.5
                                                rounded-full
                                                bg-secondary
                                                text-secondary-foreground
                                                text-sm
                                                font-medium
                                            ">
                                                {
                                                    getRoleIcon(
                                                        user.role
                                                    )
                                                }

                                                {
                                                    getRoleLabel(
                                                        user.role
                                                    )
                                                }
                                            </div>
                                        </td>

                                        {/* SECTOR */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">
                                            <span className="
                                                text-sm
                                                text-muted-foreground
                                            ">
                                                {
                                                    user.sector?.name ||
                                                    "Sem setor"
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

                                                ${user.active
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-destructive/15 text-destructive"
                                                }
                                            `}>
                                                {
                                                    user.active
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
                                            <div className="
                                                flex
                                                justify-end
                                                gap-2
                                            ">

                                                {/* EDIT */}

                                                <button
                                                    onClick={() => {

                                                        setSelectedUser(user)

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

                                                        setSelectedUserId(
                                                            user.id
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
                                        </td>

                                    </tr>
                                ))
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
                    users.map((user) => (

                        <div
                            key={user.id}
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
                                        bg-primary
                                        text-primary-foreground
                                        flex
                                        items-center
                                        justify-center
                                        font-bold
                                        shrink-0
                                    ">
                                        {
                                            user.name
                                                .charAt(0)
                                                .toUpperCase()
                                        }
                                    </div>

                                    <div className="
                                        min-w-0
                                    ">
                                        <h4 className="
                                            font-bold
                                            text-foreground
                                            truncate
                                        ">
                                            {user.name}
                                        </h4>

                                        <p className="
                                            text-sm
                                            text-muted-foreground
                                            truncate
                                        ">
                                            {user.email}
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

                                    ${user.active
                                        ? "bg-primary/15 text-primary"
                                        : "bg-destructive/15 text-destructive"
                                    }
                                `}>
                                    {
                                        user.active
                                            ? "Ativo"
                                            : "Inativo"
                                    }
                                </span>

                            </div>

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
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-secondary
                                    text-secondary-foreground
                                    text-sm
                                    font-medium
                                ">
                                    {
                                        getRoleIcon(
                                            user.role
                                        )
                                    }

                                    {
                                        getRoleLabel(
                                            user.role
                                        )
                                    }
                                </div>

                                <div className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-muted
                                    text-muted-foreground
                                    text-sm
                                ">
                                    {
                                        user.sector?.name ||
                                        "Sem setor"
                                    }
                                </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="
                                mt-5
                                flex
                                justify-end
                                gap-2
                            ">

                                {/* EDIT */}

                                <button
                                    onClick={() => {

                                        setSelectedUser(user)

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

                                        setSelectedUserId(
                                            user.id
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

                        </div>
                    ))
                }
            </div>

            {/* EDIT MODAL */}

            {
                selectedUser && (
                    <EditUserModal
                        open={openEditModal}
                        onClose={() =>
                            setOpenEditModal(false)
                        }
                        user={selectedUser}
                    />
                )
            }

            {/* DELETE DIALOG */}

            <DeleteUserDialog
                open={openDeleteDialog}
                onClose={() =>
                    setOpenDeleteDialog(false)
                }
                userId={selectedUserId}
            />

        </>
    )
}