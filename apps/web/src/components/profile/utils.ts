import type { PasswordInsights } from "./types";

export const validateFile = (file: File): string | null => {
  if (file.size > 1024 * 1024) {
    return "File size must be less than 1MB";
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, JPEG, PNG, and GIF files are allowed";
  }

  return null;
};

export const calculatePasswordInsights = (
  password: string = ""
): PasswordInsights => {
  const checklist = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One number",
      met: /[0-9]/.test(password),
    },
    {
      label: "One special character",
      met: /[^a-zA-Z0-9]/.test(password),
    },
    {
      label: "12+ characters for extra safety",
      met: password.length >= 12,
    },
  ];

  const satisfied = checklist.filter((item) => item.met).length;
  const percentRaw = Math.round((satisfied / checklist.length) * 100);
  const percent = password ? Math.max(10, Math.min(100, percentRaw)) : 0;

  if (!password) {
    return {
      checklist,
      percent,
      tone: "text-muted-foreground",
      indicator: "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500",
      label: "Secure your account with a strong password.",
    };
  }

  if (percent >= 90) {
    return {
      checklist,
      percent,
      tone: "text-emerald-500",
      indicator:
        "bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400",
      label: "Fantastic! This password is check-in ready.",
    };
  }

  if (percent >= 70) {
    return {
      checklist,
      percent,
      tone: "text-lime-500",
      indicator:
        "bg-gradient-to-r from-lime-500 via-emerald-400 to-emerald-600",
      label: "Great! A couple more tweaks will make it perfect.",
    };
  }

  if (percent >= 50) {
    return {
      checklist,
      percent,
      tone: "text-amber-500",
      indicator: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500",
      label: "Getting there—boost it with more variety.",
    };
  }

  return {
    checklist,
    percent,
    tone: "text-rose-500",
    indicator: "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500",
    label: "Too guessable. Mix upper, numbers, and symbols.",
  };
};

export const getInitials = (firstName: string, lastName?: string | null) => {
  return `${firstName.charAt(0)}${
    lastName ? lastName.charAt(0) : ""
  }`.toUpperCase();
};

export const getFullName = (firstName: string, lastName?: string | null) => {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || firstName;
};
