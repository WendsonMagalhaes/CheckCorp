import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"

import { Inter, Goldman } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const goldman = Goldman({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-goldman",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Checklist Corporativo",
  description: "Sistema corporativo de checklist",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`
        ${inter.variable}
        ${goldman.variable}
      `}
    >
      <body className="antialiased">
        {children}

        <Toaster
          position="top-right"
          richColors
        />
      </body>
    </html>
  )
}