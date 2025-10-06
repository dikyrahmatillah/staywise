"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  const { resolvedTheme = "light" } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "toast bg-background text-foreground border-border shadow-lg rounded-lg p-4",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          success: "border-l-4 border-l-green-500 text-green-600",
          error: "border-l-4 border-l-red-500 text-red-600",
          warning: "border-l-4 border-l-orange-500 text-orange-600",
          info: "border-l-4 border-l-blue-500 text-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
