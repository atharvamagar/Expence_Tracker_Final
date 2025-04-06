"use client"

import { Settings } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signOut } from "next-auth/react"

export default function SettingsPage() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Settings
      </h1>
      <Card className="p-6">
        <Button 
          onClick={handleLogout} 
          className="w-full" 
          variant="destructive"
        >
          Logout
        </Button>
      </Card>
    </div>
  )
}

