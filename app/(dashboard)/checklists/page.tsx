import {
    ClipboardList,
} from "lucide-react"

import {
    ChecklistsTable,
} from "@/components/checklists/checklists-table"

import {
    CreateChecklistModal,
} from "@/components/checklists/create-checklist-modal"

export default function ChecklistsPage() {

    return (
        <div className="
            flex
            flex-col
            gap-6
        ">
            {/* HEADER */}

            <div className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
            ">
                <div>

                </div>

                <CreateChecklistModal />
            </div>

            {/* TABLE */}

            <ChecklistsTable />
        </div>
    )
}