import { type ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ShellProvider } from "./ShellContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { Toaster } from "sonner";
import { QuotaUpgradeHandler } from "@/components/feedback";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ShellProvider>
          {children}
          <QuotaUpgradeHandler />
          <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
          toastOptions={{
            style: {
              borderRadius: "0.75rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
            },
          }}
        />
      </ShellProvider>
    </AuthProvider>
  </QueryProvider>
);
}
