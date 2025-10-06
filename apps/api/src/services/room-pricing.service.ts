import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import { CreatePriceAdjustmentInput } from "../schemas/index.js";

export class RoomPricingService {
  async createPriceAdjustment(
    roomId: string,
    data: CreatePriceAdjustmentInput
  ) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const priceAdjustment = await prisma.priceAdjustment.create({
      data: {
        roomId,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        adjustType: data.adjustType,
        adjustValue: data.adjustValue,
        applyAllDates: data.applyAllDates,
        Dates:
          data.dates && !data.applyAllDates
            ? {
                create: data.dates.map((date) => ({
                  date: new Date(date),
                })),
              }
            : undefined,
      },
      include: {
        Dates: true,
      },
    });

    return this.formatPriceAdjustment(priceAdjustment);
  }

  async getPriceAdjustments(roomId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const priceAdjustments = await prisma.priceAdjustment.findMany({
      where: { roomId },
      include: {
        Dates: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return priceAdjustments.map((adjustment) =>
      this.formatPriceAdjustment(adjustment)
    );
  }

  async updatePriceAdjustment(
    adjustmentId: string,
    data: Partial<CreatePriceAdjustmentInput>
  ) {
    const existingAdjustment = await prisma.priceAdjustment.findUnique({
      where: { id: adjustmentId },
    });

    if (!existingAdjustment) {
      throw new AppError("Price adjustment not found", 404);
    }

    // If updating dates, first delete existing ones
    if (data.dates !== undefined) {
      await prisma.priceAdjustmentDate.deleteMany({
        where: { priceAdjustmentId: adjustmentId },
      });
    }

    const updatedAdjustment = await prisma.priceAdjustment.update({
      where: { id: adjustmentId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.adjustType && { adjustType: data.adjustType }),
        ...(data.adjustValue !== undefined && {
          adjustValue: data.adjustValue,
        }),
        ...(data.applyAllDates !== undefined && {
          applyAllDates: data.applyAllDates,
        }),
        ...(data.dates &&
          !data.applyAllDates && {
            Dates: {
              create: data.dates.map((date) => ({
                date: new Date(date),
              })),
            },
          }),
      },
      include: {
        Dates: true,
      },
    });

    return this.formatPriceAdjustment(updatedAdjustment);
  }

  async deletePriceAdjustment(adjustmentId: string) {
    const existingAdjustment = await prisma.priceAdjustment.findUnique({
      where: { id: adjustmentId },
    });

    if (!existingAdjustment) {
      throw new AppError("Price adjustment not found", 404);
    }

    await prisma.priceAdjustment.delete({
      where: { id: adjustmentId },
    });

    return { message: "Price adjustment deleted successfully" };
  }

  private formatPriceAdjustment(adjustment: any) {
    return {
      ...adjustment,
      startDate: adjustment.startDate.toISOString().split("T")[0],
      endDate: adjustment.endDate.toISOString().split("T")[0],
      createdAt: adjustment.createdAt.toISOString(),
      Dates:
        adjustment.Dates?.map((d: any) => ({
          ...d,
          date: d.date.toISOString().split("T")[0],
        })) || [],
    };
  }
}

export const roomPricingService = new RoomPricingService();
