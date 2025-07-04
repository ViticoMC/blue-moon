// Configuración completa de Cloudinary para Blue Moon Studio
export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

// Función para subir imágenes a Cloudinary
export const uploadToCloudinary = async (
  file: File,
  folder = "blue-moon-studio"
): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    formData.append("folder", folder)

    // ❌ No se permite en uploads sin firmar
    // formData.append("transformation", "c_limit,w_1200,h_1200,q_auto,f_auto")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Cloudinary upload error:", errorData)
      throw new Error(`Error uploading to Cloudinary: ${errorData.error?.message || "Unknown error"}`)
    }

    const result = await response.json()

    return result as CloudinaryUploadResult
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error)
    throw error
  }
}


// Función para eliminar imágenes de Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error("Error deleting from Cloudinary")
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error)
    return false
  }
}

// Función para generar URLs optimizadas de Cloudinary
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
    crop?: string
  } = {},
): string => {
  const { width = 800, height = 600, quality = "auto", format = "auto", crop = "fill" } = options

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/${publicId}`
}

// Función para validar archivos antes de subir
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Validar tipo de archivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WEBP",
    }
  }

  // Validar tamaño (máximo 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "El archivo es demasiado grande. Máximo 10MB permitido",
    }
  }

  return { isValid: true }
}
