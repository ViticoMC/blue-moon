export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/check", {
      method: "GET",
      credentials: "include",
    })

    if (!res.ok) return false

    const data = await res.json()
    return data.authenticated === true
  } catch {
    return false
  }
}