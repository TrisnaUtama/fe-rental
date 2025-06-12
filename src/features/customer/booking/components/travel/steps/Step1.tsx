import { useState, useEffect } from "react";
import { Trash2, Upload, Image, CheckCircle, AlertCircle, UserCheck, ArrowLeft } from "lucide-react";
import { useTravelPackBooking } from "../../../context/TravelPackBookingContext"; 
import { Button } from "@/shared/components/ui/button";

export function Step1_TravelPackDocuments() {
  const { bookingState, setCurrentStep, setBookingField } = useTravelPackBooking();

  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ card_id?: string; licences_id?: string }>({});
  const [dragOver, setDragOver] = useState<{ card_id: boolean; licences_id: boolean }>({
    card_id: false,
    licences_id: false,
  });

  useEffect(() => {
    setIdCardFile(bookingState.card_id || null);
    setLicenseFile(bookingState.licences_id || null);
  }, [bookingState.card_id, bookingState.licences_id]);

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "card_id" | "licences_id"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [type]: "Image must be under 5MB" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, [type]: "Please select a valid image file" }));
      return;
    }

    setErrors((prev) => ({ ...prev, [type]: undefined }));
    
    setBookingField(type, file);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: "card_id" | "licences_id") => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect({ target: { files } } as React.ChangeEvent<HTMLInputElement>, type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, type: "card_id" | "licences_id") => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: true });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, type: "card_id" | "licences_id") => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
  };

  const removeImage = (type: "card_id" | "licences_id") => {
    setBookingField(type, undefined);
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
    type: "card_id" | "licences_id",
    file: File | null,
    label: string,
    description: string
  ) => (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl"><Image className="h-6 w-6 text-blue-500" /></div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{label}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
        {file && <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm font-medium text-green-700">Uploaded</span></div>}
      </div>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${dragOver[type] ? "border-blue-400 bg-blue-50" : file ? "border-green-300 bg-green-50" : errors[type] ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-blue-300"}`}
        onClick={() => document.getElementById(`upload-${type}`)?.click()}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={(e) => handleDragLeave(e, type)}
      >
        <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, type)} className="hidden" id={`upload-${type}`} />
        {file ? (
          <div className="space-y-2">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <p className="text-lg font-semibold text-green-700">File Uploaded!</p>
            <p className="text-sm text-gray-600">Click to replace</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className={`h-10 w-10 mx-auto transition-all ${dragOver[type] ? "text-blue-500 scale-110" : "text-gray-400 group-hover:text-blue-500"}`} />
            <p className="font-semibold text-gray-700">{dragOver[type] ? "Drop your image here" : "Drag & drop or click to upload"}</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WebP (max 5MB)</p>
          </div>
        )}
      </div>
      {file && (
        <div className="mt-4 bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white flex-shrink-0"><img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" /></div>
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{file.name}</p><p className="text-xs text-gray-500">{formatFileSize(file.size)}</p></div>
            <Button variant="ghost" size="icon" onClick={() => removeImage(type)} className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
      {errors[type] && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium"><AlertCircle className="h-5 w-5" />{errors[type]}</div>
      )}
    </div>
  );

  const isComplete = idCardFile && licenseFile;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Upload Your Documents</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          To finalize your travel package booking, please provide clear photos of your identification card and driving license for verification.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {renderUploader(
          "card_id",
          idCardFile,
          "Identity Card (KTP)",
          "Upload a clear photo of your ID card. Ensure all text and your photo are clearly visible."
        )}
        {renderUploader(
          "licences_id",
          licenseFile,
          "Driving License (SIM)",
          "Upload a photo of your valid driving license. This is required for any included vehicle rentals."
        )}
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Details
        </Button>
        <Button
          size="lg"
          onClick={() => setCurrentStep(1)}
          disabled={!isComplete}
          className="gap-2"
        >
          Continue to Review <UserCheck className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
