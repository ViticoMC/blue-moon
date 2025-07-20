import Image from "next/image";
import {
  FadeInOnScroll,
  SlideInFromLeft,
  SlideInFromRight,
} from "@/components/scroll-animations";
import { ImageModal } from "@/components/image-modal";
import { LoginButton } from "@/components/login-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  AlertCircle,
  User,
} from "lucide-react";
import ServicesSection from "@/components/services-section";
import GallerySection from "@/components/gallery-section";
import ProductSection from "@/components/product-section";
import Link from "next/link";



export default async function HomePage() {


  // Verificar si hay conexión a BD
  const hasDbConnection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const showMockWarning = !hasDbConnection;

  return (
    <div className="min-h-screen">
      {/* Botón de Login Flotante */}
      <LoginButton />



      {/* Hero Section */}
      <section className="relative md:h-screen h-[60vh] flex items-center justify-center text-white bg-white">
        {/* <div className="absolute inset-0 bg-black/50 z-10"></div> */}
        <div className="absolute inset-0 bg-gradient-to-tb from-blue-900/20 to-gray-200 backdrop-blur-sm">
          <Image
            src="/pircing-hero.png"
            alt="Piercing Studio"
            fill
            className="object-contain  "
            priority
          />
        </div>
        <FadeInOnScroll className="relative z-20 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r  from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            BLUE MOON STUDIO
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto   backdrop-blur-sm rounded-sm text-black ">
            Arte corporal profesional con los más altos estándares de calidad y
            seguridad
          </p>
          <div className="flex gap-4 justify-center">
            <Badge className="text-lg px-6 py-2 bg-blue-600 hover:bg-blue-700">
              <a href="#servicios">

                Servicios
              </a>
            </Badge>
            <Badge className="text-lg px-6 py-2 bg-cyan-600 hover:bg-cyan-700">
              <a href="#productos">

                Productos
              </a>
            </Badge>
          </div>
        </FadeInOnScroll>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
              Quiénes Somos
            </h2>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SlideInFromLeft>
              <div className="space-y-6">
                <h3 className="text-3xl font-semibold text-gray-800">
                  Expertos en Arte Corporal
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Con más de 10 años de experiencia, somos especialistas en
                  perforaciones corporales de todo tipo. Nuestro estudio cuenta
                  con las más estrictas medidas de higiene y seguridad,
                  utilizando únicamente materiales de grado médico y técnicas
                  profesionales.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Me especializo  en crear experiencias seguras y cómodas para
                  nuestros clientes. Tu seguridad y satisfacción son nuestra
                  prioridad número uno.
                </p>
                <div className="flex items-center gap-2 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                  <span className="text-gray-600 ml-2">
                    +500 clientes satisfechos
                  </span>
                </div>
              </div>
            </SlideInFromLeft>

            <SlideInFromRight>
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Interior del estudio"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Área de trabajo"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Herramientas profesionales"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Área de esterilización"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </SlideInFromRight>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Products Section */}
      <ProductSection />


      {/* Gallery Section */}
      <GallerySection />

      {/* Contact Section */}
      <section className="py-20 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
              Contacto
            </h2>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 gap-12">
            <SlideInFromLeft>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <MapPin className="w-8 h-8 text-blue-600 min-w-8 min-h-8" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 ">
                      Dirección
                    </h3>
                    <p className="text-gray-600 ">
                      Calzada del cerro / monasterio y Churruca , #2061 punto de referencia pediátrico del cerro (Las católicas)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4" >
                  <Phone className="w-8 h-8 text-blue-600" />
                  <Link href="https://wa.me//58951203">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Teléfono
                    </h3>
                    <p className="text-gray-600">+53 58951203</p>
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Email
                    </h3>
                    <p className="text-gray-600">info@bluemoonstudio.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Horarios
                    </h3>
                    <p className="text-gray-600">
                      Lun - Dom: 10:00 AM - 5:00 PM
                    </p>
                    {/* <p className="text-gray-600">Dom: 12:00 PM - 6:00 PM</p> */}
                  </div>
                </div>
              </div>
            </SlideInFromLeft>

            <SlideInFromRight>
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-8 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-6">
                  ¿Listo para tu próximo piercing?
                </h3>
                <p className="mb-6">
                  Contáctanos para agendar una cita o resolver cualquier duda.
                  Nuestro equipo estará encantado de ayudarte a elegir el
                  piercing perfecto.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Consulta Gratuita</h4>
                    <p className="text-sm">
                      Te asesoramos sin costo sobre el mejor tipo de piercing
                      para ti
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Garantía de Calidad</h4>
                    <p className="text-sm">
                      Todos nuestros trabajos incluyen garantía y seguimiento
                      post-piercing
                    </p>
                  </div>
                </div>
              </div>
            </SlideInFromRight>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">BLUE MOON STUDIO</p>
          <p className="text-gray-400">© 2025 Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}
