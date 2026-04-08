interface ResolveStartupDestinationParams {
  hasLanguage: boolean;
  isOnboarded: boolean;
  pathname: string;
}

export function resolveStartupDestination({
  hasLanguage,
  isOnboarded,
  pathname,
}: ResolveStartupDestinationParams) {
  if (!hasLanguage) {
    return pathname === "/select-language" ? null : "/select-language";
  }

  if (!isOnboarded) {
    return pathname === "/onboarding" ? null : "/onboarding";
  }

  if (pathname === "/select-language" || pathname === "/onboarding") {
    return "/";
  }

  return null;
}
