import type { PriceAdjustmentModalProps } from "./price-adjustment-modal/types";
import { PriceAdjustmentModal as InnerPriceAdjustmentModal } from "./price-adjustment-modal/index";

export { PriceAdjustmentModal } from "./price-adjustment-modal/index";
export default function PriceAdjustmentModal(props: PriceAdjustmentModalProps) {
  return <InnerPriceAdjustmentModal {...props} />;
}
