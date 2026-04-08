import { clearLocalValue, readLocalValue, writeLocalValue } from "@/shared/lib/storage";

export const ONBOARDING_STORAGE_KEY = "baramiz_onboarded";

export function readOnboardingCompleted() {
  return readLocalValue<boolean>(ONBOARDING_STORAGE_KEY) === true;
}

export function writeOnboardingCompleted() {
  writeLocalValue(ONBOARDING_STORAGE_KEY, true);
}

export function clearOnboardingCompleted() {
  clearLocalValue(ONBOARDING_STORAGE_KEY);
}
