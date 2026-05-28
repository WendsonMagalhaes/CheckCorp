"use client"

import { useState } from "react"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const [openSidebar, setOpenSidebar] = useState(false)

    return (
        <div
            className="
                flex
                min-h-screen
                bg-background
            "
        >
            {/* SIDEBAR DESKTOP */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* SIDEBAR MOBILE */}
            {openSidebar && (
                <>
                    {/* BACKDROP */}
                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/50
                            z-40
                            lg:hidden
                        "
                        onClick={() => setOpenSidebar(false)}
                    />

                    {/* DRAWER */}
                    <div
                        className="
                            fixed
                            top-0
                            left-0
                            z-50
                            lg:hidden
                            animate-in
                            slide-in-from-left
                            duration-300
                        "
                    >
                        <Sidebar mobile />
                    </div>
                </>
            )}

            {/* CONTENT */}
            <div
                className="
                    flex-1
                    flex
                    flex-col
                    min-w-0
                "
            >
                <Header
                    onMenuClick={() => setOpenSidebar(true)}
                />

                <main
                    className="
                        flex-1
                        p-4
                        sm:p-6
                        lg:p-8
                    "
                >
                    {children}
                </main>
            </div>
        </div>
    )
}