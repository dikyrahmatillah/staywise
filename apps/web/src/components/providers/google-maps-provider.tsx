"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useLoadScript } from "@react-google-maps/api";

interface GoogleMapsContextValue {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue | undefined>(
  undefined
);

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey: string;
}

export function GoogleMapsProvider({
  children,
  apiKey,
}: GoogleMapsProviderProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
}
