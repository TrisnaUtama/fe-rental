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
import {
  MapPin,
  FileText,
  ImageIcon,
  Navigation,
  Settings,
  Plus,
  X,
  Upload,
  Trash2,
  DollarSign,
} from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import { useCreateAccomodation } from "../hooks/useAccomodation";
import { useUploadImage } from "@/shared/hooks/useStorage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { AccomodationSchema } from "../utils/zod.schema";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { FormInput } from "@/shared/components/ui/form-field";
import { FormTextarea } from "@/shared/components/ui/form-text-area";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function CreateAccomodationForm() {
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();
  const { mutateAsync: createDestinationAsync, isPending: isCreating } =
    useCreateAccomodation(accessToken || "");

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
      description: "",
      image_urls: [],
      facilities: [""],
      price_per_night: 0,
      address: "",
    },
    AccomodationSchema
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const uploadedImageResponses = await Promise.all(
        form.image_urls.map((file) => uploadImageAsync(file as File))
      );
      const imageUrls = uploadedImageResponses.map((res) => res.data.url);
      const { ...rest } = form;
      const submissionPayload = {
        ...rest,
        image_urls: imageUrls,
        status: true,
      };
      const data = await createDestinationAsync(submissionPayload);
      if (data.success) {
        toast.success("Success", {
          description: `Successfuly created ${data.data.name} Accomodation`,
        });
        resetForm();
        navigate("/staff/data-accomodation");
        navigate(0);
      } else {
        toast.error("Failed", {
          description: `Failed created new accomodation`,
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

    setForm((prev) => ({
      ...prev,
      image_urls: [...prev.image_urls, ...validFiles],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
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
      description: "",
      image_urls: [],
      facilities: [""],
      price_per_night: 0,
    });
    setFieldErrors({});
  };

  if (isCreating || isUploading) {
    <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-lg">
              <MapPin className="h-6 w-6" />
            </div>
            Create New Destination
          </CardTitle>
          <CardDescription className="text-base">
            Add a new destination to your fleet with detailed specifications and
            images
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="border border-gray-200 shadow-lg">
        <CardContent className="bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Form Card */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-blue-100 rounded">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-5">
                {/* Destination Name */}
                <FormInput
                  name="name"
                  label="Accomodation Name"
                  icon={MapPin}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter accomodation name"
                  error={fieldErrors.name}
                />

                {/* Address */}
                <FormInput
                  name="address"
                  label="Address"
                  icon={Navigation}
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="e.g. Pantai Kuta"
                  error={fieldErrors.address}
                />

                <FormInput
                  name="price_per_night"
                  label="Price"
                  icon={DollarSign}
                  type="number"
                  value={form.price_per_night}
                  onChange={(e) =>
                    handleChange("price_per_night", Number(e.target.value))
                  }
                  placeholder="e.g. Rp. 2000000"
                  error={fieldErrors.price_per_night}
                />
              </div>
              {/* Description */}
              <div className="grid grid-cols-1 gap-6">
                <FormTextarea
                  name="description"
                  label="Description"
                  icon={FileText}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter destination description"
                  rows={4}
                  maxLength={500}
                  error={fieldErrors.description}
                />
              </div>
            </div>
            <Separator />

            {/* Image Upload */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-red-100 rounded">
                  <ImageIcon className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Accomodation Images</h3>
                <Badge variant="outline" className="ml-auto">
                  {form.image_urls.length} image
                  {form.image_urls.length !== 1 ? "s" : ""} uploaded
                </Badge>
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
                    {form.image_urls.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
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
                          {file.name}
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
            <Separator />

            {/* Facilities */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 bg-green-100 rounded">
                  <Settings className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  Technical Specifications
                </h3>
              </div>
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
                {isCreating || isUploading ? "Saving..." : "Create Accomodation"}
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
