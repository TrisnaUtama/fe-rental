import React, { useRef } from "react";
import { ImageIcon, Upload, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

interface ImageUploadProps {
  files: File[];
  onFilesChange: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  error?: string;
  maxFileSizeMB?: number;
  acceptedFormats?: string;
}

export const ImageUpload = ({
  files,
  onFilesChange,
  onRemove,
  error,
  maxFileSizeMB = 5,
  acceptedFormats = "image/*",
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFilesChange(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 bg-red-100 rounded">
          <ImageIcon className="h-5 w-5 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold">Destination Images</h3>
        <Badge variant="outline" className="ml-auto">
          {files.length} image{files.length !== 1 ? "s" : ""} uploaded
        </Badge>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop images here, or click to select
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedFormats}
          onChange={(e) => {
            onFilesChange(e.target.files);
            e.target.value = ""; 
          }}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="mt-2"
        >
          Choose Files
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Maximum file size: {maxFileSizeMB}MB per image. Supported formats:
          JPG, PNG, GIF, WebP
        </p>
      </div>

      {/* Preview Gallery */}
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">
            Uploaded Images ({files.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove image ${file.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 mt-1 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
