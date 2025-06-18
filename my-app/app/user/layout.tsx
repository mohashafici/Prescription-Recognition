"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/login')
      return
    }

    // Check if user has correct role
    const userData = JSON.parse(user)
    if (userData.role !== 'user') {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b p-4">
        <MobileSidebar />
      </div>
      <main className="md:pl-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
} 