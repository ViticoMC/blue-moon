import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db-vercel"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const services = await database.getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error in GET /api/services:", error)
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    await requireAuth()

    const serviceData = await request.json()
    

    // Validar datos requeridos
    if (!serviceData.name || !serviceData.price) {
      return NextResponse.json({ error: "Nombre y precio son requeridos" }, { status: 400 })
    }

    const service = await database.createService(serviceData)
    return NextResponse.json(service)
  } catch (error) {
    console.error("Error in POST /api/services:", error)

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al crear servicio" }, { status: 500 })
  }
}
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    await requireAuth()

    // Obtener datos del body
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID del servicio requerido" }, { status: 400 })
    }

    const updatedService = await database.updateService(Number(id), updates)

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error in PUT /api/services:", error)

    if (error instanceof Error && error.message === "Servicio no encontrado") {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }

    if (error instanceof Error && error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json({ error: "Error al actualizar servicio" }, { status: 500 })
  }
}

