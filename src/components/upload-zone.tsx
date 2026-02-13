"use client"

import { useCallback, useState, useRef } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  currentFile: File | null
  previewUrl: string | null
  onClear: () => void
}

export function UploadZone({ onFileSelect, currentFile, previewUrl, onClear }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  if (currentFile && previewUrl) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{currentFile.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {(currentFile.size / 1024).toFixed(1)} KB
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{currentFile.type}</p>
          </div>
          <button
            onClick={onClear}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Remove image"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200",
        "flex flex-col items-center justify-center gap-4 p-12",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-muted-foreground hover:bg-card/50"
      )}
    >
      <div
        className={cn(
          "rounded-xl p-4 transition-colors",
          isDragging ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}
      >
        {isDragging ? <ImageIcon className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragging ? "Release to upload" : "Drag & drop image here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse. Supports PNG, JPG, SVG, WebP
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
