"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FadeInOnScroll,
  SlideInFromRight,
} from "@/components/scroll-animations";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


interface Product {
  id: number;
  nombre: string;
  description: string;
  price: number;
  img_url?: string;
  material: string;
}

export default function ProductSection() {
    const [ products, setProducts ] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
      fetchProducts()
    }, [])

    const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setError("Error al cargar productos")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  
  return (
     <section className="py-20 bg-white/95 backdrop-blur-sm" id="productos">
            <div className="container mx-auto px-4">
              <FadeInOnScroll>
                <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
                  Nuestros Productos
                </h2>
              </FadeInOnScroll>
    
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <SlideInFromRight
                    key={product.id}
                    className={`delay-${index * 100}`}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-4">
                        {product.img_url && (
                          <Image
                            src={product.img_url || "/placeholder.svg"}
                            alt={product.nombre}
                            width={200}
                            height={200}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {product.nombre}
                        </h3>
                        <Badge className="mb-2 bg-gray-600">
                          {product.material}
                        </Badge>
                        <p className="text-sm text-gray-600 mb-3">
                          {product.descripcion}
                        </p>
                        <div className="text-lg font-bold text-blue-600">
                          ${product.price}
                        </div>
                      </CardContent>
                    </Card>
                  </SlideInFromRight>
                ))}
              </div>
    
              {products.length === 0 && (
                <div className="text-center text-gray-600">
                  <p className="text-xl">No hay productos disponibles</p>
                 
                </div>
              )}
            </div>
          </section>
  )
}