import { AppSidebar } from '@/components/app-sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar />
    <main>
      {children}
    </main>
  </SidebarProvider>    
  )
}
