import { supabase } from "@/lib/supabase"

export interface Admin {
  id: number
  admin: string
  password: string
  created_at?: string
}

export interface Service {
  id: number
  name: string
  descripcion: string
  price: number
  img_url?: string

}

export interface Product {
  id: number
  nombre: string
  price: number
  descripcion: string
  img_url?: string
  material: string

}

export interface Photo {
  id: number
  fecha: string
  img_url: string
  descripcion: string
  created_at?: string
}

export const database = {
  // ADMIN
  getAdminByUsername: async (username: string): Promise<Admin | null> => {
    const { data, error } = await supabase
      .from("blue-moon-admin")
      .select("*")
      .eq("admin", username)
      .single()

    if (error) {
      console.error("❌ Error fetching admin:", error.message)
      return null
    }

    return data
  },

  // SERVICIOS
  getServices: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from("blue-moon-services")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.error("❌ Error fetching services:", error.message)
      throw new Error("Error al obtener servicios")
    }

    return data
  },

  createService: async (
    service: Omit<Service, "id" | "created_at" | "updated_at">
  ): Promise<Service> => {
    const { data, error } = await supabase
      .from("blue-moon-services")
      .insert(service)
      .select()
      .single()

    if (error) {
      console.error("❌ Error creando servicio:", error.message)
      throw new Error("Error al crear servicio")
    }

    return data
  },

  updateService: async (
    id: number,
    service: Partial<Service>
  ): Promise<Service> => {
    const { data, error } = await supabase
      .from("blue-moon-services")
      .update({ ...service })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error("Error al actualizar servicio")
    }

    return data
  },

  deleteService: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from("blue-moon-services")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ Error eliminando servicio:", error.message)
      throw new Error("Error al eliminar servicio")
    }

  },

  // PRODUCTOS
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("blue-moon-productos")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.error("❌ Error fetching productos:", error.message)
      throw new Error("Error al obtener productos")
    }

    return data
  },

  createProduct: async (
    product: Omit<Product, "id" | "created_at" | "updated_at">
  ): Promise<Product> => {
    const { data, error } = await supabase
      .from("blue-moon-productos")
      .insert(product)
      .select()
      .single()

    if (error) {
      console.error("❌ Error creando producto:", error.message)
      throw new Error("Error al crear producto")
    }

    return data
  },

  updateProduct: async (
    id: number,
    product: Partial<Product>
  ): Promise<Product> => {
    const { data, error } = await supabase
      .from("blue-moon-productos")
      .update({ ...product })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error actualizando producto:", error.message)
      throw new Error("Error al actualizar producto")
    }

    return data
  },

  deleteProduct: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from("blue-moon-productos")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ Error eliminando producto:", error.message)
      throw new Error("Error al eliminar producto")
    }

  },

  // FOTOS / GALERÍA
  getPhotos: async (limit?: number): Promise<Photo[]> => {
    const query = supabase
      .from("blue-moon-fotos")
      .select("*")
      .order("fecha", { ascending: false })
      .order("id", { ascending: false })

    if (limit) query.limit(limit)

    const { data, error } = await query

    if (error) {
      console.error("❌ Error fetching fotos:", error.message)
      throw new Error("Error al obtener fotos")
    }

    return data
  },

  createPhoto: async (
    photo: Omit<Photo, "id" | "created_at">
  ): Promise<Photo> => {
    const { data, error } = await supabase
      .from("blue-moon-fotos")
      .insert(photo)
      .select()
      .single()

    if (error) {
      console.error("❌ Error creando foto:", error.message)
      throw new Error("Error al crear foto")
    }

    return data
  },

  deletePhoto: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from("blue-moon-fotos")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ Error eliminando foto:", error.message)
      throw new Error("Error al eliminar foto")
    }

  },

  // ESTADÍSTICAS
  getStats: async () => {
    try {
      const [services, products, photos] = await Promise.all([
        supabase.from("blue-moon-services").select("id"),
        supabase.from("blue-moon-productos").select("id"),
        supabase.from("blue-moon-fotos").select("id"),
      ])

      if (services.error || products.error || photos.error) {
        throw new Error("Error al contar registros")
      }

      const stats = {
        services: services.data.length,
        products: products.data.length,
        photos: photos.data.length,
      }

      return stats
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas:", error)
      throw new Error("Error al obtener estadísticas")
    }
  },
}
