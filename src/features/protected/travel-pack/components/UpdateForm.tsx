import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Calculator,
  DollarSign,
  InfoIcon,
  MapPin,
  Palmtree,
  PlaneIcon,
  Plus,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import { useUpdateTravelPack, useTravelPackById } from "../hooks/useTravelPack";
import { useNavigate, useParams } from "react-router-dom";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { UpdateTravelPackSchema } from "../utils/zod.schema";
import { FormInput } from "@/shared/components/ui/form-field";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { FormTextarea } from "@/shared/components/ui/form-text-area";
import type { IDestination } from "../../destinations/types/destination.type";
import { useAllDestinations } from "../../destinations/hooks/useDestinations";
import { FormSelect } from "@/shared/components/ui/form-select";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";
import { useDeleteImage, useUploadImage } from "@/shared/hooks/useStorage";

export default function UpdateForm() {
  const { accessToken } = useAuthContext();
  const { id: travel_pack_id } = useParams<{ id: string }>();
  const { mutateAsync: updateTravelPackAsync, isPending: isCreating } =
    useUpdateTravelPack(accessToken || "");
  const { data: dataDestinations } = useAllDestinations(accessToken || "");
  const { data: dataTravelPack } = useTravelPackById(
    travel_pack_id!,
    accessToken || ""
  );
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const { mutateAsync: deleteImageAsync } = useDeleteImage(accessToken || "");
  const navigate = useNavigate();
  const [selectedDestinations, setSelectedDestinations] = useState<
    IDestination[]
  >([]);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");

  const {
    form,
    fieldErrors,
    handleChange,
    validateForm,
    setFieldErrors,
    setForm,
    resetForm,
  } = useZodForm(
    {
      description: "",
      duration: 1,
      name: "",
      image: "",
      new_images: undefined,
      travel_package_destinations: [{ id: "", destination_id: "" }],
      pax_options: [{ id: "", pax: 0, price: 0 }],
    },
    UpdateTravelPackSchema
  );

  useEffect(() => {
    if (dataTravelPack?.data && dataDestinations?.data) {
      const { data } = dataTravelPack;
      if (
        data.travel_package_destinations.length > 0 &&
        data.pax_options.length > 0
      ) {
        const travel_package_destinations =
          data.travel_package_destinations.map((dest) => ({
            id: dest.id,
            destination_id: dest.destination_id,
          })) as [
            { id: string; destination_id: string },
            ...{ id: string; destination_id: string }[]
          ];

        const matchedDestinations = travel_package_destinations
          .map((d) =>
            dataDestinations.data.find((dest) => dest.id === d.destination_id)
          )
          .filter((d): d is IDestination => d !== undefined);
        setSelectedDestinations(matchedDestinations);

        const pax_options = data.pax_options.map((pax) => ({
          id: pax.id,
          pax: pax.pax,
          price: Number(pax.price),
        })) as [
          { id: string; pax: number; price: number },
          ...{ id: string; pax: number; price: number }[]
        ];

        setOriginalImageUrl(data.image);

        setForm({
          description: data.description,
          duration: data.duration,
          name: data.name,
          image: data.image,
          new_images: undefined,
          travel_package_destinations,
          pax_options,
        });
      }
    }
  }, [dataTravelPack, dataDestinations, setForm]);

  const handleDestinationRemove = (destinationId: string) => {
    const updatedDestinations = selectedDestinations.filter(
      (d) => d.id !== destinationId
    );
    setSelectedDestinations(updatedDestinations);

    handleChange(
      "travel_package_destinations",
      updatedDestinations.map((d) => ({
        destination_id: d.id,
      })) as [
        { id: string; destination_id: string },
        ...{ id: string; destination_id: string }[]
      ]
    );
  };

  const addPaxOption = () => {
    handleChange("pax_options", [
      ...form.pax_options,
      { id: "", pax: 0, price: 0 },
    ]);
  };

  const removePaxOption = (index: number) => {
    const updated = form.pax_options.filter((_, i) => i !== index);
    const finalUpdated = updated.length > 0 ? updated : [{ pax: 0, price: 0 }];
    handleChange(
      "pax_options",
      finalUpdated as [
        { id: string; pax: number; price: number },
        ...{ id: string; pax: number; price: number }[]
      ]
    );
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const isValidType = file.type.startsWith("image/");
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      toast.error("Error", {
        description: "File must be an image",
      });
      return;
    }

    if (!isValidSize) {
      toast.error("Error", {
        description: "File size must be less than 5MB",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      new_images: file,
    }));
  };

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      image: "",
      new_images: undefined,
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
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validate = validateForm();
    if (!validate) {
      console.warn("Validation failed with errors:", fieldErrors);
      return;
    }

    try {
      let imageUrl = originalImageUrl;
      if (form.new_images) {
        const currentImageFilenames = imageUrl.split("/").pop();
        const uploadedImageResponses = await uploadImageAsync(form.new_images);
        imageUrl = uploadedImageResponses.data.url;

        if (originalImageUrl && originalImageUrl !== imageUrl) {
          try {
            await deleteImageAsync(currentImageFilenames!);
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError);
          }
        }
      }

      const submissionPayload = {
        description: form.description,
        duration: form.duration,
        name: form.name,
        image: imageUrl,
        travel_package_destinations: form.travel_package_destinations,
        pax_options: form.pax_options,
      };

      const data = await updateTravelPackAsync({
        id: travel_pack_id!,
        data: submissionPayload,
      });

      console.log("data :", data);

      if (data.success) {
        toast.success("Success", {
          description: `Successfully updated ${data.data.name} Travel Package`,
        });
        resetForm();
        navigate("/data-travel-pack");
        navigate(0);
      } else {
        toast.error("Failed", {
          description: `Failed to update travel package`,
        });
      }
    } catch (err: any) {
      console.error("Submit error:", err);
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
        toast.error("Failed to update travel package.");
      }
    }
  };

  if (isCreating || isUploading) {
    <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-black text-white rounded-lg">
                <PlaneIcon className="h-6 w-6" />
              </div>
              Create New Travel Package
            </CardTitle>
            <CardDescription className="text-base">
              Add a new travel package to your fleet with detailed
              specifications and images
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="bg-white p-8">
            {/* Main Form Card */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 ">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-5">
                {/* Travel Name */}
                <FormInput
                  name="name"
                  label="Package Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter travel name"
                  error={fieldErrors.name}
                />

                {/* Duration (Hours) */}
                <FormInput
                  name="duration"
                  type="number"
                  label="Duration (Hours)"
                  value={form.duration}
                  onChange={(e) =>
                    handleChange("duration", Number(e.target.value))
                  }
                  error={fieldErrors.duration}
                />

                {/* Descriiptions */}
                <div className="col-span-2">
                  <FormTextarea
                    name="description"
                    label="Package Description"
                    value={form.description}
                    placeholder="Describe your package travel"
                    onChange={(e) => {
                      handleChange("description", e.target.value);
                    }}
                    error={fieldErrors.description}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="bg-white p-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 ">
                  <Upload className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Travel Image</h3>
              </div>
            </div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop image here, or click to select
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>
            {(form.new_images || form.image) && (
              <div className="mt-4 relative w-full h-[50%] rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={
                    form.new_images
                      ? URL.createObjectURL(form.new_images)
                      : form.image
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:opacity-90 transition-opacity"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate text-center">
                  {form.new_images ? form.new_images.name : "Current image"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pax and Price */}
        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="bg-white p-8">
            <div className="bg-white mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-orange-500" />
                  <h2 className="text-lg font-medium">Passenger Option</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPaxOption}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Pax Option
                </Button>
              </div>

              <div className="space-y-4">
                {form.pax_options.map((field, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Configuration {index + 1}</h3>
                      {form.pax_options.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePaxOption(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">
                          Number of Passengers
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="e.g., 2"
                          className="h-10"
                          value={field.pax}
                          onChange={(e) => {
                            const updatedPax = [...form.pax_options];
                            updatedPax[index] = {
                              ...updatedPax[index],
                              pax: Number(e.target.value) || 0,
                            };
                            handleChange(
                              "pax_options",
                              updatedPax.length > 0
                                ? (updatedPax as [
                                    { id: string; pax: number; price: number },
                                    ...{
                                      id: string;
                                      pax: number;
                                      price: number;
                                    }[]
                                  ])
                                : [{ id: "", pax: 0, price: 0 }]
                            );
                          }}
                        />
                        {fieldErrors.pax_options?.[index] &&
                          typeof fieldErrors.pax_options[index] === "object" &&
                          fieldErrors.pax_options[index] && (
                            <p className="text-red-500 text-xs mt-1">
                              {field.pax}
                            </p>
                          )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">
                          Price per Person (IDR)
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 1500000"
                            className="pl-10 h-10"
                            value={field.price}
                            onChange={(e) => {
                              const updatedPax = [...form.pax_options];
                              updatedPax[index] = {
                                ...updatedPax[index],
                                price: Number(e.target.value) || 0,
                              };
                              handleChange(
                                "pax_options",
                                updatedPax.length > 0
                                  ? (updatedPax as [
                                      {
                                        id: string;
                                        pax: number;
                                        price: number;
                                      },
                                      ...{
                                        id: string;
                                        pax: number;
                                        price: number;
                                      }[]
                                    ])
                                  : [{ id: "", pax: 0, price: 0 }]
                              );
                            }}
                          />
                        </div>
                        {fieldErrors.pax_options?.[index] &&
                          typeof fieldErrors.pax_options[index] === "object" &&
                          fieldErrors.pax_options[index] && (
                            <p className="text-red-500 text-xs mt-1">
                              {field.price}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destinasi */}
        <Card>
          <CardContent>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1">
                  <Palmtree className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Travel Destination</h3>
              </div>
            </div>
            {/* Travel Destination */}
            <FormSelect
              label="Add Destination"
              name="travel_destination"
              onChange={(e) => {
                const selectedId = e.target.value;
                const destination = dataDestinations?.data?.find(
                  (v: IDestination) => v.id === selectedId
                );
                if (
                  destination &&
                  !selectedDestinations.some((d) => d.id === destination.id)
                ) {
                  setSelectedDestinations((prev) => [...prev, destination]);
                  handleChange(
                    "travel_package_destinations",
                    [...selectedDestinations, destination].map((d) => ({
                      destination_id: d.id,
                    })) as [{ id: string; destination_id: string }]
                  );
                }
              }}
              value=""
              error={fieldErrors.travel_package_destinations}
              placeholder="Select destination"
              options={(dataDestinations?.data || [])
                .filter((d) => !selectedDestinations.some((s) => s.id === d.id))
                .map((destination: IDestination) => ({
                  label: `${destination.name} - ${destination.category}`,
                  value: destination.id,
                }))}
            />
            {selectedDestinations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 mt-4">
                  <Label className="text-sm font-medium">
                    Selected Destinations
                  </Label>
                  <span className="text-xs text-gray-500">
                    {selectedDestinations.length} selected
                  </span>
                </div>
                <div className="space-y-4">
                  {selectedDestinations.map((destination) => (
                    <div
                      key={destination.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <img
                            src={
                              destination.image_urls[0] || "/placeholder.svg"
                            }
                            alt={destination.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-3/4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold">{destination.name}</h3>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{destination.address}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDestinationRemove(destination.id)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {destination.description}
                          </p>
                          <Badge variant="outline" className="bg-gray-50">
                            {destination.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sumary s*/}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-medium">Package Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Package Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-600">Package Name:</span>
                    <span className="font-medium">
                      {form.name || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {form.duration || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-600">Destinations:</span>
                    <span className="font-medium">
                      {selectedDestinations.length} selected
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Configurations:</span>
                    <span className="font-medium">
                      {form.pax_options?.length || 0} pricing options
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">
                  Passenger Configurations
                </h3>
                <div className="space-y-2">
                  {form.pax_options?.map((pax, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          Option {index + 1}
                        </div>
                        <div className="flex justify-between">
                          <span>{pax.pax || 0} passengers</span>
                          <span>
                            IDR {(pax.price || 0).toLocaleString()}/person
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!form.pax_options || form.pax_options.length === 0) && (
                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-500">
                      No configurations added yet
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Selected Destinations</span>
                  </div>
                  <p className="text-sm ml-6">
                    {selectedDestinations.length > 0
                      ? selectedDestinations.map((dest) => dest.name).join(", ")
                      : "No destinations selected"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            className="flex-1 bg-black text-white hover:bg-gray-800"
            disabled={isCreating || isUploading}
          >
            {isCreating || isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">Create User</div>
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
          <p className="text-red-600 mt-2">{fieldErrors.general}</p>
        )}
      </form>
    </div>
  );
}
