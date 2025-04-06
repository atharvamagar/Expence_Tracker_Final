"use client"

import { Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || '',
        email: session.user.email || ''
      })
    }
  }, [session])

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Settings
      </h1>
      
      {/* Profile Card */}
      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <div className="space-y-1">
            <p className="text-sm font-large">Name: {userData.name}</p>
            <p className="text-sm font-large">Email: {userData.email}</p>
          </div>
        </div>
      </Card>

      {/* Logout Card */}
      <Card className="p-4  flex justify-center">
        <Button 
          onClick={handleLogout} 
          className="w-60" 
          variant="destructive"
          size="lg"
        >
          Logout
        </Button>
      </Card>
    
    </div>
  )
}

