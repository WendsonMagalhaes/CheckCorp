"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { ClipboardList, Pencil, Trash2, Play, Check } from "lucide-react"

import { getChecklistsAction } from "@/app/(dashboard)/checklists/actions"
import type { ChecklistData } from "@/types/checklist"

import { EditChecklistModal } from "./edit-checklist-modal"
import { DeleteChecklistDialog } from "./delete-checklist-dialog"

/* =========================================================
   COMPONENT
========================================================= */

export function ChecklistsTable() {
    const { data: session } = useSession()

    const [checklists, setChecklists] = useState<ChecklistData[]>([])
    const [loading, setLoading] = useState(true)

    const [openEditModal, setOpenEditModal] = useState(false)
    const [selectedChecklist, setSelectedChecklist] =
        useState<ChecklistData | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [selectedChecklistId, setSelectedChecklistId] = useState("")

    const userId = session?.user?.id
    const userRole = session?.user?.role

    /* =========================================================
       PERMISSÃO
    ========================================================= */

    function canEditChecklist(checklist: ChecklistData) {
        if (userRole === "ADMIN") return true
        if (userRole === "SUPERVISOR") return true
        return checklist.createdById === userId
    }

    /* =========================================================
       LOAD
    ========================================================= */

    async function loadChecklists() {
        try {
            const response = await getChecklistsAction()
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
       FREQUÊNCIA
    ========================================================= */

    function getFrequencyLabel(frequency: ChecklistData["frequency"]) {
        switch (frequency) {
            case "DAILY":
                return "Diário"
            case "WEEKLY":
                return "Semanal"
            case "MONTHLY":
                return "Mensal"
        }
    }

    /* =========================================================
       EXECUÇÃO
    ========================================================= */

    function getExecutionState(checklist: ChecklistData) {
        const execution = checklist.execution

        return {
            isCompleted: execution?.status === "COMPLETED",
            isInProgress: execution?.status === "IN_PROGRESS",
        }
    }

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="bg-card border border-border rounded-3xl p-6 text-muted-foreground">
                Carregando checklists...
            </div>
        )
    }

    if (!checklists.length) {
        return (
            <div className="bg-card border border-border rounded-3xl p-12 text-center">
                <h3 className="text-xl font-bold">
                    Nenhum checklist encontrado
                </h3>
                <p className="text-muted-foreground mt-2">
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
            <div className="hidden lg:block bg-card border border-border rounded-3xl overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">

                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-bold text-muted-foreground">
                                    Checklist
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-muted-foreground">
                                    Destino
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-muted-foreground">
                                    Frequência
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-muted-foreground">
                                    Status
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-bold text-muted-foreground">
                                    Ações
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {checklists.map((checklist) => {
                                const canEdit = canEditChecklist(checklist)
                                const { isCompleted, isInProgress } =
                                    getExecutionState(checklist)

                                return (
                                    <tr
                                        key={checklist.id}
                                        className="border-b border-border hover:bg-muted/40 transition"
                                    >
                                        {/* CHECKLIST */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-between gap-4">

                                                {isCompleted ? (
                                                    <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                                                        <Check size={18} />
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href={`/checklists/${checklist.id}/executar`}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isInProgress
                                                            ? "bg-yellow-500/20 text-yellow-600"
                                                            : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                            }`}
                                                    >
                                                        <Play size={18} />
                                                    </Link>
                                                )}

                                                <Link
                                                    href={`/checklists/${checklist.id}`}
                                                    className="flex items-center gap-4 flex-1"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                                                        <ClipboardList size={20} />
                                                    </div>

                                                    <div>
                                                        <h4 className="font-bold">
                                                            {checklist.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {checklist.description || "Sem descrição"}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </td>

                                        {/* DESTINO */}
                                        <td className="px-6 py-5">
                                            {checklist.sector?.name ??
                                                checklist.assignedUser?.name ??
                                                "Individual"}
                                        </td>

                                        {/* FREQUÊNCIA */}
                                        <td className="px-6 py-5">
                                            {getFrequencyLabel(checklist.frequency)}
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-6 py-5">
                                            {checklist.active ? "Ativo" : "Inativo"}
                                        </td>

                                        {/* AÇÕES */}
                                        <td className="px-6 py-5 text-right">
                                            {canEdit && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedChecklist(checklist)
                                                            setOpenEditModal(true)
                                                        }}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedChecklistId(checklist.id)
                                                            setOpenDeleteDialog(true)
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE */}
            <div className="flex flex-col gap-4 lg:hidden">
                {checklists.map((checklist) => {
                    const canEdit = canEditChecklist(checklist)
                    const { isCompleted } = getExecutionState(checklist)

                    return (
                        <div
                            key={checklist.id}
                            className="bg-card border border-border rounded-3xl p-5"
                        >
                            <div className="flex items-start justify-between gap-4">

                                {isCompleted ? (
                                    <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center">
                                        <Check size={18} />
                                    </div>
                                ) : (
                                    <Link
                                        href={`/checklists/${checklist.id}/executar`}
                                        className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"
                                    >
                                        <Play size={18} />
                                    </Link>
                                )}

                                <div className="flex gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                                        <ClipboardList size={20} />
                                    </div>

                                    <div>
                                        <h4 className="font-bold">
                                            {checklist.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {checklist.description || "Sem descrição"}
                                        </p>
                                    </div>
                                </div>

                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold">
                                    {checklist.active ? "Ativo" : "Inativo"}
                                </span>
                            </div>

                            {canEdit && (
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedChecklist(checklist)
                                            setOpenEditModal(true)
                                        }}
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedChecklistId(checklist.id)
                                            setOpenDeleteDialog(true)
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* MODALS */}
            {selectedChecklist && (
                <EditChecklistModal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    checklist={selectedChecklist}
                />
            )}

            <DeleteChecklistDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                checklistId={selectedChecklistId}
            />
        </>
    )
}