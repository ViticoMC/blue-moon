"use client"
import { useState, useEffect } from "react";
import {
  FadeInOnScroll,
} from "@/components/scroll-animations";
import { ImageModal } from "@/components/image-modal";


interface GalleryItem {
  id: number;
  img_url: string;
  fecha: Date;
  description: string;
}

export default function GallerySection() {
const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


    useEffect(() => {
      fetchGallery();
    }, []);

  
    const fetchGallery = async () => {
      try {
        // TODO: Reemplazar con: const response = await fetch("/api/gallery")
        const response = await fetch("/api/gallery");
        if (response.ok) {
          const data = await response.json();
          setGallery(data);
        } else {
          setError("Error al cargar Galeria");
        }
      } catch (error) {
        setError("Error al cargar galería");
      } finally {
        setLoading(false);
      }
    };


  return (
 <section className="py-20 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">
              Galería de Trabajos
            </h2>
          </FadeInOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((photo, index) => (
              <FadeInOnScroll key={photo.id} className={`delay-${index * 50}`}>
                <div className="relative group">
                  <ImageModal
                    src={photo.img_url || "/placeholder.svg"}
                    alt={photo.description}
                    className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {new Date(photo.fecha).toLocaleDateString()}
                  </div>
                  {photo.description && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs max-w-32 truncate">
                      {photo.description}
                    </div>
                  )}
                </div>
              </FadeInOnScroll>
            ))}
          </div>

          {gallery.length === 0 && (
            <div className="text-center text-white">
              <p className="text-xl">No hay fotos disponibles</p>
              <p className="text-blue-200 mt-2">
                Configura tu base de datos para mostrar la galería real
              </p>
            </div>
          )}
        </div>
      </section>
  )
}