import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Servicios | Blue Moon Studio - Perforaciones Profesionales',
    description: 'Descubre nuestros servicios de perforaciones corporales. Más de 10 años de experiencia con máximos estándares de seguridad e higiene. Especialistas en body art.',
    keywords: ['perforaciones corporales', 'piercing services', 'body piercing', 'servicios piercing', 'orejas', 'nariz', 'labio'],
    openGraph: {
        title: 'Servicios | Blue Moon Studio',
        description: 'Servicios profesionales de perforaciones corporales',
        type: 'website',
    },
}

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
