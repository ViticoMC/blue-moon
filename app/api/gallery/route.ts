import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db-vercel"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    const photos = await database.getPhotos(limit ? Number.parseInt(limit) : undefined)
    return NextResponse.json(photos)
  } catch (error) {
    console.error("Error in GET /api/gallery:", error)
    return NextResponse.json({ error: "Error al obtener galería" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const photoData = await request.json()

    if (!photoData.img_url) {
      return NextResponse.json({ error: "URL de imagen requerida" }, { status: 400 })
    }

    const photo = await database.createPhoto(photoData)
    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error in POST /api/gallery:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al crear foto" }, { status: 500 })
  }
}
