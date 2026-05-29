import { ExecutionStatus } from "@prisma/client"

export interface ChecklistExecution {
    id: string
    status: ExecutionStatus
    items: {
        id: string
        executionId: string
        itemId: string
        checked: boolean
        observation?: string | null
    }[]
}

export interface ChecklistData {
    id: string
    title: string
    description?: string | null

    frequency: "DAILY" | "WEEKLY" | "MONTHLY"
    active: boolean
    createdById?: string | null

    sector?: {
        id: string
        name: string
    } | null

    assignedUser?: {
        id: string
        name: string
    } | null

    execution?: ChecklistExecution | null
}