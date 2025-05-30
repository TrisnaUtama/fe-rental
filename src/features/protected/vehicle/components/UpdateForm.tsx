"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Car,
  Settings,
  FileText,
  ImageIcon,
  Upload,
  Trash2,
  Fuel,
  Calendar,
  Gauge,
  DollarSign,
  Palette,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
} from "lucide-react";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { UpdateVehicleSchema } from "../utils/zod.schema";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/shared/context/authContex";
import { useUpdateVehicle, useVehicleById } from "../hooks/useVehicle";
import { toast } from "sonner";
import { useDeleteImage, useUploadImage } from "@/shared/hooks/useStorage";

const VehicleTypes = {
  CITY_CAR: "CITY_CAR",
  HATCHBACK: "HATCHBACK",
  SEDAN: "SEDAN",
  SUV: "SUV",
  MPV: "MPV",
  MINIVAN: "MINIVAN",
  PICKUP: "PICKUP",
  DOUBLE_CABIN: "DOUBLE_CABIN",
  LUXURY: "LUXURY",
  ELECTRIC_CAR: "ELECTRIC_CAR",
};

const Transmission = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
};

const VehicleStatus = {
  RENTED: "RENTED",
  MAINTENANCE: "MAINTENANCE",
  AVAILABLE: "AVAILABLE",
  DISABLE: "DISABLE",
};

const FuelTypes = {
  PERTALITE: "PERTALITE",
  PERTAMAX: "PERTAMAX",
  DEXLITE: "DEXLITE",
  PERTAMAXTURBO: "PERTAMAXTURBO",
};

const statusColors = {
  [VehicleStatus.AVAILABLE]: "bg-green-100 text-green-800 border-green-200",
  [VehicleStatus.DISABLE]: "bg-red-100 text-red-800 border-red-200",
  [VehicleStatus.MAINTENANCE]:
    "bg-yellow-100 text-yellow-800 border-yellow-200",
  [VehicleStatus.RENTED]: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function UpdateVehicleForm() {
  const { id: vehicle_id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();
  const [combineImage, setCombineImage] = useState<
    { src: string; type: "url" | "file"; file?: File }[]
  >([]);
  const { mutateAsync: updateVehicleAsync, isPending: isCreating } =
    useUpdateVehicle(accessToken || "");
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const { mutateAsync: deleteImageAsync } = useDeleteImage(accessToken || "");
  const { data } = useVehicleById(vehicle_id!, accessToken || "");
  const [dragActive, setDragActive] = useState(false);
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
      type: "",
      transmition: "",
      status: "",
      fuel: "",
      brand: "",
      capacity: 0,
      kilometer: 0,
      year: new Date().getFullYear(),
      price_per_day: "",
      image_url: [],
      description: "",
      color: "",
      new_images: [],
    },
    UpdateVehicleSchema
  );

  useEffect(() => {
    const urlImages = form.image_url.map((url) => ({
      src: url,
      type: "url" as const,
    }));

    const fileImages = form.new_images.map((file) => ({
      src: URL.createObjectURL(file),
      type: "file" as const,
      file: file,
    }));

    setCombineImage([...urlImages, ...fileImages]);
  }, [form.image_url, form.new_images]);

  useEffect(() => {
    if (data?.data) {
      setForm({
        name: data.data.name,
        type: data.data.type,
        transmition: data.data.transmition,
        status: data.data.status,
        fuel: data.data.fuel,
        brand: data.data.brand,
        capacity: data.data.capacity,
        kilometer: data.data.kilometer,
        year: data.data.year,
        price_per_day: data.data.price_per_day,
        image_url: data.data.image_url || [],
        color: data.data.color,
        description: data.data.description,
        new_images: [],
      });
    }
  }, [data, setForm]);

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
        image_url: prev.image_url.filter((_, i) => i !== urlIndex),
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

  const handleReset = () => {
    setForm({
      name: "",
      type: "",
      transmition: "",
      status: "",
      fuel: "",
      brand: "",
      capacity: 0,
      kilometer: 0,
      year: new Date().getFullYear(),
      price_per_day: "",
      image_url: [],
      description: "",
      color: "",
      new_images: [],
    });
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const uploadedImages: string[] = [];

      const currentImageUrls = form.image_url;
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
      const { ...rest } = form;
      const submissionPayload = {
        ...rest,
        id: vehicle_id!,
        image_url: finalImageUrls,
      };
      const data = await updateVehicleAsync({
        id: vehicle_id!,
        data: submissionPayload,
      });
      if (data.success) {
        toast.success("Success", {
          description: `Successfuly created ${data.data.name} Destination`,
        });
        resetForm();
        navigate("/data-vehicle");
        navigate(0);
      } else {
        toast.error("Failed", {
          description: `Failed created new destination`,
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
        toast.error("Failed to create Destination.");
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return <CheckCircle className="h-4 w-4" />;
      case VehicleStatus.DISABLE:
        return <AlertCircle className="h-4 w-4" />;
      case VehicleStatus.MAINTENANCE:
        return <Settings className="h-4 w-4" />;
      case VehicleStatus.RENTED:
        return <Star className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Card */}
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-lg">
              <Car className="h-6 w-6" />
            </div>
            Update New Vehicle
          </CardTitle>
          <CardDescription className="text-base">
            Update a vehicle to your fleet with detailed specifications and
            images
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Form Card */}
      <Card className="border border-gray-200 shadow-lg">
        <CardContent className="bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-blue-100 rounded">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vehicle Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Name
                  </Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter vehicle name"
                    className="h-11"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Brand
                  </Label>
                  <Input
                    name="brand"
                    value={form.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    placeholder="e.g., Toyota, Honda, BMW"
                    className="h-11"
                  />
                  {fieldErrors.brand && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.brand}
                    </p>
                  )}
                </div>

                {/* Vehicle Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Vehicle Type
                  </Label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="h-11 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select vehicle type</option>
                    {Object.entries(VehicleTypes).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.type && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.type}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color
                  </Label>
                  <Input
                    name="color"
                    value={form.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    placeholder="e.g., White, Black, Red"
                    className="h-11"
                  />
                  {fieldErrors.color && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.color}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Year
                  </Label>
                  <Input
                    name="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={form.year}
                    onChange={(e) =>
                      handleChange("year", Number(e.target.value))
                    }
                    placeholder="e.g., 2023"
                    className="h-11"
                  />
                  {fieldErrors.year && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.year}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    {getStatusIcon(form.status)}
                    Status
                  </Label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="h-11 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {Object.entries(VehicleStatus).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                    <option value={VehicleStatus.RENTED}>⭐ Rented</option>
                  </select>
                  <Badge
                    className={`w-fit ${
                      statusColors[form.status as keyof typeof statusColors]
                    }`}
                  >
                    {form.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Technical Specifications Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-green-100 rounded">
                  <Settings className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  Technical Specifications
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Transmission */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Transmission
                  </Label>
                  <select
                    name="transmition"
                    value={form.transmition}
                    onChange={(e) =>
                      handleChange("transmition", e.target.value)
                    }
                    className="h-11 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select transmission</option>
                    {Object.entries(Transmission).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.transmition && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.transmition}
                    </p>
                  )}
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    Fuel Type
                  </Label>
                  <select
                    name="fuel"
                    value={form.fuel}
                    onChange={(e) => handleChange("fuel", e.target.value)}
                    className="h-11 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select fuel type</option>
                    {Object.entries(FuelTypes).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.fuel && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.fuel}
                    </p>
                  )}
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity
                  </Label>
                  <Input
                    name="capacity"
                    type="number"
                    min="1"
                    max="50"
                    value={form.capacity}
                    onChange={(e) =>
                      handleChange("capacity", Number(e.target.value))
                    }
                    placeholder="Passengers"
                    className="h-11"
                  />
                  {fieldErrors.capacity && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.capacity}
                    </p>
                  )}
                </div>

                {/* Kilometer */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Odometer (km)
                  </Label>
                  <Input
                    name="kilometer"
                    type="number"
                    min="0"
                    value={form.kilometer}
                    onChange={(e) =>
                      handleChange("kilometer", Number(e.target.value))
                    }
                    placeholder="Current mileage"
                    className="h-11"
                  />
                  {fieldErrors.kilometer && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.kilometer}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-yellow-100 rounded">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold">Pricing</h3>
              </div>
              <div className="max-w-md">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price per Day (IDR)
                  </Label>
                  <Input
                    name="price_per_day"
                    value={form.price_per_day}
                    onChange={(e) =>
                      handleChange("price_per_day", e.target.value)
                    }
                    placeholder="e.g., 500000"
                    className="h-11 text-lg font-medium"
                  />
                  {fieldErrors.price_per_day && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.price_per_day}
                    </p>
                  )}
                  {form.price_per_day && !isNaN(Number(form.price_per_day)) && (
                    <p className="text-sm text-gray-600">
                      Monthly rate: IDR{" "}
                      {(Number(form.price_per_day) * 30).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            {/* Description Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-purple-100 rounded">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Description & Details</h3>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Vehicle Description
                </Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the vehicle features, condition, and any special notes..."
                  rows={5}
                  className="resize-none"
                />
                {fieldErrors.description && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.description}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {form.description.length}/500 characters
                </p>
              </div>
            </div>

            <Separator />
            {/* Image Upload Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-red-100 rounded">
                  <ImageIcon className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Vehicle Images</h3>
                <Badge variant="outline" className="ml-auto">
                  {form.image_url.length} image
                  {form.image_url.length !== 1 ? "s" : ""} uploaded
                </Badge>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-black bg-gray-50 scale-105"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium mb-2">
                  Upload Vehicle Images
                </h4>
                <p className="text-gray-600 mb-4">
                  Drag and drop images here, or click to select files
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
                  size="lg"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  className="mb-4"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <p className="text-sm text-gray-500">
                  Maximum file size: 5MB per image • Supported formats: JPG,
                  PNG, GIF, WebP
                </p>
              </div>

              {fieldErrors.image_url && (
                <p className="text-red-600 text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.image_url}
                </p>
              )}

              {/* Image Previews */}
              {form.image_url.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Image Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isCreating || isUploading}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                {isCreating || isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Create Vehicle
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleReset}
                disabled={isCreating || isUploading}
              >
                Reset Form
              </Button>
            </div>

            {fieldErrors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.general}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
