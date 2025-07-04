import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "Public ID requerido" }, { status: 400 })
    }

    // Crear la firma para la eliminación
    const timestamp = Math.round(new Date().getTime() / 1000)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!apiKey || !apiSecret) {
      console.error("❌ Faltan credenciales de Cloudinary API")
      return NextResponse.json({ error: "Configuración de Cloudinary incompleta" }, { status: 500 })
    }

    // Crear la firma usando Web Crypto API
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    const encoder = new TextEncoder()
    const data = encoder.encode(stringToSign)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    // Hacer la petición a Cloudinary
    const formData = new FormData()
    formData.append("public_id", publicId)
    formData.append("timestamp", timestamp.toString())
    formData.append("api_key", apiKey)
    formData.append("signature", signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (result.result === "ok") {
      return NextResponse.json({ success: true })
    } else {
      console.error("Error eliminando de Cloudinary:", result)
      return NextResponse.json({ error: "Error eliminando imagen" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in DELETE /api/cloudinary/delete:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
