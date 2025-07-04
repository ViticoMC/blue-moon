"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ImageUpload } from "@/components/image-upload"
import { deleteFromCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary"
import { checkSession } from "@/lib/check-session"

interface Service {
  id: number
  name: string
  description: string
  price: number
  img_url?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    img_url: "",
  })


  useEffect(() => {
    fetchServices()
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

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        setError("Error al cargar servicios")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (result: CloudinaryUploadResult) => {
    setFormData((prev) => ({
      ...prev,
      img_url: result.secure_url,
    }))
    setSuccess("¡Imagen subida exitosamente!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleImageError = (error: string) => {
    setError(error)
    setTimeout(() => setError(""), 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        img_url: formData.img_url,
      }

      const url = editingService ? `/api/services/${editingService.id}` : "/api/services"
      const method = editingService ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })
      if (response.ok) {
        fetchServices()
        setIsDialogOpen(false)
        resetForm()
        setSuccess(editingService ? "¡Servicio actualizado!" : "¡Servicio creado!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Error al guardar servicio")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (service: Service) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      try {
        // Eliminar imagen de Cloudinary si existe
        if (service.img_url && service.img_url.includes("cloudinary")) {
          const publicId = service.img_url.split("/").pop()?.split(".")[0]
          if (publicId) {
            await deleteFromCloudinary(`blue-moon-studio/services/${publicId}`)
          }
        }

        const response = await fetch(`/api/services/${service.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchServices()
          setSuccess("¡Servicio eliminado!")
          setTimeout(() => setSuccess(""), 3000)
        } else {
          setError("Error al eliminar servicio")
        }
      } catch (error) {
        setError("Error de conexión")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      img_url: "",
    })
    setEditingService(null)
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      img_url: service.img_url || "",
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando servicios...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 p-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm" className="bg-white text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Gestión de Servicios</h1>
        </div>

        {/* Alertas */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-white text-gray-800 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Servicio *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Piercing de Oreja - Lóbulo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el servicio, proceso, tiempo de cicatrización, etc."
                    rows={4}
                  />
                </div>

                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  onUploadError={handleImageError}
                  currentImageUrl={formData.img_url}
                  folder="blue-moon-studio/services"
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={saving}>
                  {saving ? "Guardando..." : editingService ? "Actualizar Servicio" : "Crear Servicio"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="text-lg">{service.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(service)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {service.img_url && (
                  <Image
                    src={service.img_url || "/placeholder.svg"}
                    alt={service.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>
                <div className="text-2xl font-bold text-blue-600">${service.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-xl mb-4">No hay servicios registrados</div>
            <p className="text-blue-200">Agrega el primer servicio para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}
