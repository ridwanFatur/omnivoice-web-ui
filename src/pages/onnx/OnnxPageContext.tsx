import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import useOnnxPage from "./useOnnxPage";

type OnnxPageContextType = ReturnType<typeof useOnnxPage>;

const OnnxPageContext = createContext<OnnxPageContextType | null>(null);

export function OnnxPageProvider({ children }: { children: ReactNode }) {
  const value = useOnnxPage();

  return (
    <OnnxPageContext.Provider value={value}>
      {children}
    </OnnxPageContext.Provider>
  );
}

export function useOnnxPageContext() {
  const context = useContext(OnnxPageContext);

  if (!context) {
    throw new Error(
      "useOnnxPageContext must be used within OnnxPageProvider",
    );
  }

  return context;
}