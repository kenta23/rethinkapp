import NextThemeProvider from "@/components/next-theme-provider"
import { Rubik } from "next/font/google"
import '@/styles/globals.css'
import '@/styles/main.css'
import '@/styles/typography.css'
import ReactQueryProvider from "../providers/QueryProvider"
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from "./api/uploadthing/core"
import { Toaster } from "sonner"
import Footer from "./components/footer"
import { SessionProvider } from "next-auth/react"
import { Analytics } from "@vercel/analytics/next"


/**DEFAULT FONT */ 
const rubik = Rubik({
  subsets: ['latin'],
  display: "auto"
})

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={rubik.className}>
              <ReactQueryProvider>
                 <NextThemeProvider>     
                    <NextSSRPlugin
                       routerConfig={extractRouterConfig(ourFileRouter)}
                     />
                        <SessionProvider>
                            {children}
                        </SessionProvider>
                          <Toaster 
                            position="top-center"
                            closeButton={true}
                          />
                          <Footer />
                 </NextThemeProvider>
               </ReactQueryProvider> 
              <Analytics />
            </body> 
        </html>
    )
  }