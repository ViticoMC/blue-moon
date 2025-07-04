import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db-vercel"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña requeridos" }, { status: 400 })
    }

    // Buscar admin en la base de datos
    const admin = await database.getAdminByUsername(username)

    if (!admin) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    // Crear sesión JWT
    await createSession(admin.id, admin.admin)

    return NextResponse.json({
      success: true,
      user: { id: admin.id, username: admin.admin },
    })
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
