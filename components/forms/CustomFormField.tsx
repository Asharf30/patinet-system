"use client";

import React, { useState, useRef } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import {
  CalendarIcon,
  ChevronDown,
  ChevronsUpDown,
  Check,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// ==========================================
// 1. FIELD TYPE ENUM
// ==========================================
export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phone_input",
  DATE_PICKER = "date_picker",
  RADIO = "radio",
  SELECT = "select",
  TEXTAREA = "textarea",
  FILE_UPLOAD = "file_upload",
  COMBOBOX = "combobox",
  SKELETON = "skeleton",
}

// ==========================================
// 2. REUSABLE COUNTRY DATA & SELECTOR
// ==========================================
export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: "EG", name: "مصر (Egypt)", flag: "🇪🇬", dialCode: "+20" },
  { code: "SA", name: "السعودية (Saudi Arabia)", flag: "🇸🇦", dialCode: "+966" },
  { code: "AE", name: "الإمارات (UAE)", flag: "🇦🇪", dialCode: "+971" },
  { code: "KW", name: "الكويت (Kuwait)", flag: "🇰🇼", dialCode: "+965" },
  { code: "QA", name: "قطر (Qatar)", flag: "🇶🇦", dialCode: "+974" },
  { code: "BH", name: "البحرين (Bahrain)", flag: "🇧🇭", dialCode: "+973" },
  { code: "OM", name: "عُمان (Oman)", flag: "🇴🇲", dialCode: "+968" },
  { code: "JO", name: "الأردن (Jordan)", flag: "🇯🇴", dialCode: "+962" },
  { code: "LB", name: "لبنان (Lebanon)", flag: "🇱🇧", dialCode: "+961" },
  { code: "IQ", name: "العراق (Iraq)", flag: "🇮🇶", dialCode: "+964" },
  { code: "PS", name: "فلسطين (Palestine)", flag: "🇵🇸", dialCode: "+970" },
  { code: "SY", name: "سوريا (Syria)", flag: "🇸🇾", dialCode: "+963" },
  { code: "YE", name: "اليمن (Yemen)", flag: "🇾🇪", dialCode: "+967" },
  { code: "SD", name: "السودان (Sudan)", flag: "🇸🇩", dialCode: "+249" },
  { code: "LY", name: "ليبيا (Libya)", flag: "🇱🇾", dialCode: "+218" },
  { code: "TN", name: "تونس (Tunisia)", flag: "🇹🇳", dialCode: "+216" },
  { code: "DZ", name: "الجزائر (Algeria)", flag: "🇩🇿", dialCode: "+213" },
  { code: "MA", name: "المغرب (Morocco)", flag: "🇲🇦", dialCode: "+212" },
  { code: "US", name: "الولايات المتحدة (USA)", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "المملكة المتحدة (UK)", flag: "🇬🇧", dialCode: "+44" },
  { code: "CA", name: "كندا (Canada)", flag: "🇨🇦", dialCode: "+1" },
  { code: "FR", name: "فرنسا (France)", flag: "🇫🇷", dialCode: "+33" },
  { code: "DE", name: "ألمانيا (Germany)", flag: "🇩🇪", dialCode: "+49" },
  { code: "TR", name: "تركيا (Turkey)", flag: "🇹🇷", dialCode: "+90" },
];

export interface CountrySelectorProps {
  selectedCountry: CountryOption;
  onSelectCountry: (country: CountryOption) => void;
  countries?: CountryOption[];
  disabled?: boolean;
  className?: string;
}

export function CountrySelector({
  selectedCountry,
  onSelectCountry,
  countries = DEFAULT_COUNTRIES,
  disabled = false,
  className,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        type="button"
        className={cn(
          "ml-3 flex items-center gap-1.5 select-none shrink-0 border-l border-dark-500/60 pl-2.5 cursor-pointer outline-none hover:opacity-80 transition-opacity",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        dir="ltr"
        title="اختر الدولة"
      >
        <span className="text-base leading-none">{selectedCountry.flag}</span>
        <ChevronDown
          className={cn(
            "size-3 text-dark-600 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
        <span className="text-sm font-medium text-white ml-0.5">
          {selectedCountry.dialCode}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 bg-dark-400 border-dark-500 text-white shadow-2xl z-50 rounded-lg overflow-hidden"
        align="start"
      >
        <Command className="bg-dark-400 text-white">
          <CommandInput
            placeholder="ابحث عن دولة أو رمز (+)..."
            className="text-sm text-white placeholder:text-dark-600"
          />
          <CommandList className="max-h-56 overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-dark-600">
              لم يتم العثور على دولة
            </CommandEmpty>
            <CommandGroup>
              {countries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <CommandItem
                    key={c.code}
                    value={`${c.name} ${c.dialCode} ${c.code}`}
                    onSelect={() => {
                      onSelectCountry(c);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-dark-500 text-white aria-selected:bg-dark-500"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-xs text-dark-600 font-mono"
                        dir="ltr"
                      >
                        {c.dialCode}
                      </span>
                      {isSelected && (
                        <Check className="size-3.5 text-green-500" />
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ==========================================
// 3. FILE UPLOAD DROPZONE COMPONENT
// ==========================================
interface FileUploadDropzoneProps {
  value?: File | File[] | string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
}

function FileUploadDropzone({
  value,
  onChange,
  accept,
  disabled = false,
}: FileUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const file = value instanceof File ? value : null;
  const isImage = file?.type.startsWith("image/");
  const previewUrl = file && isImage ? URL.createObjectURL(file) : null;

  const handleFileSelect = (selectedFile: File | undefined | null) => {
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          handleFileSelect(f);
        }}
      />

      {file ? (
        <div className="flex items-center justify-between rounded-md border border-dark-500 bg-dark-400 p-3">
          <div className="flex items-center gap-3 truncate">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={file.name}
                width={40}
                height={40}
                unoptimized
                className="size-10 rounded object-cover border border-dark-500 shrink-0"
              />
            ) : (
              <FileText className="size-8 text-green-500 shrink-0" />
            )}
            <div className="truncate text-right">
              <p className="text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-dark-600">
                {(file.size / 1024 / 1024).toFixed(2)} ميجابايت
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="p-1 rounded-full text-dark-600 hover:text-white hover:bg-dark-500 transition-colors"
            title="إزالة الملف"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (!disabled) {
              const droppedFile = e.dataTransfer.files?.[0];
              handleFileSelect(droppedFile);
            }
          }}
          className={cn(
            "file-upload cursor-pointer transition-colors border border-dashed border-dark-500 bg-dark-400 p-6 rounded-md hover:border-zinc-400",
            isDragging && "border-green-500 bg-dark-500/30",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="file-upload_label flex flex-col items-center justify-center gap-2 text-center text-dark-600">
            <Upload className="size-8 text-green-500 mb-1" />
            <p className="text-sm">
              <span className="text-green-500 font-medium">اضغط للرفع</span> أو اسحب
              وأفلت
            </p>
            <p className="text-xs text-dark-600">
              {accept
                ? accept.split(",").join(" · ")
                : "SVG, PNG, JPG أو GIF (الحد الأقصى 10MB)"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. COMBOBOX DROPDOWN COMPONENT
// ==========================================
interface ComboboxFieldProps {
  value?: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string; avatarUrl?: string }[];
  placeholder?: string;
  disabled?: boolean;
}

function ComboboxField({
  value,
  onChange,
  options = [],
  placeholder = "ابحث...",
  disabled = false,
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        type="button"
        className={cn(
          "shad-combobox-trigger flex h-11 w-full items-center justify-between rounded-md border border-dark-500 bg-dark-400 px-3 text-sm text-white transition-colors hover:border-zinc-400 outline-none",
          !value && "text-dark-600",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.avatarUrl && (
            <Image
              src={selectedOption.avatarUrl}
              alt={selectedOption.label}
              width={24}
              height={24}
              unoptimized
              className="size-6 rounded-full object-cover shrink-0"
            />
          )}
          <span className={cn(selectedOption ? "text-white" : "text-dark-600")}>
            {selectedOption?.label ?? placeholder}
          </span>
        </div>
        <ChevronsUpDown className="size-4 text-dark-600 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-64 p-0 bg-dark-400 border-dark-500 text-white shadow-xl z-50 rounded-lg overflow-hidden"
        align="start"
      >
        <Command className="bg-dark-400 text-white">
          <CommandInput
            placeholder={placeholder}
            className="text-sm text-white placeholder:text-dark-600"
          />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-dark-600">
              لم يتم العثور على نتائج
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-dark-500 text-white aria-selected:bg-dark-500"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.avatarUrl && (
                        <Image
                          src={option.avatarUrl}
                          alt={option.label}
                          width={24}
                          height={24}
                          unoptimized
                          className="size-6 rounded-full object-cover shrink-0"
                        />
                      )}
                      <span>{option.label}</span>
                    </div>
                    <Check
                      className={cn(
                        "size-4 text-green-500 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ==========================================
// 5. DATE PICKER FIELD COMPONENT
// ==========================================
interface DatePickerFieldProps {
  value?: Date | string | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

function DatePickerField({
  value,
  onChange,
  placeholder = "اختر تاريخاً",
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  const parsedDate = value
    ? typeof value === "string"
      ? new Date(value)
      : value
    : undefined;

  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        type="button"
        className={cn(
          "flex h-11 w-full items-center gap-3 rounded-md border border-dark-500 bg-dark-400 px-3 text-sm text-white transition-colors hover:border-zinc-400 outline-none",
          !isValidDate && "text-dark-600",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <CalendarIcon className="size-5 text-dark-600 shrink-0" />
        <span>
          {isValidDate ? format(parsedDate, "PPP") : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-dark-400 border-dark-500 shadow-2xl z-50 rounded-lg overflow-hidden"
        align="start"
      >
        <Calendar
          mode="single"
          selected={isValidDate ? parsedDate : undefined}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
}

// ==========================================
// 6. CUSTOM FORM FIELD PROPS & MAIN COMPONENT
// ==========================================
export interface CustomFormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  fieldType: FormFieldType;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  options?: { label: string; value: string; avatarUrl?: string }[];
  accept?: string;
  children?: React.ReactNode;
  // Reusable country code selector options for PHONE_INPUT:
  countries?: CountryOption[];
  defaultCountry?: string;
  onCountryChange?: (country: CountryOption) => void;
  className?: string;
}

export default function CustomFormField<T extends FieldValues>({
  control,
  fieldType,
  name,
  label,
  placeholder,
  icon: Icon,
  disabled = false,
  options,
  accept,
  children,
  countries = DEFAULT_COUNTRIES,
  defaultCountry = "EG",
  onCountryChange,
  className,
}: CustomFormFieldProps<T>) {
  // Reusable country state for PHONE_INPUT
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(() => {
    const found = countries.find(
      (c) => c.code.toLowerCase() === defaultCountry.toLowerCase()
    );
    return found || countries[0] || DEFAULT_COUNTRIES[0];
  });

  const handleCountryChange = (country: CountryOption) => {
    setSelectedCountry(country);
    onCountryChange?.(country);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isEmail = name.toLowerCase().includes("email");
        const isPhone = fieldType === FormFieldType.PHONE_INPUT;
        const isLtr = isEmail || isPhone;

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={cn("space-y-2 text-right", className)}
          >
            {label && (
              <FieldLabel
                htmlFor={name}
                className="block text-sm font-medium text-dark-700"
              >
                {label}
              </FieldLabel>
            )}

            {/* Render control according to fieldType */}
            {(() => {
              switch (fieldType) {
                // ----------------------------------------
                // 1) INPUT
                // ----------------------------------------
                case FormFieldType.INPUT:
                  return (
                    <InputGroup
                      className={cn(
                        "flex h-11 w-full items-center rounded-md border bg-dark-400 px-3 transition-colors",
                        fieldState.invalid
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-dark-500 focus-within:border-zinc-400"
                      )}
                    >
                      {Icon && (
                        <Icon className="ml-3 size-5 text-dark-600 shrink-0" />
                      )}
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        type={isEmail ? "email" : "text"}
                        dir={isLtr ? "ltr" : "rtl"}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={name}
                        className={cn(
                          "h-full w-full border-0 bg-transparent px-0 py-0 text-sm text-white placeholder:text-dark-600 focus-visible:ring-0 focus-visible:border-0 shadow-none outline-none",
                          isLtr ? "text-left" : "text-right"
                        )}
                      />
                    </InputGroup>
                  );

                // ----------------------------------------
                // 2) PHONE_INPUT (With Reusable Country Selector)
                // ----------------------------------------
                case FormFieldType.PHONE_INPUT:
                  return (
                    <InputGroup
                      className={cn(
                        "flex h-11 w-full items-center rounded-md border bg-dark-400 px-3 transition-colors",
                        fieldState.invalid
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-dark-500 focus-within:border-zinc-400"
                      )}
                    >
                      {/* Reusable Country Selector with Flag + Dial Code */}
                      <CountrySelector
                        selectedCountry={selectedCountry}
                        onSelectCountry={handleCountryChange}
                        countries={countries}
                        disabled={disabled}
                      />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        type="tel"
                        dir="ltr"
                        placeholder={placeholder ?? "10 1234 5678"}
                        disabled={disabled}
                        autoComplete="tel"
                        className="h-full w-full border-0 bg-transparent px-0 py-0 text-sm text-white placeholder:text-dark-600 focus-visible:ring-0 focus-visible:border-0 shadow-none outline-none text-left"
                      />
                    </InputGroup>
                  );

                // ----------------------------------------
                // 3) TEXTAREA
                // ----------------------------------------
                case FormFieldType.TEXTAREA:
                  return (
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      id={name}
                      placeholder={placeholder}
                      disabled={disabled}
                      className={cn(
                        "shad-textArea min-h-24 w-full rounded-md border bg-dark-400 px-3 py-2 text-sm text-white placeholder:text-dark-600 transition-colors focus-visible:ring-0",
                        fieldState.invalid
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-dark-500 focus-visible:border-zinc-400"
                      )}
                    />
                  );

                // ----------------------------------------
                // 4) DATE_PICKER
                // ----------------------------------------
                case FormFieldType.DATE_PICKER:
                  return (
                    <DatePickerField
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={placeholder}
                      disabled={disabled}
                    />
                  );

                // ----------------------------------------
                // 5) RADIO
                // ----------------------------------------
                case FormFieldType.RADIO:
                  return (
                    <RadioGroup
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={disabled}
                      className="flex flex-wrap items-center gap-3"
                    >
                      {options?.map((option) => {
                        const optionId = `${name}-${option.value}`;
                        const isChecked = field.value === option.value;
                        return (
                          <div
                            key={option.value}
                            className={cn(
                              "radio-group cursor-pointer transition-colors hover:border-zinc-400",
                              isChecked && "border-green-500 bg-dark-500/40"
                            )}
                            onClick={() => field.onChange(option.value)}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={optionId}
                            />
                            <label
                              htmlFor={optionId}
                              className="cursor-pointer text-sm font-medium text-white select-none mr-2"
                            >
                              {option.label}
                            </label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  );

                // ----------------------------------------
                // 6) SELECT
                // ----------------------------------------
                case FormFieldType.SELECT:
                  return (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) => field.onChange(val)}
                      disabled={disabled}
                    >
                      <SelectTrigger
                        className={cn(
                          "shad-select-trigger flex h-11 w-full items-center justify-between rounded-md border bg-dark-400 px-3 text-sm text-white transition-colors",
                          fieldState.invalid
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-dark-500 hover:border-zinc-400"
                        )}
                      >
                        <SelectValue placeholder={placeholder ?? "اختر..."} />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content bg-dark-400 border-dark-500 text-white z-50">
                        {children ??
                          options?.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="cursor-pointer text-white hover:bg-dark-500 focus:bg-dark-500"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  );

                // ----------------------------------------
                // 7) FILE_UPLOAD
                // ----------------------------------------
                case FormFieldType.FILE_UPLOAD:
                  return (
                    <FileUploadDropzone
                      value={field.value}
                      onChange={field.onChange}
                      accept={accept}
                      disabled={disabled}
                    />
                  );

                // ----------------------------------------
                // 8) COMBOBOX
                // ----------------------------------------
                case FormFieldType.COMBOBOX:
                  return (
                    <ComboboxField
                      value={field.value}
                      onChange={field.onChange}
                      options={options}
                      placeholder={placeholder}
                      disabled={disabled}
                    />
                  );

                // ----------------------------------------
                // 9) SKELETON
                // ----------------------------------------
                case FormFieldType.SKELETON:
                  return <>{children}</>;

                default:
                  return null;
              }
            })()}

            {/* Error Message */}
            {fieldState.error && (
              <FieldError className="mt-1.5 text-xs text-red-500 text-right">
                {fieldState.error.message}
              </FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}