import { useState, useEffect } from "react";
import { Trash2, Upload, Image, CheckCircle, AlertCircle } from "lucide-react";
import { useBooking } from "../../../context/BookingStepperContext";
import { useNavigate } from "react-router-dom";

export default function Step1VehicleSummary() {
  const { bookingState, setCurrentStep, setBookingField } = useBooking();

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ ktp?: string; license?: string }>({});
  const [dragOver, setDragOver] = useState<{ ktp: boolean; license: boolean }>({
    ktp: false,
    license: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setKtpFile(bookingState.card_id || null);
    setLicenseFile(bookingState.licences_id || null);
  }, [bookingState.card_id, bookingState.licences_id]);

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "ktp" | "license"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [type]: "Image must be under 5MB" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Please select a valid image file",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [type]: undefined }));
    if (type === "ktp") {
      setKtpFile(file);
      setBookingField("card_id", file);
    } else {
      setLicenseFile(file);
      setBookingField("licences_id", file);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "ktp" | "license"
  ) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const mockEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageSelect(mockEvent, type);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    type: "ktp" | "license"
  ) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLDivElement>,
    type: "ktp" | "license"
  ) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));
  };

  const removeImage = (type: "ktp" | "license") => {
    if (type === "ktp") {
      setKtpFile(null);
      setBookingField("card_id", undefined);
    } else {
      setLicenseFile(null);
      setBookingField("licences_id", undefined);
    }
    setErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  const renderUploader = (
    type: "ktp" | "license",
    file: File | null,
    label: string,
    description: string
  ) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Image className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {label}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {file && (
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">Uploaded</span>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group
          ${
            dragOver[type]
              ? "border-blue-400 bg-blue-50 scale-[1.02]"
              : file
              ? "border-green-300 bg-green-50"
              : errors[type]
              ? "border-red-300 bg-red-50"
              : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
          }
        `}
        onClick={() => document.getElementById(`upload-${type}`)?.click()}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={(e) => handleDragLeave(e, type)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e, type)}
          className="hidden"
          id={`upload-${type}`}
        />

        {file ? (
          <div className="space-y-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-700 mb-1">
                File uploaded successfully!
              </p>
              <p className="text-sm text-gray-600">
                Click to replace or drag a new file
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <Upload
                className={`h-16 w-16 mx-auto transition-all duration-300 group-hover:scale-110 ${
                  dragOver[type] ? "text-blue-500 scale-110" : "text-gray-400"
                }`}
              />
              {dragOver[type] && (
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                {dragOver[type]
                  ? "Drop your image here"
                  : "Upload your document"}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse from your device
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              <Upload className="h-4 w-4" />
              Choose File
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Maximum file size: 5MB • Supported formats: JPG, PNG, WebP
          </p>
        </div>
      </div>

      {/* File Preview */}
      {file && (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Image Preview */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`${type} preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(type);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-1000"></div>
                  </div>
                  <span className="text-sm text-green-600 font-semibold">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors[type] && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{errors[type]}</p>
        </div>
      )}
    </div>
  );

  const isComplete = ktpFile && licenseFile;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Upload Your Documents
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Please upload clear photos of your identification card and driving
          license to verify your identity and continue with your rental booking.
        </p>
      </div>

      {/* Upload Sections */}
      <div className="grid gap-8">
        {renderUploader(
          "ktp",
          ktpFile,
          "Identity Card (KTP)",
          "Upload a clear, high-quality photo of your Indonesian ID card. Make sure all text is readable and the card is fully visible."
        )}
        {renderUploader(
          "license",
          licenseFile,
          "Driving License",
          "Upload a clear photo of your valid driving license. Ensure the license is current and all information is clearly visible."
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="sm:w-auto px-8 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to Selection
        </button>

        <button
          onClick={() => setCurrentStep(1)}
          disabled={!isComplete}
          className={`flex-1 sm:flex-initial px-8 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isComplete
              ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
