import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db-vercel"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const products = await database.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in GET /api/products:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const productData = await request.json()

    if (!productData.nombre || !productData.price || !productData.material) {
      return NextResponse.json({ error: "Nombre, precio y material son requeridos" }, { status: 400 })
    }

    const product = await database.createProduct(productData)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error in POST /api/products:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}


