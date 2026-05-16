import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Productos | Blue Moon Studio - Joyería Corporal Profesional',
    description: 'Explora nuestra colección de joyería corporal de grado médico. Perforaciones de calidad, hipoalergénicas y duraderas. Máximos estándares de seguridad.',
    keywords: ['joyería corporal', 'piercing jewelry', 'acero quirúrgico', 'joyería body art'],
    openGraph: {
        title: 'Productos | Blue Moon Studio',
        description: 'Colección completa de joyería corporal profesional',
        type: 'website',
    },
}

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
