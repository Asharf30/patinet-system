"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { User, Mail, RotateCcw, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import { cn } from "@/lib/utils";
import {
  CountrySelector,
  DEFAULT_COUNTRIES,
  type CountryOption,
} from "@/components/forms/CustomFormField";
import { UserFormValidation } from "@/lib/Validtion";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

type PatientFormValues = z.infer<typeof UserFormValidation>;

interface PatientFormProps {
  className?: string;
}

const PatientForm = ({ className }: PatientFormProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    DEFAULT_COUNTRIES[0],
  );
  const router = useRouter();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }: PatientFormValues) {
    setIsLoading(true);

    try {
      const userData = {
        name,
        email,
        phone: selectedCountry.dialCode + phone,
      };
      const user = await createUser(userData);

      if (user) router.push(`/patient/${user.$id}`);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  const handleReset = () => {
    form.reset({
      name: "",
      email: "",
      phone: "",
    });
    setSelectedCountry(DEFAULT_COUNTRIES[0]);
  };

  return (
    <div className={cn("w-full", className)} dir="rtl">
      {/* قسم الترحيب والعنوان */}
      <section className="mb-6 sm:mb-8 space-y-2 text-right">
        <h1 className="text-24-bold sm:text-32-bold md:text-36-bold text-white flex items-center gap-4 sm:gap-6">
          <span>أهلاً بك</span>
          <HeartPulse className="size-7 sm:size-8 text-green-500 shrink-0" />
        </h1>
        <p className="text-dark-700 text-sm sm:text-base font-normal">
          احجز موعدك الأول.
        </p>
      </section>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 sm:space-y-6"
      >
        {/* حقل الاسم الكامل */}
        <div className="space-y-2 text-right">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-dark-700"
          >
            الاسم الكامل
          </label>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <div
                  className={`flex h-11 items-center rounded-md border bg-dark-400 px-3 transition-colors ${
                    fieldState.invalid
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-dark-500 focus-within:border-zinc-400"
                  }`}
                >
                  <User className="ml-3 size-5 text-dark-600 shrink-0" />
                  <input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="أحمد محمد"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm text-white placeholder:text-dark-600 outline-none text-right min-w-0"
                  />
                </div>
                {fieldState.error && (
                  <p className="mt-1.5 text-xs text-red-500 text-right">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* حقل البريد الإلكتروني */}
        <div className="space-y-2 text-right">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-dark-700"
          >
            البريد الإلكتروني
          </label>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <div
                  className={`flex h-11 items-center rounded-md border bg-dark-400 px-3 transition-colors ${
                    fieldState.invalid
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-dark-500 focus-within:border-zinc-400"
                  }`}
                >
                  <Mail className="ml-3 size-5 text-dark-600 shrink-0" />
                  <input
                    {...field}
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="ahmed.example@gmail.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-white placeholder:text-dark-600 outline-none text-left min-w-0"
                  />
                </div>
                {fieldState.error && (
                  <p className="mt-1.5 text-xs text-red-500 text-right">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* حقل رقم الهاتف مع محدد الدولة القابل للاختيار والتكرار */}
        <div className="space-y-2 text-right">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-dark-700"
          >
            رقم الهاتف
          </label>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <div
                  className={`flex h-11 items-center rounded-md border bg-dark-400 px-3 transition-colors ${
                    fieldState.invalid
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-dark-500 focus-within:border-zinc-400"
                  }`}
                >
                  {/* محدد الدولة مع صورة العلم ومفتاح الدولة المترابطين */}
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onSelectCountry={(country) => {
                      setSelectedCountry(country);
                      field.onChange("");
                    }}
                  />
                  <input
                    {...field}
                    id="phone"
                    type="tel"
                    dir="ltr"
                    placeholder={
                      selectedCountry.code === "EG" ? "10 1234 5678" : ""
                    }
                    autoComplete="tel"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith("+")) {
                        const matched = [...DEFAULT_COUNTRIES]
                          .sort((a, b) => b.dialCode.length - a.dialCode.length)
                          .find((c) => val.startsWith(c.dialCode));
                        if (matched) {
                          if (matched.code !== selectedCountry.code) {
                            setSelectedCountry(matched);
                          }
                          const localPart = val
                            .slice(matched.dialCode.length)
                            .trim();
                          field.onChange(localPart);
                          return;
                        }
                      }
                      field.onChange(val);
                    }}
                    className="w-full bg-transparent text-sm text-white placeholder:text-dark-600 outline-none text-left min-w-0"
                  />
                </div>
                {fieldState.error && (
                  <p className="mt-1.5 text-xs text-red-500 text-right">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* أزرار الإجراءات: زر البدء وزر إعادة التعيين */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <SubmitButton
            isLoading={isLoading}
            loadingText="جاري التحميل..."
            className="flex-1"
          >
            ابدأ الآن
          </SubmitButton>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            className="h-11 px-4 rounded-md border border-dark-500 bg-dark-400 text-dark-700 hover:text-white hover:border-zinc-500 hover:bg-dark-500/50 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-2 shrink-0"
            title="إعادة تعيين جميع الحقول"
          >
            <RotateCcw className="size-4 shrink-0" />
            <span>إعادة تعيين</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
