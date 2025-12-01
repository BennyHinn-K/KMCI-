"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

// Create a client
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: 1,
        onError: (error: any) => {
          console.error("Mutation error:", error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
        buttonPosition="bottom-right"
      /> */}
    </QueryClientProvider>
  );
}

// Export the query client for use in other parts of the app
export { getQueryClient };

// Custom hook to access query client
export function useQueryClient() {
  const client = getQueryClient();
  return client;
}

// Performance monitoring hook
export function useQueryPerformance() {
  const queryClient = getQueryClient();

  return {
    clearCache: () => {
      queryClient.clear();
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
    getQueryCache: () => {
      return queryClient.getQueryCache();
    },
    getCacheStats: () => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();

      return {
        totalQueries: queries.length,
        staleQueries: queries.filter((q) => q.isStale()).length,
        invalidQueries: queries.filter((q) => q.state.isInvalidated).length,
        fetchingQueries: queries.filter(
          (q) => q.state.fetchStatus === "fetching",
        ).length,
      };
    },
  };
}
