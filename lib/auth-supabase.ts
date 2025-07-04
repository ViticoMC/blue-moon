// Sistema de autenticación real usando JWT y cookies
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const key = new TextEncoder().encode(secretKey)

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId: number) {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
  }

  const session = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(key)

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })
}

export async function verifySession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, key)
    return payload
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
