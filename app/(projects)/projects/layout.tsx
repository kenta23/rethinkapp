import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: "Projects",
    description: "Projects page"
}
  
export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className='bg-white h-auto min-h-screen pb-[120px] max-h-auto dark:bg-[#0e0c0f]'>
        {/* Include shared UI here e.g. a header or sidebar */}
        {children}
      </section>
    )
  }