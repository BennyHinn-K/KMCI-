"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  maxSize?: number // in MB
  accept?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = "Upload Image",
  maxSize = 5,
  accept = "image/*"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      toast.error(`File size must be less than ${maxSize}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onChange(result) // For now, use base64. In production, upload to Supabase Storage
      
      // TODO: Upload to Supabase Storage and get public URL
      // const supabase = getSupabaseBrowserClient()
      // const fileExt = file.name.split('.').pop()
      // const fileName = `${Date.now()}.${fileExt}`
      // const { data, error } = await supabase.storage
      //   .from('uploads')
      //   .upload(fileName, file)
      // if (error) throw error
      // const { data: { publicUrl } } = supabase.storage
      //   .from('uploads')
      //   .getPublicUrl(fileName)
      // onChange(publicUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange("")
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {preview ? (
        <div className="relative group">
          <Card className="overflow-hidden border-2 border-dashed">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 
            transition-colors
            ${isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/25 hover:border-primary/50'}
          `}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className={`
              rounded-full p-4 
              ${isDragging ? 'bg-primary/20' : 'bg-muted'}
            `}>
              {isDragging ? (
                <Upload className="h-10 w-10 text-primary" />
              ) : (
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragging ? 'Drop image here' : 'Drag & drop image here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to select
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Max size: {maxSize}MB • JPG, PNG, GIF
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

