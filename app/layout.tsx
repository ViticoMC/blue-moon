import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://blue-moon-snowy.vercel.app'),
  title: 'Blue Moon Studio - Perforaciones Corporales Profesionales',
  description: 'Estudio profesional de perforaciones corporales con más de 10 años de experiencia. Máximos estándares de higiene y seguridad. Ubicado en la ciudad.',
  keywords: ['piercing', 'perforaciones corporales', 'body art', 'estudio piercing', 'joyería corporal'],
  authors: [{ name: 'Blue Moon Studio' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://blue-moon-snowy.vercel.app',
    siteName: 'Blue Moon Studio',
    title: 'Blue Moon Studio - Perforaciones Corporales Profesionales',
    description: 'Estudio profesional de perforaciones corporales con los más altos estándares de calidad y seguridad.',
    images: [
      {
        url: 'https://blue-moon-snowy.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blue Moon Studio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blue Moon Studio - Perforaciones Corporales Profesionales',
    description: 'Estudio profesional de perforaciones corporales con máximos estándares de seguridad.',
    images: ['https://blue-moon-snowy.vercel.app/og-image.jpg'],
    creator: '@bluemoonstudio',
  },
  alternates: {
    canonical: 'https://blue-moon-snowy.vercel.app',
  },
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="google-site-verification" content="CiX_NM8s5PFxOHH1Vx0GcxfUlq9fgSPWUg4Kr6gjVyY" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="alternate" hrefLang="es-ES" href="https://blue-moon-snowy.vercel.app" />

        {/* Schema Markup - Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Blue Moon Studio",
            "image": "https://blue-moon-snowy.vercel.app/og-image.jpg",
            "description": "Estudio profesional de perforaciones corporales con más de 10 años de experiencia",
            "url": "https://blue-moon-snowy.vercel.app",
            "telephone": "+53 58951203",
            // "email": "info@bluemoonstudio.com",
            // "address": {
            //   "@type": "PostalAddress",
            //   "streetAddress": "Calzada del cerro / monasterio y Churruca, #2061",
            //   "addressLocality": "Las Católicas",
            //   "postalCode": "",
            //   "addressCountry": "CU"
            // },
            "priceRange": "$$",
            "ratingValue": 4.8,
            "reviewCount": 500,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500"
            }
          })
        }} />

        {/* Schema Markup - Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Blue Moon Studio",
            "url": "https://blue-moon-snowy.vercel.app",
            "logo": "https://blue-moon-snowy.vercel.app/logo.png",
            "sameAs": [
              "https://www.facebook.com/bluemoonstudio",
              "https://www.instagram.com/bluemoonstudio",
              "https://wa.me/5858951203"
            ]
          })
        }} />
      </head>

      <body>{children}</body>
    </html>
  )
}
