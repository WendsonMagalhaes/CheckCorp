"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Building2,
    FileBarChart2,
    Settings,
} from "lucide-react"

const menu = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Checklists",
        icon: ClipboardList,
        href: "/checklists",
    },
    {
        label: "Usuários",
        icon: Users,
        href: "/usuarios",
    },
    {
        label: "Setores",
        icon: Building2,
        href: "/setores",
    },
    {
        label: "Relatórios",
        icon: FileBarChart2,
        href: "/relatorios",
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/configuracoes",
    },
]

interface SidebarProps {
    mobile?: boolean
}

export function Sidebar({
    mobile = false,
}: SidebarProps) {

    const pathname = usePathname()

    return (
        <aside
            className={`
                w-[280px]
                h-screen
                bg-sidebar
                text-sidebar-foreground
                flex
                flex-col
                border-r
                border-sidebar-border
                shadow-2xl

                ${mobile ? "block" : ""}
            `}
        >
            {/* LOGO */}
            <div
                className="
                    min-h-[80px]
                    flex
                    items-center
                    px-7
                    border-b
                    border-sidebar-border
                "
            >
                <div>
                    <h1
                        className="
                            text-3xl
                            font-black
                            tracking-tight
                            text-white
                        "
                    >
                        CheckCorp
                    </h1>

                    <p
                        className="
                            text-sm
                            text-white/60
                            mt-1
                        "
                    >
                        Corporate Checklist
                    </p>
                </div>
            </div>

            {/* MENU */}
            <nav
                className="
                    flex-1
                    px-4
                    py-6
                    flex
                    flex-col
                    gap-2
                    overflow-y-auto
                "
            >
                {menu.map((item) => {

                    const Icon = item.icon

                    const isActive =
                        pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-2xl
                                text-sm
                                font-semibold
                                transition-all
                                duration-200

                                ${isActive
                                    ? `
                                        bg-sidebar-primary
                                        text-sidebar-primary-foreground
                                        shadow-lg
                                      `
                                    : `
                                        text-white/75
                                        hover:bg-white/10
                                        hover:text-white
                                      `
                                }
                            `}
                        >
                            <Icon
                                size={20}
                                className="
                                    transition
                                    group-hover:scale-110
                                "
                            />

                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* FOOTER */}
            <div
                className="
                    p-4
                    border-t
                    border-sidebar-border
                "
            >
                <div
                    className="
                        bg-white/5
                        rounded-2xl
                        p-4
                    "
                >
                    <p
                        className="
                            text-sm
                            font-semibold
                        "
                    >
                        Sistema Corporativo
                    </p>

                    <p
                        className="
                            text-xs
                            text-white/60
                            mt-1
                        "
                    >
                        Gestão inteligente de tarefas.
                    </p>
                </div>
            </div>
        </aside>
    )
}