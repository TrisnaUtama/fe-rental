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
import {
  useUpdateTravelPack,
  useTravelPackById,
  useAddNewItineraries,
  useAddNewPax,
  useAddNewDestination,
} from "../hooks/useTravelPack";
import {  useNavigate, useParams } from "react-router-dom";
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
import { useAllAccomodation } from "@/features/admin/protected/acccomodation/hooks/useAccomodation";
import type { ITravel_Itineraries } from "../types/travel-pack";
import type { IAccomodation } from "../../acccomodation/types/accomodation.type";

type SelectedDestination = {
  destination: IDestination;
  isNew: boolean;
  travel_package_destination_id?: string;
};

export default function UpdateForm() {
  const { accessToken } = useAuthContext();
  const { id: travel_pack_id } = useParams<{ id: string }>();
  const { mutateAsync: updateTravelPackAsync, isPending: isCreating } =
    useUpdateTravelPack(accessToken || "");
  const { data: dataDestinations } = useAllDestinations();
  const { data: dataTravelPack } = useTravelPackById(
    travel_pack_id!,
  );
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const { mutateAsync: deleteImageAsync } = useDeleteImage(accessToken || "");
  const { mutateAsync: addNewItineraries } = useAddNewItineraries(
    accessToken || ""
  );
  const { data: dataAccomodations } = useAllAccomodation(accessToken || "");
  const { mutateAsync: addNewPax } = useAddNewPax(accessToken || "");
  const { mutateAsync: addNewDest } = useAddNewDestination(accessToken || "");
  const navigate = useNavigate();
  const [selectedDestinations, setSelectedDestinations] = useState<
    SelectedDestination[]
  >([]);
  const [selectedAccomodation, setSelectedAccomodation] =
    useState<IAccomodation>();
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
      accommodation_id: "",
      new_images: undefined,
      travel_package_destinations: [{ id: "", destination_id: "" }],
      pax_options: [{ id: "", pax: 0, price: 0 }],
      travel_itineraries: [
        { id: "", destination_id: "", day_number: 0, description: "" },
      ],
      new_itineraries: [],
      new_travel_destination: [],
      new_pax_options: [],
    },
    UpdateTravelPackSchema
  );

  useEffect(() => {
    if (
      dataTravelPack?.data &&
      dataDestinations?.data &&
      dataAccomodations?.data
    ) {
      const { data } = dataTravelPack;
      if (
        data.travel_package_destinations.length > 0 &&
        data.pax_options.length > 0
      ) {
        const travel_package_destinations = data.travel_package_destinations
          .map((dest) => {
            const destination = dataDestinations.data.find(
              (d) => d.id === dest.destination_id
            );

            return destination
              ? {
                  destination,
                  isNew: false,
                  travel_package_destination_id: dest.id,
                }
              : null;
          })
          .filter(Boolean) as SelectedDestination[];

        const mappedTravelPackageDestinations = travel_package_destinations.map(
          (d) => ({
            id: d.travel_package_destination_id!,
            destination_id: d.destination.id,
          })
        );
        setSelectedDestinations(travel_package_destinations);
        const mappedAccomodation = dataAccomodations.data.find(
          (val) => val.id === data.accommodation_id
        );
        setSelectedAccomodation(mappedAccomodation);
        const pax_options = data.pax_options.map((pax) => ({
          id: pax.id,
          pax: pax.pax,
          price: Number(pax.price),
        })) as [
          { id: string; pax: number; price: number },
          ...{ id: string; pax: number; price: number }[]
        ];

        const travel_itineraries = data.travel_itineraries.map(
          (itineraries: any) => ({
            id: itineraries.id,
            destination_id: itineraries.destination_id,
            day_number: itineraries.day_number,
            description: itineraries.description,
          })
        ) as [
          {
            id: string;
            destination_id: string;
            day_number: number;
            description: string;
          },
          ...{
            id: string;
            destination_id: string;
            day_number: number;
            description: string;
          }[]
        ];

        setOriginalImageUrl(data.image);

        setForm({
          description: data.description,
          duration: data.duration,
          name: data.name,
          image: data.image,
          accommodation_id: form.accommodation_id,
          new_images: undefined,
          travel_package_destinations: mappedTravelPackageDestinations as [
            { id: string; destination_id: string },
            ...{ id: string; destination_id: string }[]
          ],
          pax_options,
          travel_itineraries,
          new_itineraries: [],
          new_pax_options: [],
          new_travel_destination: [],
        });
      }
    }
  }, [dataTravelPack, dataDestinations, dataAccomodations, setForm]);

  const handleDestinationRemove = (destinationId: string) => {
    const updatedDestinations = selectedDestinations.filter(
      (d) => d.destination.id !== destinationId
    );
    setSelectedDestinations(updatedDestinations);
    const allDestinations = updatedDestinations.map((d) => ({
      id: d.travel_package_destination_id || "",
      destination_id: d.destination.id,
    }));

    handleChange("travel_package_destinations", allDestinations);
    const newDestinations = updatedDestinations
      .filter((d) => d.isNew)
      .map((d) => ({
        destination_id: d.destination.id,
      }));

    handleChange("new_travel_destination", newDestinations);
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

    const existingItineraries = form.travel_itineraries.filter((it) => it.id);
    const existingPax = form.pax_options.filter((px) => px.id);
    const existingDest = form.travel_package_destinations.filter(
      (d) => d.id && d.id.trim() !== ""
    );

    const newItineraries = form.travel_itineraries.filter((it) => !it.id);
    const newPax = form.pax_options.filter((px) => !px.id);
    const newDest = form.new_travel_destination;

    form.new_itineraries = newItineraries;
    form.new_pax_options = newPax;
    form.new_travel_destination = newDest;
    form.pax_options = existingPax as [{ id: ""; pax: 0; price: 0 }];
    form.travel_itineraries = existingItineraries as [
      { id: ""; destination_id: ""; day_number: 0; description: "" }
    ];
    form.travel_package_destinations = existingDest as [
      { id: ""; destination_id: "" }
    ];

    const validate = validateForm();
    if (!validate) {
      throw new Error(`Validation failed with errors: ${fieldErrors}`, );
    }

    try {
      let imageUrl = originalImageUrl;

      if (form.new_images) {
        const currentImageFilename = imageUrl.split("/").pop();

        if (originalImageUrl && originalImageUrl !== imageUrl) {
          try {
            await deleteImageAsync(currentImageFilename!);
          } catch (deleteError) {
            throw new Error(`Failed to delete old image: ${deleteError}`, );
          }
        }

        const uploadedImageResponses = await uploadImageAsync(form.new_images);
        imageUrl = uploadedImageResponses.data.url;
      }

      const submissionPayload = {
        description: form.description,
        duration: form.duration,
        accomodation_id: form.accommodation_id,
        name: form.name,
        image: imageUrl,
        travel_package_destinations: existingDest,
        pax_options: existingPax,
        travel_itineraries: existingItineraries,
      };
      const data = await updateTravelPackAsync({
        id: travel_pack_id!,
        data: submissionPayload,
      });

      if (data.success) {
        if (newItineraries.length > 0) {
          try {
            await addNewItineraries({
              travel_package_id: travel_pack_id!,
              newItineraries,
            });
          } catch (itineraryError) {
            throw itineraryError;
          }
        }

        if (newPax.length > 0) {
          try {
            await addNewPax({
              travel_package_id: travel_pack_id!,
              new_pax_options: newPax,
            });
          } catch (paxError) {
            throw paxError;
          }
        }

        if (newDest!.length > 0) {
          try {
            await addNewDest({
              travel_package_id: travel_pack_id!,
              new_travel_destination: newDest!,
            });
          } catch (destError) {
            throw new Error(`Failed to update destination: ${destError}`);
          }
        }

        toast.success("Success", {
          description: `Successfully updated ${data.data.name} Travel Package`,
        });

        resetForm();
        navigate("/staff/data-travel-pack");
        navigate(0);
      } else {
        toast.error("Failed", {
          description: `Failed to update travel package`,
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

        toast.error("Failed to update travel package.");
      }
    }
  };

  useEffect(() => {
    if (form.duration > 0) {
      const filteredItineraries = form.travel_itineraries.filter(
        (it) => it.day_number <= form.duration
      );

      if (filteredItineraries.length !== form.travel_itineraries.length) {
        setForm((prev) => ({
          ...prev,
          travel_itineraries: filteredItineraries as [
            {
              id: string;
              destination_id: string;
              day_number: number;
              description: string;
            },
            ...{
              id: string;
              destination_id: string;
              day_number: number;
              description: string;
            }[]
          ],
        }));
      }
    }
  }, [form.duration]);

  const handleDurationChange = (newDuration: number) => {
    const oldDuration = form.duration;
    handleChange("duration", newDuration);

    setForm((prev: any) => {
      const currentNewItineraries = prev.new_itineraries ?? [];

      if (newDuration > oldDuration) {
        const additionalItineraries: ITravel_Itineraries[] = [];

        for (let day = oldDuration + 1; day <= newDuration; day++) {
          additionalItineraries.push({
            day_number: day,
            destination_id: "",
            description: "",
          });
        }

        return {
          ...prev,
          new_itineraries: [...currentNewItineraries, ...additionalItineraries],
        };
      } else {
        const filteredNewItineraries = currentNewItineraries.filter(
          (it: any) => it.day_number <= newDuration
        );

        const filteredTravelItineraries = prev.travel_itineraries.filter(
          (it: any) => it.day_number <= newDuration
        );

        const safeTravelItineraries =
          filteredTravelItineraries.length > 0
            ? filteredTravelItineraries
            : [
                {
                  id: "",
                  day_number: 1,
                  destination_id: "",
                  description: "",
                },
              ];

        return {
          ...prev,
          new_itineraries: filteredNewItineraries,
          travel_itineraries: safeTravelItineraries,
        };
      }
    });
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
              Update Travel Package
            </CardTitle>
            <CardDescription className="text-base">
              Update travel package to your fleet with detailed
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value > 0) {
                      handleDurationChange(value);
                    }
                  }}
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
                  handleChange("accommodation_id", selectedId);
                }
              }}
              value={form.accommodation_id || ""}
              error={fieldErrors.accommodation_id}
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
                  <div className="border rounded-lg overflow-hidden">
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
                            key={val}
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
                  !selectedDestinations.some(
                    (d) => d.destination.id === destination.id
                  )
                ) {
                  const updated = [
                    ...selectedDestinations,
                    {
                      destination,
                      isNew: true,
                    },
                  ];

                  setSelectedDestinations(updated);

                  // ✅ PERBAIKI: Gabungkan semua destinations dalam satu array
                  // Existing destinations tetap dengan ID, new destinations tanpa ID
                  const allDestinations = updated.map((d) => ({
                    id: d.travel_package_destination_id || "", // ✅ Empty string untuk destinations baru
                    destination_id: d.destination.id,
                  }));

                  handleChange("travel_package_destinations", allDestinations);

                  // ✅ Update new_travel_destination hanya untuk destinations baru
                  const newDestinations = updated
                    .filter((d) => d.isNew)
                    .map((d) => ({
                      destination_id: d.destination.id,
                    }));

                  handleChange("new_travel_destination", newDestinations);
                }
              }}
              value=""
              error={fieldErrors.travel_package_destinations}
              placeholder="Select destination"
              options={(dataDestinations?.data || [])
                .filter(
                  (d) =>
                    !selectedDestinations.some((s) => s.destination.id === d.id)
                )
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
                      key={destination.destination.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <img
                            src={
                              destination.destination.image_urls[0] ||
                              "/placeholder.svg"
                            }
                            alt={destination.destination.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-3/4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold">
                                {destination.destination.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{destination.destination.address}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDestinationRemove(
                                  destination.destination.id
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {destination.destination.description}
                          </p>
                          <Badge variant="outline" className="bg-gray-50">
                            {destination.destination.category}
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
                                        id: string;
                                        description: string;
                                        destination_id: string;
                                        day_number: number;
                                      }
                                    ]
                                  );
                                }}
                                options={selectedDestinations.map((d) => ({
                                  label: d.destination.name,
                                  value: d.destination.id,
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
                                        id: string;
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
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const updated =
                                      form.travel_itineraries.filter(
                                        (_, i) => i !== globalIndex
                                      );
                                    handleChange(
                                      "travel_itineraries",
                                      updated as [
                                        {
                                          id: string;
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
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [
                                ...form.travel_itineraries,
                                {
                                  day_number: dayNumber,
                                  destination_id:
                                    selectedDestinations[0]?.destination.id ||
                                    "",
                                  description:
                                    form.travel_itineraries[0].description,
                                },
                              ];
                              handleChange(
                                "travel_itineraries",
                                updated as [
                                  {
                                    id: string;
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
                      ? selectedDestinations
                          .map((dest) => dest.destination.name)
                          .join(", ")
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
              <div className="flex items-center gap-2">Update Package</div>
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
