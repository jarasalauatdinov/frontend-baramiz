import { z } from "zod";
import type { TranslateFn } from "@/shared/i18n/provider";

export function createLoginSchema(t: TranslateFn) {
  return z.object({
    email: z
      .string()
      .min(1, t("auth.validation.emailRequired"))
      .email(t("auth.validation.emailInvalid")),
    password: z
      .string()
      .min(1, t("auth.validation.passwordRequired"))
      .min(6, t("auth.validation.passwordMin")),
  });
}

export function createRegisterSchema(t: TranslateFn) {
  return createLoginSchema(t).extend({
    name: z
      .string()
      .min(1, t("auth.validation.nameRequired"))
      .min(2, t("auth.validation.nameMin")),
  });
}
