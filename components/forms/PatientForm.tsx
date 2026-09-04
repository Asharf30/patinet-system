"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  User,
  Mail,
  ChevronDown,
  Loader2,
  RotateCcw,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "يجب أن يتكون الاسم من حرفين على الأقل.")
    .max(50, "يجب ألا يتجاوز الاسم 50 حرفاً."),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح."),
  phone: z
    .string()
    .min(10, "يرجى إدخال رقم هاتف صحيح يتكون من 10 أرقام على الأقل.")
    .max(15, "رقم الهاتف طويل جداً."),
});

type PatientFormValues = z.infer<typeof formSchema>;

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(data: PatientFormValues) {
    setIsLoading(true);
    try {
      console.log("البيانات المرسلة:", data);
      // محاكاة الإرسال
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    form.reset({
      name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="w-full" dir="rtl">
      {/* قسم الترحيب والعنوان */}
      <section className="mb-8 space-y-2 text-right">
        <h1 className="text-32-bold md:text-36-bold text-white flex items-center gap-6">
          <span>أهلاً بك</span>
          <HeartPulse className="size-8 text-green-500 shrink-0" />
        </h1>
        <p className="text-dark-700 text-sm md:text-base font-normal">
          احجز موعدك الأول.
        </p>
      </section>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="w-full bg-transparent text-sm text-white placeholder:text-dark-600 outline-none text-right"
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
                    className="w-full bg-transparent text-sm text-white placeholder:text-dark-600 outline-none text-left"
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

        {/* حقل رقم الهاتف بمفتاح مصر (+20) */}
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
                  {/* شارة الدولة الافتراضية: مصر (+20) */}
                  <div
                    className="ml-3 flex items-center gap-1.5 select-none shrink-0 border-l border-dark-500/60 pl-2.5"
                    dir="ltr"
                  >
                    <span className="text-base leading-none">🇪🇬</span>
                    <ChevronDown className="size-3 text-dark-600" />
                    <span className="text-sm font-medium text-white ml-0.5">
                      +20
                    </span>
                  </div>
                  <input
                    {...field}
                    id="phone"
                    type="tel"
                    dir="ltr"
                    placeholder="10 1234 5678"
                    autoComplete="tel"
                    className="w-full bg-transparent text-sm text-white placeholder:text-dark-600 outline-none text-left"
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
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-11 rounded-md bg-green-500 hover:bg-green-400 text-white font-medium text-base cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lime-500 active:translate-y-0 active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>جاري التحميل...</span>
              </div>
            ) : (
              "ابدأ الآن"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 px-4 rounded-md border border-dark-500 bg-dark-400 text-dark-700 hover:text-white hover:border-zinc-500 hover:bg-dark-500/50 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.99] flex items-center gap-2"
            title="إعادة تعيين جميع الحقول"
          >
            <RotateCcw className="size-4" />
            <span>إعادة تعيين</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
