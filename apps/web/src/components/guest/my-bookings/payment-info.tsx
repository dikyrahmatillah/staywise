import { formatCurrency, formatPaymentMethod } from "@/lib/booking-formatters"
import type { PaymentMethod } from "@/types/booking"

interface PaymentInfoProps {
  totalAmount: number
  paymentMethod: PaymentMethod
}

export const PaymentInfo = ({ totalAmount, paymentMethod }: PaymentInfoProps) => {
  return (
    <div>
      <span className="font-medium text-base">{formatCurrency(totalAmount)}</span>
      <div className="text-xs text-muted-foreground">{formatPaymentMethod(paymentMethod)}</div>
    </div>
  )
}
