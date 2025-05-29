import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  MapPin,
  Clock,
  FileText,
  ImageIcon,
  Navigation,
  ClockAlertIcon,
  Settings,
  Plus,
  X,
  Upload,
  Tag,
  Trash2,
} from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import {
  useUpdateDestination,
  useDestinationById,
} from "../hooks/useDestinations";
import { useDeleteImage, useUploadImage } from "@/shared/hooks/useStorage";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { UpdateDestinationSchema } from "../utils/zod.schema";
import { useEffect, useState } from "react";

export default function UpdateDestinationForm() {
  const { id: destination_id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();
  const { mutateAsync: updateDestinationAsync, isPending: isCreating } =
    useUpdateDestination(accessToken || "");

  const {
    data,
  } = useDestinationById(destination_id!, accessToken || "");
  const [combineImage, setCombineImage] = useState<
    { src: string; type: "url" | "file"; file?: File }[]
  >([]);
  const { mutateAsync: deleteImageAsync } = useDeleteImage(accessToken || "");
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const {
    form,
    fieldErrors,
    setForm,
    handleChange,
    validateForm,
    setFieldErrors,
    resetForm,
  } = useZodForm(
    {
      name: "",
      start_open: "",
      end_open: "",
      description: "",
      image_urls: [],
      facilities: [""],
      status: true,
      address: "",
      category: "",
      new_images: [],
    },
    UpdateDestinationSchema
  );
  useEffect(() => {
    const urlImages = form.image_urls.map((url) => ({
      src: url,
      type: "url" as const,
    }));

    const fileImages = form.new_images.map((file) => ({
      src: URL.createObjectURL(file),
      type: "file" as const,
      file: file,
    }));

    setCombineImage([...urlImages, ...fileImages]);
  }, [form.image_urls, form.new_images]);

  useEffect(() => {
    if (data?.data) {
      const [start_open, end_open] = (data.data.open_hour || "").split("-");
      setForm({
        name: data.data.name,
        start_open: start_open,
        end_open: end_open,
        description: data.data.description,
        image_urls: data.data.image_urls || [],
        facilities: data.data.facilities || [],
        status: data.data.status,
        address: data.data.address,
        category: data.data.category,
        new_images: [],
      });
    }
  }, [data, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const uploadedImages: string[] = [];

      const currentImageUrls = form.image_urls;
      const currentImageFilenames = currentImageUrls.map((url) => {
        const parts = url.split("/").filter(Boolean);
        return parts[parts.length - 1];
      });

      const remainingUrlFilenames = combineImage
        .filter((img) => img.type === "url")
        .map((img) => {
          const parts = img.src.split("/").filter(Boolean);
          return parts[parts.length - 1];
        });

      const imageToDelete = currentImageFilenames.filter(
        (filename) => !remainingUrlFilenames.includes(filename)
      );

      for (const filename of imageToDelete) {
        const deleted = await deleteImageAsync(filename);
        if (!deleted.success) {
          console.error(`Failed to delete: ${filename}`, deleted.message);
        } else {
          console.log(`Deleted: ${filename}`);
        }
      }

      const newFiles = combineImage
        .filter((img) => img.type === "file" && img.file instanceof File)
        .map((img) => img.file);
      let uploadedResults;
      if (newFiles.length != 0) {
        uploadedResults = await Promise.all(
          newFiles.map((file) => uploadImageAsync(file!))
        );
        uploadedResults.forEach((res) => {
          if (res.success) {
            uploadedImages.push(res.data.url);
          }
        });
      }

      const finalImageUrls = [
        ...combineImage
          .filter((img) => img.type === "url")
          .map((img) => img.src),
        ...uploadedImages,
      ];
      const { start_open, end_open, ...rest } = form;
      const submissionPayload = {
        ...rest,
        id: destination_id!,
        open_hour: `${start_open}-${end_open}`,
        image_urls: finalImageUrls,
      };

      const data = await updateDestinationAsync({
        id: destination_id!,
        data: submissionPayload,
      });

      if (data.success) {
        toast.success("Success", {
          description: `Successfully updated ${data.data.name} Destination`,
        });
        resetForm();
        navigate("/data-destination");
        window.location.reload();
      } else {
        toast.error("Failed", {
          description: `Failed to update destination`,
        });
      }
    } catch (err: any) {
      if (err?.errors && typeof err.errors === "object") {
        setFieldErrors((prev: any) => ({
          ...prev,
          ...err.errors,
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          general: err.message || "Unknown error occurred",
        }));
        toast.error("Failed to update destination.");
      }
    }
  };

  const handleArrayChange = (
    field: "facilities",
    index: number,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "facilities") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "facilities", index: number) => {
    if (form[field].length > 1) {
      setForm((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    const newImageObjects = validFiles.map((file) => ({
      src: URL.createObjectURL(file),
      type: "file" as const,
      file: file,
    }));

    setCombineImage((prev) => [...prev, ...newImageObjects]);
    setForm((prev) => ({
      ...prev,
      new_images: [...prev.new_images, ...validFiles],
    }));
  };

  const removeImage = (index: number) => {
    const target = combineImage[index];

    setCombineImage((prev) => prev.filter((_, i) => i !== index));

    if (target.type === "url") {
      const urlIndex = combineImage
        .slice(0, index)
        .filter((img) => img.type === "url").length;

      setForm((prev) => ({
        ...prev,
        image_urls: prev.image_urls.filter((_, i) => i !== urlIndex),
      }));
    } else if (target.type === "file") {
      const fileIndex = combineImage
        .slice(0, index)
        .filter((img) => img.type === "file").length;

      setForm((prev) => ({
        ...prev,
        new_images: prev.new_images.filter((_, i) => i !== fileIndex),
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };


  const handleReset = () => {
    setForm({
      name: "",
      address: "",
      start_open: "",
      end_open: "",
      deleted_at: null,
      description: "",
      image_urls: [],
      facilities: [""],
      status: true,
      category: "",
      new_images: [],
    });
    setFieldErrors({});
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Create New Destination
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new destination
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination Name */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  <Label className="text-sm font-medium">
                    Destination Name
                  </Label>
                </div>
                <Input
                  name="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter destination name"
                />
                {fieldErrors.name && (
                  <p className="text-red-600 mt-1 text-sm">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <Label className="flex items-center gap-2 mb-1 mt-1">
                  <Navigation className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="e.g. Pantai Kuta"
                />
                {fieldErrors.address && (
                  <p className="text-red-600 mt-1 text-sm">
                    {fieldErrors.address}
                  </p>
                )}
              </div>
            </div>
            {/* Opening Hours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4" /> Start Open
                </Label>
                <Input
                  value={form.start_open}
                  type="time"
                  onChange={(e) => handleChange("start_open", e.target.value)}
                  placeholder="e.g. 08:00"
                />
                {fieldErrors.start_open && (
                  <p className="text-red-600 mt-1 text-sm">
                    {fieldErrors.start_open}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <ClockAlertIcon className="h-4 w-4" />
                  Closed
                </Label>
                <Input
                  value={form.end_open}
                  type="time"
                  onChange={(e) => handleChange("end_open", e.target.value)}
                  placeholder="e.g. 17:00"
                />
                {fieldErrors.end_open && (
                  <p className="text-red-600 mt-1 text-sm">
                    {fieldErrors.end_open}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4" />
                  Category
                </Label>
                <Input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="e.g. beach, mountain, shore"
                />
                {fieldErrors.category && (
                  <p className="text-red-600 mt-1 text-sm">
                    {fieldErrors.category}
                  </p>
                )}
              </div>
            </div>
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4" />
                <Label className="text-sm font-medium">Description</Label>
              </div>
              <Textarea
                name="description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter destination description"
                rows={4}
              />
              {fieldErrors.description && (
                <p className="text-red-600 mt-1 text-sm">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4" />
                <Label className="text-sm font-medium">Images</Label>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop images here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 5MB per image. Supported formats: JPG, PNG,
                  GIF, WebP
                </p>
              </div>

              {/* Image Previews */}
              {form.image_urls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">
                    Uploaded Images ({form.image_urls.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {combineImage.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={img.src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {img.src.split("/").pop()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {fieldErrors.image_urls && (
                <p className="text-red-600 mt-1 text-sm">
                  {fieldErrors.image_urls}
                </p>
              )}
            </div>

            {/* Facilities */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4" />
                <Label className="text-sm font-medium">Facilities</Label>
              </div>
              {form.facilities.map((facility, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={facility}
                    onChange={(e) =>
                      handleArrayChange("facilities", index, e.target.value)
                    }
                    placeholder="Enter facility name"
                    className="flex-1"
                  />

                  {form.facilities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("facilities", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("facilities")}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Facility
              </Button>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                {isCreating || isUploading ? "Saving..." : "Create Destination"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleReset}
              >
                Reset Form
              </Button>
            </div>

            {fieldErrors.general && (
              <p className="text-red-600 mt-2">{fieldErrors.general}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
