"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  onUpload: (url: string, filename: string) => void;
  onRemove?: (filename: string) => void;
  bucket?: string;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  maxFiles?: number;
  existingImages?: string[];
  className?: string;
  disabled?: boolean;
  label?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function ImageUpload({
  onUpload,
  onRemove,
  bucket = "general-uploads",
  maxSizeInMB = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxFiles = 5,
  existingImages = [],
  className = "",
  disabled = false,
  label = "Upload Images",
}: ImageUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUniqueFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop();
    const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    return `${timestamp}_${randomStr}_${safeName}.${extension}`;
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedTypes
        .map((type) => type.split("/")[1].toUpperCase())
        .join(", ")}`;
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    if (files.length + existingImages.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    try {
      const supabase = getSupabaseBrowserClient();
      const fileName = generateUniqueFileName(file.name);

      // Upload file to storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      // Fallback to base64 if Supabase upload fails
      console.warn("Supabase upload failed, using base64 fallback:", error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileUpload = useCallback(
    async (filesToUpload: FileList | File[]) => {
      const fileArray = Array.from(filesToUpload);

      if (fileArray.length === 0 || disabled) return;

      // Validate all files first
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          toast.error(validationError);
          return;
        }
      }

      setIsUploading(true);

      // Create upload entries
      const newFiles: UploadedFile[] = fileArray.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        url: "",
        size: file.size,
        status: "uploading" as const,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Upload files
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const fileId = newFiles[i].id;

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, progress: Math.min(f.progress + 10, 90) }
                  : f,
              ),
            );
          }, 100);

          const publicUrl = await uploadToSupabase(file);

          clearInterval(progressInterval);

          // Update file status
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    url: publicUrl,
                    status: "success" as const,
                    progress: 100,
                  }
                : f,
            ),
          );

          // Call onUpload callback
          onUpload(publicUrl, file.name);
          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "error" as const,
                    error: errorMessage,
                    progress: 0,
                  }
                : f,
            ),
          );

          toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
        }
      }

      setIsUploading(false);
    },
    [
      files.length,
      existingImages.length,
      maxFiles,
      onUpload,
      bucket,
      acceptedTypes,
      maxSizeInMB,
      disabled,
    ],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileUpload(droppedFiles);
      }
    },
    [disabled, handleFileUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFileUpload(selectedFiles);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileUpload],
  );

  const removeFile = useCallback(
    (fileId: string) => {
      const fileToRemove = files.find((f) => f.id === fileId);
      if (fileToRemove && onRemove) {
        onRemove(fileToRemove.name);
      }
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    },
    [files, onRemove],
  );

  const removeExistingImage = useCallback(
    (url: string) => {
      if (onRemove) {
        onRemove(url);
      }
    },
    [onRemove],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && !isUploading && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div className="text-center">
          {isUploading ? (
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          )}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isUploading
                ? "Uploading..."
                : isDragging
                  ? "Drop files here"
                  : "Drop images here or click to browse"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports:{" "}
              {acceptedTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Max {maxFiles} files, {maxSizeInMB}MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {file.status === "uploading" && (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {file.status === "success" && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    {file.status === "error" && (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </span>
                    </div>

                    {file.status === "uploading" && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {file.status === "error" && file.error && (
                      <p className="text-xs text-red-500 mt-1">{file.error}</p>
                    )}

                    {file.status === "success" && file.url && (
                      <div className="mt-2">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded border"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    disabled={file.status === "uploading"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images Preview */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Current Images ({existingImages.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Existing image ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                  loading="lazy"
                />
                {onRemove && (
                  <button
                    onClick={() => removeExistingImage(url)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
