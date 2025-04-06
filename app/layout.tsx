import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "../components/BottomNav"
import { Toaster } from "@/components/ui/toaster"
import { ExpenseChatbot } from "@/components/ExpenseChatbot"
import { AuthProvider } from "@/components/AuthProvider"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses with style",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 pb-16">
            {children}
            <BottomNav />
            <ExpenseChatbot />
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}