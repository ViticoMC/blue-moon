"use client"

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface ImageModalProps {
  src: string
  alt: string
  className?: string
}

export function ImageModal({ src, alt, className = "" }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={400}
          height={400}
          className={`cursor-pointer hover:opacity-90 transition-all duration-300 rounded-lg hover:scale-[1.02] ${className}`}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 border-none bg-transparent shadow-none flex items-center justify-center">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative w-full h-[85vh] flex items-center justify-center">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 95vw, 80vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
