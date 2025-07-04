"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Edit, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { checkSession } from "@/lib/check-session";
import { set } from "react-hook-form";
import { ImageUpload } from "@/components/image-upload";
import { CloudinaryUploadResult, deleteFromCloudinary } from "@/lib/cloudinary";

interface Product {
  id: number;
  nombre: string;
  description: string;
  price: number;
  img_url?: string;
  material: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    material: "",
    description: "",
    price: "",
    img_url: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkSession();
      if (!isAuth) {
        router.push("/admin/login");
      }
    };

    check();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Error al cargar productos");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      

      const productData = {
        nombre: formData.nombre,
        material: formData.material,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        img_url: formData.img_url || editingProduct?.img_url || "",
      };
      
      const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...productData}),
      });
      if (response.ok) {
        fetchProducts();
        setIsDialogOpen(false);
        resetForm();
        setSuccess(
          editingProduct ? "Producto actualizado!" : "Producto creado!"
        );
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al guardar servicio");
      }
    } catch (error) {
      setError("Error al guardar producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
         try {
           // Eliminar imagen de Cloudinary si existe
           if (product.img_url && product.img_url.includes("cloudinary")) {
             const publicId = product.img_url.split("/").pop()?.split(".")[0]
             if (publicId) {
               await deleteFromCloudinary(`blue-moon-studio/products/${publicId}`)
             }
           }
   
           const response = await fetch(`/api/products/${product.id}`, {
             method: "DELETE",
           })
   
           if (response.ok) {
             fetchProducts()
             setSuccess("¡Servicio eliminado!")
             setTimeout(() => setSuccess(""), 3000)
           } else {
             setError("Error al eliminar servicio")
           }
         } catch (error) {
           setError("Error de conexión")
         }
       }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      material: "",
      description: "",
      price: "",
      img_url: "",
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      material: product.material,
      description: product.description,
      price: product.price.toString(),
      img_url: product.img_url || "",
    });
    setIsDialogOpen(true);
  };
  const handleImageUpload = (result: CloudinaryUploadResult) => {
    setFormData((prev) => ({
      ...prev,
      img_url: result.secure_url,
    }));
    setSuccess("¡Imagen subida exitosamente!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleImageError = (error: string) => {
    setError(error);
    setTimeout(() => setError(""), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 p-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Gestión de Productos
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) =>
                      setFormData({ ...formData, material: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Titanio">Titanio</SelectItem>
                      <SelectItem value="Acero Quirúrgico">
                        Acero Quirúrgico
                      </SelectItem>
                      <SelectItem value="Oro 14k">Oro 14k</SelectItem>
                      <SelectItem value="Oro 18k">Oro 18k</SelectItem>
                      <SelectItem value="Oro Rosa 14k">Oro Rosa 14k</SelectItem>
                      <SelectItem value="Plata 925">Plata 925</SelectItem>
                      <SelectItem value="Niobio">Niobio</SelectItem>
                      <SelectItem value="Titanio con Cristal">
                        Titanio con Cristal
                      </SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  onUploadError={handleImageError}
                  currentImageUrl={formData.img_url}
                  folder="blue-moon-studio/services"
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : editingProduct
                    ? "Actualizar"
                    : "Crear"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="text-sm">{product.nombre}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.img_url && (
                  <Image
                    src={product.img_url || "/placeholder.svg"}
                    alt={product.nombre}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <p className="text-sm text-gray-600 mb-2">
                  Material: {product.material}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  {product.description}
                </p>
                <div className="text-lg font-bold text-blue-600">
                  ${product.price}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nota para integración */}
        {/* <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            📝 Notas para Integración con Base de Datos:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Reemplazar mockDatabase.getProducts() con fetch('/api/products')
            </li>
            <li>
              • Reemplazar mockDatabase.createProduct() con POST a /api/products
            </li>
            <li>
              • Reemplazar mockDatabase.updateProduct() con PUT a
              /api/products/[id]
            </li>
            <li>
              • Reemplazar mockDatabase.deleteProduct() con DELETE a
              /api/products/[id]
            </li>
            <li>• Implementar subida real de imágenes a Cloudinary</li>
            <li>• Agregar validación de materiales y prices</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
