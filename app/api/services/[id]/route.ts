import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db-vercel"
import { requireAuth } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const serviceData = await request.json()
    const service = await database.updateService(id, serviceData)

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error in PUT /api/services/[id]:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al actualizar servicio" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await database.deleteService(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/services/[id]:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al eliminar servicio" }, { status: 500 })
  }
}
