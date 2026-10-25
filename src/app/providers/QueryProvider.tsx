import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { appConfig } from "@/app/config/app.config";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: appConfig.queryDefaults.staleTime,
            gcTime: appConfig.queryDefaults.gcTime,
            retry: appConfig.queryDefaults.retry,
            refetchOnWindowFocus: appConfig.queryDefaults.refetchOnWindowFocus,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
