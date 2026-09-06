import * as z from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "يجب أن يتكون الاسم من حرفين على الأقل.")
    .max(50, "يجب ألا يتجاوز الاسم 50 حرفاً."),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح."),
  phone: z
    .string()
    .refine(
      (phone) => /\d+$/.test(phone),
      "يجب أن يبدأ رقم الهاتف بعلامة + ويحتوي على أرقام فقط.",
    )
    .refine(
      (phone) => phone.length >= 11,
      "رقم الهاتف قصير جدًا؛ يجب أن يحتوي على 10 أرقام على الأقل بعد علامة +.",
    )
    .refine(
      (phone) => phone.length <= 16,
      "رقم الهاتف طويل جدًا؛ يجب ألا يحتوي على أكثر من 15 رقمًا بعد علامة +.",
    ),
});
