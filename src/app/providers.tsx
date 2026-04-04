import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/features/auth/auth-provider";
import { mantineTheme } from "@/shared/config/mantine-theme";
import { I18nProvider } from "@/shared/i18n/provider";
import { queryClient } from "@/shared/lib/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
        </QueryClientProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
