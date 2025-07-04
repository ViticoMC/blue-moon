import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db-vercel"
import { requireAuth } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await database.deletePhoto(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/gallery/[id]:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al eliminar foto" }, { status: 500 })
  }
}
