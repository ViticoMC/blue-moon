"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ImageIcon, Package, Wrench, LogOut, BarChart3, ArrowRight } from "lucide-react"
import { checkSession } from "@/lib/check-session"
// import { verifySession } from "@/lib/auth"

interface Stats {
  services: number
  products: number
  photos: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ services: 0, products: 0, photos: 0 })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadStats()
  }, [])

 useEffect(() => {
     const check = async () => {
       const isAuth = await checkSession()
       if (!isAuth) {
         router.push("/admin/login")
       }
     }
 
     check()
   }, [router])

  const loadStats = async () => {
    try {
      const [servicesRes, productsRes, galleryRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/products"),
        fetch("/api/gallery"),
      ])

      const [services, products, gallery] = await Promise.all([
        servicesRes.json(),
        productsRes.json(),
        galleryRes.json(),
      ])

      setStats({
        services: services.length || 0,
        products: products.length || 0,
        photos: gallery.length || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            {user && <p className="text-blue-200 mt-1">Bienvenido, {user.username}</p>}
          </div>
          <div className="flex gap-2">

          <Button variant="outline" onClick={handleLogout} className="bg-white text-gray-800 hover:bg-gray-100">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
           <Button variant="outline" onClick={()=>{
            router.push("/")
           }} className="bg-white text-gray-800 hover:bg-gray-100">
            <ArrowRight className="w-4 h-4 mr-2" />
            Volver
          </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios</CardTitle>
              <Wrench className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.services}</div>
              <p className="text-xs text-muted-foreground">servicios activos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.products}</div>
              <p className="text-xs text-muted-foreground">productos disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Galería</CardTitle>
              <ImageIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.photos}</div>
              <p className="text-xs text-muted-foreground">fotos publicadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.services + stats.products + stats.photos}</div>
              <p className="text-xs text-muted-foreground">elementos totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones principales */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Wrench className="h-5 w-5" />
                Gestionar Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Administra los servicios de perforación que ofreces. Agrega, edita o elimina servicios.
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <strong>{stats.services}</strong> servicios registrados
              </div>
              <Link href="/admin/servicios">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Gestionar Servicios</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Package className="h-5 w-5" />
                Gestionar Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Administra los piercings y productos que vendes. Control de inventario y precios.
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <strong>{stats.products}</strong> productos disponibles
              </div>
              <Link href="/admin/productos">
                <Button className="w-full bg-green-600 hover:bg-green-700">Gestionar Productos</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <ImageIcon className="h-5 w-5" />
                Gestionar Galería
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Administra las fotos de trabajos realizados. Muestra tu portafolio profesional. Dale referencias al cliente
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <strong>{stats.photos}</strong> fotos en galería
              </div>
              <Link href="/admin/galeria">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 bottom-2">Gestionar Galería</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Información del sistema */}
        {/* <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <h3 className="text-white font-semibold mb-2">🔒 Sistema de Administración</h3>
          <div className="text-blue-200 text-sm space-y-1">
            <p>• Autenticación JWT con cookies seguras</p>
            <p>• Conexión directa a base de datos Vercel Postgres</p>
            <p>• Integración completa con Cloudinary para imágenes</p>
            <p>• Todas las operaciones son en tiempo real</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}
