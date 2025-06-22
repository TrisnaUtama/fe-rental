"use client";

import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Loader2,
  Percent,
  Tag,
  DollarSign,
  Code,
} from "lucide-react";
import { useCreatePromo } from "../hooks/usePromo";
import { useAuthContext } from "@/shared/context/authContex";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FormInput } from "@/shared/components/ui/form-field";
import { FormTextarea } from "@/shared/components/ui/form-text-area";
import { useNavigate } from "react-router-dom";

const PromoFormSchema = z.object({
  code: z
    .string({ required_error: "Kode promo tidak boleh kosong." })
    .min(3, "Kode promo minimal 3 karakter."),
  description: z.string().optional(),
  discount_value: z
    .number({ required_error: "Nilai diskon harus diisi." })
    .int()
    .positive("Diskon harus berupa angka positif.")
    .max(100, "Diskon tidak bisa lebih dari 100%."),
  start_date: z
    .string({ required_error: "Tanggal mulai harus diisi." })
    .min(1, "Tanggal mulai harus diisi."),
  end_date: z
    .string({ required_error: "Tanggal selesai harus diisi." })
    .min(1, "Tanggal selesai harus diisi."),
  min_booking_amount: z.string({
    required_error: "Minimal booking harus diisi.",
  }),
});

type FormState = z.infer<typeof PromoFormSchema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function CreatePromoForm() {
  const { accessToken } = useAuthContext();
  const { mutateAsync: createPromoAsync, isPending: isCreating } =
    useCreatePromo(accessToken || "");
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    code: "",
    description: "",
    discount_value: 0,
    start_date: "",
    end_date: "",
    min_booking_amount: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const result = PromoFormSchema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0] as keyof FormState] = issue.message;
      }
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const resetForm = () => {
    setForm({
      code: "",
      description: "",
      discount_value: 0,
      start_date: "",
      end_date: "",
      min_booking_amount: "",
    });
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Validasi Gagal", {
        description: "Silakan periksa kembali semua isian pada formulir.",
      });
      return;
    }

    try {
      const payload = {
        ...form,
        description: form.description || "",
      };
      await createPromoAsync(payload);
      toast.success("Promo Berhasil Dibuat", {
        description: `Promo dengan kode "${form.code}" telah berhasil ditambahkan.`,
      });
      resetForm();
      navigate("/staff/data-promo");
      navigate(0);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat membuat promo.";
      toast.error("Gagal Membuat Promo", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black text-white rounded-lg">
                <Percent className="h-6 w-6" />
              </div>
              Create New Promo
            </CardTitle>
            <CardDescription>
              Create new promo to make customer satisfaying.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" /> Detail Promo
            </h3>
          </CardHeader>
          <CardContent className="p-8 pt-0 grid md:grid-cols-2 gap-6">
            <FormInput
              name="code"
              label="Code"
              icon={Code}
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="HIGHSEASON"
              error={fieldErrors.code}
            />
            <FormInput
              name="discount_value"
              label="Discount Value"
              type="number"
              icon={DollarSign}
              value={form.discount_value}
              onChange={(e) =>
                handleChange("discount_value", Number(e.target.value))
              }
              placeholder="eg: Rp.100000"
              error={fieldErrors.discount_value}
            />

            <div className="md:col-span-2">
              <FormTextarea
                name="description"
                label="Discount Value"
                icon={DollarSign}
                value={form.description!}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="eg: diskon musim semi"
                error={fieldErrors.description}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Active Periode 
            </h3>
          </CardHeader>
          <CardContent className="p-8 pt-0 grid md:grid-cols-2 gap-6 items-start">
            <FormInput
              name="start_date"
              label="Start Date"
              type="date"
              icon={CalendarIcon}
              value={form.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              error={fieldErrors.start_date}
            />

            <FormInput
              name="end_date"
              label="End Date"
              type="date"
              icon={CalendarIcon}
              value={form.end_date}
              onChange={(e) => handleChange("end_date", e.target.value)}
              error={fieldErrors.end_date}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Financial Settings
            </h3>
          </CardHeader>
          <CardContent className="p-8 pt-0  gap-6">
            <FormInput
              name="min_booking_amount"
              label="Minimum Booking Amount"
              type="number"
              icon={DollarSign}
              value={form.min_booking_amount}
              onChange={(e) =>
                handleChange("min_booking_amount", e.target.value)
              }
              error={fieldErrors.min_booking_amount}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={resetForm}
            disabled={isCreating}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
