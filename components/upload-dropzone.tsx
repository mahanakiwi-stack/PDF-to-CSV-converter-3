"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void
  file: File | null
  onClear: () => void
  disabled?: boolean
}

export function UploadDropzone({
  onFileSelect,
  file,
  onClear,
  disabled,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile?.type === "application/pdf") {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect, disabled]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile?.type === "application/pdf") {
        onFileSelect(selectedFile)
      }
      e.target.value = ""
    },
    [onFileSelect]
  )

  if (file) {
    return (
      <div className="group relative flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
        <div
          className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
          style={{ backgroundColor: "hsl(var(--accent))" }}
        />
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
        >
          <FileText
            className="h-6 w-6"
            style={{ color: "hsl(var(--accent))" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-card-foreground">
              {file.name}
            </p>
            <CheckCircle2
              className="hidden h-4 w-4 shrink-0 sm:block"
              style={{ color: "hsl(var(--accent))" }}
            />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB {"\u00B7"} PDF document
          </p>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-200 sm:p-14",
        isDragging
          ? "scale-[1.01] border-accent bg-accent/5 shadow-lg"
          : "border-border hover:border-muted-foreground/30 hover:bg-card hover:shadow-sm",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
          isDragging ? "scale-110" : "group-hover:scale-105"
        )}
        style={{ backgroundColor: isDragging ? "hsl(var(--accent) / 0.12)" : "hsl(var(--secondary))" }}
      >
        <Upload
          className={cn(
            "h-7 w-7 transition-colors duration-200",
            isDragging ? "" : "text-muted-foreground"
          )}
          style={isDragging ? { color: "hsl(var(--accent))" } : {}}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          Drop your PDF bank statement here
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          or{" "}
          <span
            className="font-medium underline underline-offset-2"
            style={{ color: "hsl(var(--accent))" }}
          >
            click to browse
          </span>{" "}
          your files
        </p>
      </div>
      <div className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
        {"PDF files only \u00B7 Max 20MB"}
      </div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        className="sr-only"
        disabled={disabled}
      />
    </label>
  )
}
