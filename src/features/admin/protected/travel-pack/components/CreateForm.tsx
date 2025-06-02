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
  Calendar,
  DollarSign,
  HotelIcon,
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
import { useCreateTravelPack } from "../hooks/useTravelPack";
import {  useNavigate } from "react-router-dom";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { TravelPackSchema } from "../utils/zod.schema";
import { FormInput } from "@/shared/components/ui/form-field";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { FormTextarea } from "@/shared/components/ui/form-text-area";
import type { IDestination } from "../../destinations/types/destination.type";
import { useAllDestinations } from "../../destinations/hooks/useDestinations";
import { FormSelect } from "@/shared/components/ui/form-select";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";
import { useUploadImage } from "@/shared/hooks/useStorage";
import { useAllAccomodation } from "../../acccomodation/hooks/useAccomodation";
import type { IAccomodation } from "../../acccomodation/types/accomodation.type";

export default function CreateForm() {
  const { accessToken } = useAuthContext();
  const { mutateAsync: createTravelPackAsync, isPending: isCreating } =
    useCreateTravelPack(accessToken || "");
  const { data: dataDestinations } = useAllDestinations(accessToken || "");
  const { data: dataAccomodations } = useAllAccomodation(accessToken || "");
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const navigate = useNavigate();
  const [selectedDestinations, setSelectedDestinations] = useState<
    IDestination[]
  >([]);
  const [selectedAccomodation, setSelectedAccomodation] =
    useState<IAccomodation>();

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
      accomodation_id: "",
      duration: 1,
      name: "",
      image: undefined,
      travel_package_destinations: [{ destination_id: "" }],
      pax_options: [{ pax: 0, price: 0 }],
      travel_itineraries: [
        { destination_id: "", day_number: 0, description: "" },
      ],
    },
    TravelPackSchema
  );

  useEffect(() => {
    const validItineraries = form.travel_itineraries.filter(
      (i) => i.day_number >= 1
    );

    const filledDays = new Set(validItineraries.map((i) => i.day_number));

    const newItineraries = [...validItineraries];

    for (let day = 1; day <= form.duration; day++) {
      if (!filledDays.has(day)) {
        newItineraries.push({
          day_number: day,
          destination_id: selectedDestinations[0]?.id || "",
          description: "",
        });
      }
    }

    newItineraries.sort((a, b) => a.day_number - b.day_number);

    if (
      newItineraries.length !== form.travel_itineraries.length ||
      JSON.stringify(newItineraries) !== JSON.stringify(form.travel_itineraries)
    ) {
      handleChange(
        "travel_itineraries",
        newItineraries as [
          {
            description: string;
            destination_id: string;
            day_number: number;
          }
        ]
      );
    }
  }, [form.duration, selectedDestinations]);

  const handleDestinationRemove = (destinationId: string) => {
    setSelectedDestinations(
      selectedDestinations.filter((d) => d.id !== destinationId)
    );
  };

  const addPaxOption = () => {
    handleChange("pax_options", [...form.pax_options, { pax: 0, price: 0 }]);
  };

  const removePaxOption = (index: number) => {
    const updated = form.pax_options.filter((_, i) => i !== index);
    const finalUpdated = updated.length > 0 ? updated : [{ pax: 0, price: 0 }];
    handleChange(
      "pax_options",
      finalUpdated as [
        { pax: number; price: number },
        ...{ pax: number; price: number }[]
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
      image: file,
    }));
  };

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      image: undefined,
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
    if (!validateForm()) {
      return;
    }

    try {
      const uploadedImageResponses = await uploadImageAsync(form.image as File);
      const submissionPayload = {
        ...form,
        image: uploadedImageResponses.data.url || "",
        travel_itineraries: form.travel_itineraries.filter(
          (item) => item.day_number >= 1
        ),
      };
      console.log(submissionPayload);
      const data = await createTravelPackAsync(submissionPayload);
      if (data.success) {
        toast.success("Success", {
          description: `Successfuly created ${data.data.name} Travel Package`,
        });
        resetForm();
        navigate("/staff/data-travel-pack");
        navigate(0);
      } else {
        toast.error("Failed", {
          description: `Failed created new destination`,
        });
      }
    } catch (err: any) {
      if (err?.errors && typeof err.errors === "object") {
        console.log(err.error);
        setFieldErrors((prev: any) => ({
          ...prev,
          ...err.errors,
        }));
      } else {
        console.log(err.message);
        setFieldErrors((prev) => ({
          ...prev,
          general: err.message || "Unknown error occurred",
        }));
        toast.error("Failed to create travel pack.", {
          description: `${err.message}`,
        });
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
                  label="Duration (days)"
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

            {/* Image Preview */}
            {form.image && (
              <div className="mt-4 relative w-full h-[50%] rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Uploaded Preview"
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
                  {form.image.name}
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
                                    { pax: number; price: number },
                                    ...{ pax: number; price: number }[]
                                  ])
                                : [{ pax: 0, price: 0 }]
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
                                      { pax: number; price: number },
                                      ...{ pax: number; price: number }[]
                                    ])
                                  : [{ pax: 0, price: 0 }]
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

        <Card>
          <CardContent>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1">
                  <HotelIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Accomodation</h3>
              </div>
            </div>
            <FormSelect
              label="Choosee Accomodation"
              name="accomodation"
              onChange={(e) => {
                const selectedId = e.target.value;
                const accomodations = dataAccomodations?.data.find(
                  (v) => v.id === selectedId
                );

                if (accomodations) {
                  setSelectedAccomodation(accomodations);
                  handleChange("accomodation_id", selectedId);
                }
              }}
              value=""
              error={fieldErrors.accomodation_id}
              placeholder="Select Accomodation"
              options={(dataAccomodations?.data || []).map(
                (accomodation: IAccomodation) => ({
                  label: `${accomodation.name} - ${accomodation.address}`,
                  value: accomodation.id,
                })
              )}
            />
            {selectedAccomodation && (
              <div>
                <div className="flex items-center justify-between mb-3 mt-4"></div>
                <div className="space-y-4">
                  <div
                    key={selectedAccomodation.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4">
                        <img
                          src={
                            selectedAccomodation.image_urls[0] ||
                            "/placeholder.svg"
                          }
                          alt={selectedAccomodation.name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      <div className="p-4 md:w-3/4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold">
                              {selectedAccomodation.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>{selectedAccomodation.address}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedAccomodation.description}
                        </p>

                        {selectedAccomodation.facilities.map((val) => (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 mx-0.5"
                          >
                            {val}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    })) as [{ destination_id: string }]
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

        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Travel Itineraries</h3>
            </div>

            {form.duration > 0 && (
              <div className="space-y-8">
                {Array.from({ length: form.duration }).map((_, index) => {
                  const dayNumber = index + 1;
                  const itinerariesForDay = form.travel_itineraries.filter(
                    (i) => i.day_number === dayNumber
                  );

                  return (
                    <div key={dayNumber}>
                      <h4 className="font-semibold mb-2">Day {dayNumber}</h4>
                      <div className="space-y-4">
                        {itinerariesForDay.map((itinerary, idx) => {
                          const globalIndex = form.travel_itineraries.findIndex(
                            (item) =>
                              item.day_number === dayNumber &&
                              form.travel_itineraries
                                .filter((it) => it.day_number === dayNumber)
                                .indexOf(item) === idx
                          );

                          return (
                            <div
                              key={`${dayNumber}-${idx}`}
                              className="border p-4 rounded-md space-y-2 bg-gray-50"
                            >
                              <FormSelect
                                label="Destination"
                                name={`travel_itineraries.${dayNumber}.${idx}.destination_id`}
                                value={itinerary.destination_id}
                                onChange={(e) => {
                                  if (globalIndex === -1) return;
                                  const updated = [...form.travel_itineraries];
                                  updated[globalIndex] = {
                                    ...updated[globalIndex],
                                    destination_id: e.target.value,
                                  };
                                  handleChange(
                                    "travel_itineraries",
                                    updated as [
                                      {
                                        description: string;
                                        destination_id: string;
                                        day_number: number;
                                      }
                                    ]
                                  );
                                }}
                                options={selectedDestinations.map((d) => ({
                                  label: d.name,
                                  value: d.id,
                                }))}
                                placeholder="Select destination"
                              />

                              <FormInput
                                label="Description"
                                name={`travel_itineraries.${dayNumber}.${idx}.description`}
                                value={itinerary.description}
                                onChange={(e) => {
                                  if (globalIndex === -1) return;
                                  const updated = [...form.travel_itineraries];
                                  updated[globalIndex] = {
                                    ...updated[globalIndex],
                                    description: e.target.value,
                                  };
                                  handleChange(
                                    "travel_itineraries",
                                    updated as [
                                      {
                                        description: string;
                                        destination_id: string;
                                        day_number: number;
                                      }
                                    ]
                                  );
                                }}
                                placeholder="Enter itinerary details"
                              />

                              <div className="flex justify-end">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    const updated =
                                      form.travel_itineraries.filter(
                                        (_, i) => i !== globalIndex
                                      );
                                    handleChange(
                                      "travel_itineraries",
                                      updated as [
                                        {
                                          description: string;
                                          destination_id: string;
                                          day_number: number;
                                        }
                                      ]
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          );
                        })}

                        {itinerariesForDay.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No itinerary added yet.
                          </p>
                        )}

                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => {
                              const updated = [
                                ...form.travel_itineraries,
                                {
                                  day_number: dayNumber,
                                  destination_id:
                                    selectedDestinations[0]?.id || "",
                                  description: "",
                                },
                              ];
                              handleChange(
                                "travel_itineraries",
                                updated as [
                                  {
                                    description: string;
                                    destination_id: string;
                                    day_number: number;
                                  }
                                ]
                              );
                            }}
                          >
                            + Add Destination
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <div className="flex items-center gap-2">Create Package</div>
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
