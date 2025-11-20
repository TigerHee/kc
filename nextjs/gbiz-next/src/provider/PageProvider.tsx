import React, { createContext, useContext, ReactNode } from "react";

interface PageContextType {
  [key: string]: any;
}

const PageContext = createContext<PageContextType | null>(null);

interface PageProviderProps {
  value: PageContextType;
  children: ReactNode;
}

export default function PageProvider({ value, children }: PageProviderProps) {
  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageProps(): PageContextType {
  const context = useContext(PageContext);
  if (context === null) {
    throw new Error("usePageProps must be used within a PageProvider");
  }
  return context;
}