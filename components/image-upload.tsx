"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { uploadToCloudinary, validateImageFile, type CloudinaryUploadResult } from "@/lib/cloudinary"

interface ImageUploadProps {
  onUploadComplete: (result: CloudinaryUploadResult) => void
  onUploadError: (error: string) => void
  currentImageUrl?: string
  folder?: string
  className?: string
}

export function ImageUpload({
  onUploadComplete,
  onUploadError,
  currentImageUrl,
  folder = "blue-moon-studio",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = async (file: File) => {
    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      onUploadError(validation.error!)
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    setUploading(true)
    setUploadProgress(0)

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await uploadToCloudinary(file, folder)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        onUploadComplete(result)
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (error) {
      console.error("Error uploading:", error)
      onUploadError(error instanceof Error ? error.message : "Error subiendo imagen")
      setUploading(false)
      setUploadProgress(0)
      setPreviewUrl(currentImageUrl || null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const clearPreview = () => {
    setPreviewUrl(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Imagen</Label>

      {/* Área de subida */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${uploading ? "pointer-events-none opacity-50" : "hover:border-gray-400"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto rounded-lg object-cover max-h-48"
            />
            {!uploading && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearPreview}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium">Arrastra una imagen aquí</p>
              <p className="text-sm text-gray-500">o haz clic para seleccionar</p>
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        {uploading && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {uploadProgress < 100 ? `Subiendo... ${uploadProgress}%` : "¡Completado!"}
            </p>
          </div>
        )}

        {/* Input oculto */}
        <Input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>

      {/* Información */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• Formatos permitidos: JPG, PNG, WEBP</p>
        <p>• Tamaño máximo: 10MB</p>
        {/* <p>• Las imágenes se optimizan automáticamente</p> */}
      </div>

      {/* Estado de Cloudinary */}
      {/* <div className="flex items-center gap-2 text-sm">
        {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Cloudinary configurado correctamente</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-600">Cloudinary no configurado</span>
          </>
        )}
      </div> */}
    </div>
  )
}
