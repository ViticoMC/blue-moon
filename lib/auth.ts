// Sistema de autenticación real con JWT y cookies
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "blue-moon-studio-secret-key-2024"
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: number
  username: string
  exp: number
}

// Verificar contraseña (comparación directa - en producción usar bcrypt)
export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  // TODO: En producción, usar bcrypt para hashear contraseñas
  return password === storedPassword
}

// Crear sesión JWT
export async function createSession(userId: number, username: string): Promise<void> {
  const payload: SessionPayload = {
    userId,
    username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 días
  }

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key)

  const cookieStore = await cookies()
  cookieStore.set("admin-session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
    sameSite: "lax",
  })

}

// Verificar sesión
export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")?.value

  if (!session) {
    return null
  }

  try {
    const { payload } = await jwtVerify(session, key)
    return payload as SessionPayload
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

// Eliminar sesión
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
}

// Middleware para verificar autenticación
export async function requireAuth(): Promise<SessionPayload> {
  const session = await verifySession()
  if (!session) {
    throw new Error("No autorizado")
  }
  return session
}
