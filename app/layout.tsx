import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blue-Moon',
  description: 'Web de negocio de Perforaciones corporales',
  // favicon: '/favicon.ico',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body>{children}</body>
    </html>
  )
}
