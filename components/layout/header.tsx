"use client"

import {
    Bell,
    Search,
    Menu,
} from "lucide-react"

import {
    usePathname,
} from "next/navigation"

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({
    onMenuClick,
}: HeaderProps) {

    const pathname =
        usePathname()

    function getPageTitle() {

        // CHECKLIST EXECUTION
        if (
            pathname.includes("/executar")
        ) {
            return "Execução do Checklist"
        }

        // ROTAS
        const routes: Record<string, string> = {

            "/dashboard":
                "Dashboard",

            "/usuarios":
                "Usuários",

            "/setores":
                "Setores",

            "/checklists":
                "Checklists",

            "/relatorios":
                "Relatórios",
        }

        // MATCH DIRETO
        if (routes[pathname]) {
            return routes[pathname]
        }

        // FALLBACK
        return "Dashboard"
    }

    function getPageDescription() {

        if (
            pathname.includes("/executar")
        ) {
            return "Execute e acompanhe o checklist"
        }

        const descriptions:
            Record<string, string> = {

            "/dashboard":
                "Visão geral do sistema",

            "/usuarios":
                "Gerencie usuários do sistema",

            "/setores":
                "Gerencie setores corporativos",

            "/checklists":
                "Gerencie checklists corporativos",

            "/relatorios":
                "Acompanhe indicadores e relatórios",
        }

        return (
            descriptions[pathname] ||
            "Bem-vindo ao sistema corporativo"
        )
    }

    return (
        <header
            className="
                h-[72px]
                lg:h-[80px]

                bg-card/80
                backdrop-blur-xl

                border-b
                border-border

                flex
                items-center
                justify-between

                px-4
                sm:px-6
                lg:px-8

                sticky
                top-0
                z-30
            "
        >

            {/* LEFT */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                {/* MOBILE MENU */}

                <button
                    onClick={onMenuClick}
                    className="
                        lg:hidden

                        w-10
                        h-10

                        rounded-xl

                        border
                        border-border

                        flex
                        items-center
                        justify-center

                        bg-background
                    "
                >
                    <Menu size={20} />
                </button>

                <div>

                    <h2
                        className="
                            text-2xl
                            lg:text-3xl

                            font-black
                            tracking-tight
                        "
                    >
                        {getPageTitle()}
                    </h2>

                    <p
                        className="
                            hidden
                            sm:block

                            text-sm
                            text-muted-foreground

                            mt-1
                        "
                    >
                        {getPageDescription()}
                    </p>

                </div>

            </div>

            {/* RIGHT */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    lg:gap-5
                "
            >

                {/* SEARCH */}

                <div
                    className="
                        hidden
                        xl:flex

                        items-center
                        gap-3

                        h-11
                        w-[280px]

                        px-4

                        rounded-2xl

                        border
                        border-border

                        bg-background
                    "
                >

                    <Search
                        size={18}
                        className="
                            text-muted-foreground
                        "
                    />

                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="
                            w-full
                            bg-transparent
                            outline-none
                            text-sm
                        "
                    />

                </div>

                {/* NOTIFICATION */}

                <button
                    className="
                        relative

                        w-10
                        h-10

                        lg:w-11
                        lg:h-11

                        rounded-2xl

                        bg-background

                        border
                        border-border

                        flex
                        items-center
                        justify-center
                    "
                >

                    <Bell size={18} />

                    <span
                        className="
                            absolute
                            top-2
                            right-2

                            w-2
                            h-2

                            rounded-full
                            bg-primary
                        "
                    />

                </button>

                {/* USER */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            w-10
                            h-10

                            rounded-2xl

                            bg-primary
                            text-primary-foreground

                            flex
                            items-center
                            justify-center

                            font-black
                        "
                    >
                        W
                    </div>

                    <div className="
                        hidden
                        sm:block
                    ">

                        <p
                            className="
                                font-bold
                                text-sm
                            "
                        >
                            Wendson
                        </p>

                        <span
                            className="
                                text-xs
                                text-muted-foreground
                            "
                        >
                            Administrador
                        </span>

                    </div>

                </div>

            </div>

        </header>
    )
}