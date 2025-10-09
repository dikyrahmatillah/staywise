import Image from "next/image";

interface PaymentProofViewerProps {
  imageUrl: string;
  subtitle?: string;
}

export function PaymentProofViewer({
  imageUrl,
  subtitle = "Payment proof submitted",
}: PaymentProofViewerProps) {
  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
        <Image
          src={imageUrl}
          alt="Payment Proof"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground text-center font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}