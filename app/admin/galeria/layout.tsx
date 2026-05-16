import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Galería | Blue Moon Studio - Portafolio de Perforaciones',
    description: 'Galería de trabajos realizados en Blue Moon Studio. Mira nuestros proyectos de perforaciones corporales profesionales. Inspiración y ejemplos de calidad.',
    keywords: ['galería piercing', 'portafolio perforaciones', 'ejemplos piercing', 'trabajos realizados', 'body art gallery'],
    openGraph: {
        title: 'Galería | Blue Moon Studio',
        description: 'Portafolio de trabajos realizados en perforaciones corporales',
        type: 'website',
    },
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
