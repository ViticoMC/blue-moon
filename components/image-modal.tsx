"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ImageModalProps {
  src: string
  alt: string
  className?: string
}

export function ImageModal({ src, alt, className = "" }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={300}
        height={300}
        className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
