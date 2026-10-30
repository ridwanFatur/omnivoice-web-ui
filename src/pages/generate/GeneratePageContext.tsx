import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import useGeneratePage from "./useGeneratePage";

type GeneratePageContextType = ReturnType<typeof useGeneratePage>;

const GeneratePageContext = createContext<GeneratePageContextType | null>(null);

export function GeneratePageProvider({ children }: { children: ReactNode }) {
  const value = useGeneratePage();

  return (
    <GeneratePageContext.Provider value={value}>
      {children}
    </GeneratePageContext.Provider>
  );
}

export function useGeneratePageContext() {
  const context = useContext(GeneratePageContext);

  if (!context) {
    throw new Error(
      "useGeneratePageContext must be used within GeneratePageProvider",
    );
  }

  return context;
}