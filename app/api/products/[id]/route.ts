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

    const productData = await request.json()
    const product = await database.updateProduct(id, productData)

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await database.deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
