export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const getBedTypeLabel = (bedType?: string) => {
  switch (bedType) {
    case "KING":
      return "King Bed";
    case "QUEEN":
      return "Queen Bed";
    case "SINGLE":
      return "Single Bed";
    case "TWIN":
      return "Twin Bed";
    default:
      return "Standard Bed";
  }
};
