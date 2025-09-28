export class PriceCalculationService {
  static calculateEffectivePrice(room: any, date: Date | string) {
    let effectivePrice = Number(room.basePrice ?? 0);

    const adjustmentDate = new Date(date);

    const applicableAdjustments = (room.PriceAdjustments || []).filter(
      (adjustment: any) => {
        const startDate = new Date(adjustment.startDate);
        const endDate = new Date(adjustment.endDate);
        const isWithinPeriod =
          adjustmentDate >= startDate && adjustmentDate <= endDate;
        if (!isWithinPeriod) return false;
        if (adjustment.applyAllDates) return true;
        if (adjustment.Dates && adjustment.Dates.length > 0) {
          return adjustment.Dates.some((d: any) =>
            this.isSameDate(new Date(d.date), adjustmentDate)
          );
        }
        return false;
      }
    );

    for (const adjustment of applicableAdjustments) {
      if (adjustment.adjustType === "PERCENTAGE") {
        effectivePrice =
          effectivePrice * (1 + Number(adjustment.adjustValue) / 100);
      } else if (adjustment.adjustType === "NOMINAL") {
        effectivePrice = effectivePrice + Number(adjustment.adjustValue);
      }
    }

    return Math.max(0, effectivePrice);
  }

  static calculateMinEffectivePrice(
    room: any,
    startDate?: Date,
    endDate?: Date
  ) {
    if (!startDate || !endDate) {
      return this.calculateEffectivePrice(room, new Date());
    }

    const prices: number[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      prices.push(this.calculateEffectivePrice(room, current));
      current.setDate(current.getDate() + 1);
    }

    return prices.length > 0
      ? Math.min(...prices)
      : this.calculateEffectivePrice(room, new Date());
  }

  static calculatePropertyMinPrice(
    rooms: any[] | undefined,
    startDate?: Date,
    endDate?: Date
  ) {
    if (!rooms || rooms.length === 0) return 0;
    const mins = rooms.map((r) =>
      this.calculateMinEffectivePrice(r, startDate, endDate)
    );
    return mins.length > 0 ? Math.min(...mins) : 0;
  }

  static isSameDate(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  static isRoomAvailable(room: any, checkIn: Date, checkOut: Date, guests = 1) {
    if (!room) return false;
    if (typeof room.capacity === "number" && room.capacity < guests)
      return false;

    if (room.RoomAvailabilities && room.RoomAvailabilities.length > 0) {
      const current = new Date(checkIn);
      while (current < checkOut) {
        const avail = room.RoomAvailabilities.find((a: any) =>
          this.isSameDate(new Date(a.date), current)
        );
        if (avail && avail.isAvailable === false) return false;
        current.setDate(current.getDate() + 1);
      }
    }

    return true;
  }
}

export default PriceCalculationService;
