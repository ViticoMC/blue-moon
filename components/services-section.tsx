"use client"

import Image from "next/image";
import {
  FadeInOnScroll,
  SlideInFromLeft,
} from "@/components/scroll-animations";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Service {
  id: number
  name: string
  description: string
  price: number
  img_url?: string
}


export default function ServicesSection() {
    const [ services, setServices ] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
      fetchServices()
    }, [])

    const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        setError("Error al cargar servicios")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  
  return (
     <section className="py-20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm" id="servicios">
            <div className="container mx-auto px-4">
              <FadeInOnScroll>
                <h2 className="text-5xl font-bold text-center mb-16 text-white">
                  Nuestros Servicios
                </h2>
              </FadeInOnScroll>
    
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <SlideInFromLeft
                    key={service.id}
                    className={`delay-${index * 100}`}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <CardContent className="p-6">
                        {service.img_url && (
                          <Image
                            src={service.img_url || "/placeholder.svg"}
                            alt={service.name}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {service.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="text-2xl font-bold text-blue-600">
                          ${service.price}
                        </div>
                      </CardContent>
                    </Card>
                  </SlideInFromLeft>
                ))}
              </div>
    
              {services.length === 0 && (
                <div className="text-center text-white">
                  <p className="text-xl">No hay servicios disponibles</p>
                  <p className="text-blue-200 mt-2">
                    Configura tu base de datos para mostrar servicios reales
                  </p>
                </div>
              )}
            </div>
          </section>
  )}