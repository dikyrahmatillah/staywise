// apps/web/src/app/booking/lib/midtrans-loader.ts

export function loadMidtransScript(): void {
  // Check if script already exists
  if (document.getElementById("midtrans-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "midtrans-script";
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute(
    "data-client-key",
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
  );

  document.head.appendChild(script);

  script.onload = () => {
    console.log("Midtrans Snap script loaded successfully");
  };

  script.onerror = () => {
    console.error("Failed to load Midtrans Snap script");
  };
}

export function removeMidtransScript(): void {
  const script = document.getElementById("midtrans-script");
  if (script) {
    document.head.removeChild(script);
  }
}