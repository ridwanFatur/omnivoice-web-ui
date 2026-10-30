import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import useCachePage from "./useCachePage";

type CachePageContextType = ReturnType<typeof useCachePage>;

const CachePageContext = createContext<CachePageContextType | null>(null);

export function CachePageProvider({ children }: { children: ReactNode }) {
  const value = useCachePage();

  return (
    <CachePageContext.Provider value={value}>
      {children}
    </CachePageContext.Provider>
  );
}

export function useCachePageContext() {
  const context = useContext(CachePageContext);

  if (!context) {
    throw new Error(
      "useCachePageContext must be used within CachePageProvider",
    );
  }

  return context;
}