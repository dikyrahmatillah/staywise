"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  const position = props.position ?? ("top-right" as ToasterProps["position"]);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-green-500 group-[.toast]:text-green-600",
          error:
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-red-500 group-[.toast]:text-red-600",
          warning:
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-orange-500 group-[.toast]:text-orange-600",
          info: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-blue-500 group-[.toast]:text-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
