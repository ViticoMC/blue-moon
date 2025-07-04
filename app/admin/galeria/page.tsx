"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Plus, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { ImageModal } from "@/components/image-modal";
import { checkSession } from "@/lib/check-session";
import { ImageUpload } from "@/components/image-upload";
import { CloudinaryUploadResult, deleteFromCloudinary } from "@/lib/cloudinary";
import { Textarea } from "@/components/ui/textarea";

interface GalleryItem {
  id: number;
  img_url: string;
  fecha: Date;
  description: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingImg, setEditingImg] = useState<GalleryItem | null>(null);
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const [formData, setFormData] = useState({
    img_url: "",
    fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkSession();
      if (!isAuth) {
        router.push("/admin/login");
      }
    };

    check();
  }, [router]);

  const fetchGallery = async () => {
    try {
      // TODO: Reemplazar con: const response = await fetch("/api/gallery")
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      } else {
        setError("Error al cargar Galeria");
      }
    } catch (error) {
      setError("Error al cargar galería");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const galleryData = {
        img_url: formData.img_url,
        fecha: formData.fecha,
        description: formData.description,
      };

      const url = editingImg ? `/api/gallery/${editingImg.id}` : "/api/gallery";
      const method = editingImg ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...galleryData }),
      });
      if (response.ok) {
        fetchGallery();
        setIsDialogOpen(false);
        resetForm();
        setSuccess(editingImg ? "Imagen actualizado!" : "Imagen agregada!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al guardar servicio");
      }
    } catch (error) {
      setError("Error al guardar imagen");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      try {
                 // Eliminar imagen de Cloudinary si existe
                 if (item.img_url && item.img_url.includes("cloudinary")) {
                   const publicId = item.img_url.split("/").pop()?.split(".")[0]
                   if (publicId) {
                     await deleteFromCloudinary(`blue-moon-studio/gallery/${publicId}`)
                   }
                 }
         
                 const response = await fetch(`/api/gallery/${item.id}`, {
                   method: "DELETE",
                 })
         
                 if (response.ok) {
                   fetchGallery()
                   setSuccess("¡Servicio eliminado!")
                   setTimeout(() => setSuccess(""), 3000)
                 } else {
                   setError("Error al eliminar servicio")
                 }
               } catch (error) {
                 setError("Error de conexión")
               }
    }
  };

  const resetForm = () => {
    setFormData({
      img_url: "",
      fecha: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  const handleImageUpload = (result: CloudinaryUploadResult) => {
    setFormData((prev) => ({
      ...prev,
      img_url: result.secure_url,
    }));
    setSuccess("¡Imagen subida exitosamente!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleImageError = (error: string) => {
    setError(error);
    setTimeout(() => setError(""), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 p-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Gestión de Galería</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Imagen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Imagen</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <ImageUpload
                    onUploadComplete={handleImageUpload}
                    onUploadError={handleImageError}
                    currentImageUrl={formData.img_url}
                    folder="blue-moon-studio/services"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="date_taken">Fecha del Trabajo</Label>
                  <Input
                    id="date_taken"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving ? "Subiendo..." : "Agregar Imagen"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <Card
              key={item.id}
              className="bg-white/95 backdrop-blur-sm relative group"
            >
              <CardContent className="p-2">
                <div className="relative overflow-hidden rounded-lg">
                  {/* Imagen */}
                  <ImageModal
                    src={item.img_url || "/placeholder.svg"}
                    alt={`Trabajo realizado el ${item.fecha}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  {/* Overlay con descripción al hacer hover */}
                  {item.description && (
                    <div className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity p-4 text-sm flex items-center justify-center text-center">
                      {item.description}
                    </div>
                  )}

                  {/* Fecha */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.fecha).toLocaleDateString()}
                  </div>

                  {/* Botón de eliminar */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-xl mb-4">
              No hay imágenes en la galería
            </div>
            <p className="text-blue-200">
              Agrega la primera imagen para comenzar
            </p>
          </div>
        )}

        {/* Nota para integración */}
        {/* <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            📝 Notas para Integración con Base de Datos:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Reemplazar mockDatabase.getGallery() con fetch('/api/gallery')
            </li>
            <li>
              • Reemplazar mockDatabase.createGalleryItem() con POST a
              /api/gallery
            </li>
            <li>
              • Reemplazar mockDatabase.deleteGalleryItem() con DELETE a
              /api/gallery/[id]
            </li>
            <li>• Implementar subida real de imágenes a Cloudinary</li>
            <li>• Agregar paginación para manejar muchas imágenes</li>
            <li>• Implementar filtros por fecha</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
