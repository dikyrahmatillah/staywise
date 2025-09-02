import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { prisma } from "./client.js";
import { BedType } from "../generated/prisma/index.js";
import { randomUUID } from "crypto";

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

// Minimal slugify helper to avoid the external dependency in seed files.
const slugifyLocal = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 150);

const AVAILABILITY_DAYS = 14;

async function clear() {
  await prisma.paymentProof.deleteMany();
  await prisma.gatewayPayment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.priceAdjustmentDate.deleteMany();
  await prisma.priceAdjustment.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.room.deleteMany();
  await prisma.propertyFacility.deleteMany();
  await prisma.property.deleteMany();
  await prisma.propertyCategory.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.user.deleteMany();
}

type Tenant = { id: string };
type Guest = { id: string };
type PropertyRec = {
  id: string;
  tenantId: string;
};
type RoomRec = {
  id: string;
  propertyId: string;
  tenantId: string;
  basePrice: number;
};
type AdjustmentRec = {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  adjustType: "PERCENTAGE" | "NOMINAL";
  adjustValue: number;
  applyAllDates: boolean;
  dates?: string[];
};

function calcAdjustedPrice(
  base: number,
  date: Date,
  adjustments: AdjustmentRec[]
): number {
  for (const adj of adjustments) {
    if (date >= adj.startDate && date <= adj.endDate) {
      if (!adj.applyAllDates) {
        const onList = adj.dates?.includes(toISODate(date));
        if (!onList) continue;
      }
      if (adj.adjustType === "PERCENTAGE") {
        return Math.max(1, Math.round(base * (1 + adj.adjustValue / 100)));
      } else {
        return Math.max(1, Math.round(base + adj.adjustValue));
      }
    }
  }
  return base;
}

async function seed() {
  console.log("Clearing existing data...");
  await clear();

  console.log("Seeding users (tenants and guests)...");
  const tenantCount = 3;
  const guestCount = 10;
  const tenants: Tenant[] = [];
  const guests: Guest[] = [];

  for (let i = 0; i < tenantCount + guestCount; i++) {
    const isTenant = i < tenantCount;
    const user = await prisma.user.create({
      data: {
        role: isTenant ? ("TENANT" as any) : ("USER" as any),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: await bcrypt.hash("Pass123!", 10),
        avatarUrl: faker.image.avatarGitHub(),
        phone: faker.phone.number(),
        emailVerified: faker.datatype.boolean(),
      },
      select: { id: true },
    });
    if (isTenant) tenants.push(user);
    else guests.push(user);
  }
  console.log(`Created ${tenants.length} tenants, ${guests.length} guests`);

  console.log(
    "Seeding categories, properties, rooms, availability, adjustments..."
  );
  const amenities = [
    "WIFI",
    "AIR_CONDITIONER",
    "PARKING",
    "SWIMMING_POOL",
    "KITCHEN",
    "TV",
    "WATER_HEATER",
    "WASHING_MACHINE",
    "REFRIGERATOR",
    "MICROWAVE",
    "ELEVATOR",
    "GYM",
    "RECEPTION_24H",
    "SECURITY",
    "CCTV",
    "PET_FRIENDLY",
    "SMOKING_ALLOWED",
    "NON_SMOKING",
    "WHEELCHAIR_ACCESS",
    "BREAKFAST",
    "BALCONY",
    "SEA_VIEW",
    "MOUNTAIN_VIEW",
    "GARDEN",
    "BBQ",
  ] as const;

  const rooms: RoomRec[] = [];
  const roomAdjustments = new Map<string, AdjustmentRec[]>();

  for (const t of tenants) {
    const catCount = faker.number.int({ min: 1, max: 2 });
    const categories = [] as { id: string }[];
    for (let c = 0; c < catCount; c++) {
      const category = await prisma.propertyCategory.create({
        data: {
          tenantId: t.id,
          name: faker.helpers.arrayElement([
            "APARTMENT",
            "HOUSE",
            "VILLA",
            "GUESTHOUSE",
            "CONDO",
          ]),
          description: faker.lorem.sentence(),
        },
        select: { id: true },
      });
      categories.push(category);
    }

    const propCount = faker.number.int({ min: 2, max: 3 });
    for (let p = 0; p < propCount; p++) {
      const category = faker.helpers.arrayElement(categories);
      const city = faker.location.city();
      const property = await prisma.property.create({
        data: {
          tenantId: t.id,
          categoryId: category.id,
          name: `${city} ${faker.company.name()}`,
          slug: `${slugifyLocal(
            `${city} ${faker.location.country()}`
          )}-${randomUUID().replace(/-/g, "").slice(0, 8)}`,
          description: faker.lorem.paragraph(),
          country: faker.location.country(),
          city,
          address: faker.location.streetAddress(),
          latitude: faker.location.latitude({ max: 6, min: -11, precision: 7 }),
          longitude: faker.location.longitude({
            max: 142,
            min: 95,
            precision: 7,
          }),
          maxGuests: faker.number.int({ min: 2, max: 12 }),
          Pictures: {
            create: Array.from({ length: 5 }).map(() => ({
              imageUrl: faker.image.urlPicsumPhotos({
                width: 1280,
                height: 720,
              }),
              note: faker.datatype.boolean()
                ? faker.lorem.words({ min: 2, max: 8 })
                : null,
            })),
          },
        },
        select: { id: true },
      });

      const chosen = faker.helpers.arrayElements(amenities, {
        min: 4,
        max: 8,
      });
      if (chosen.length) {
        await prisma.propertyFacility.createMany({
          data: chosen.map((facility) => ({
            propertyId: property.id,
            facility: facility as any,
            note: faker.datatype.boolean()
              ? faker.lorem.words({ min: 2, max: 6 })
              : null,
          })),
        });
      }

      const roomCount = faker.number.int({ min: 2, max: 4 });
      for (let r = 0; r < roomCount; r++) {
        const basePrice = faker.number.int({ min: 20, max: 300 });
        const room = await prisma.room.create({
          data: {
            propertyId: property.id,
            name: `${faker.word.adjective({
              length: { min: 4, max: 8 },
            })} Room ${r + 1}`,
            basePrice: basePrice.toString(),
            capacity: faker.number.int({ min: 1, max: 6 }),
            bedType: faker.helpers.arrayElement([
              BedType.KING,
              BedType.QUEEN,
              BedType.SINGLE,
              BedType.TWIN,
            ]),
            bedCount: faker.number.int({ min: 1, max: 4 }),
            pictureUrl: faker.image.urlPicsumPhotos({
              width: 800,
              height: 600,
            }),
          },
          select: { id: true },
        });

        const roomRec: RoomRec = {
          id: room.id,
          propertyId: property.id,
          tenantId: t.id,
          basePrice,
        };
        rooms.push(roomRec);

        const today = new Date();
        const availabilityRows: {
          roomId: string;
          date: Date;
          isAvailable: boolean;
        }[] = [];
        for (let d = 0; d < AVAILABILITY_DAYS; d++) {
          const date = addDays(today, d);
          const isAvailable = faker.number.int({ min: 1, max: 100 }) > 10;
          availabilityRows.push({ roomId: room.id, date, isAvailable });
        }
        await prisma.roomAvailability.createMany({ data: availabilityRows });

        const adjustCount = faker.number.int({ min: 0, max: 2 });
        const adjustments: AdjustmentRec[] = [];
        for (let a = 0; a < adjustCount; a++) {
          const startOffset = faker.number.int({ min: 3, max: 30 });
          const length = faker.number.int({ min: 3, max: 10 });
          const startDate = addDays(new Date(), startOffset);
          const endDate = addDays(startDate, length);
          const applyAllDates = faker.datatype.boolean();
          const adjustType = faker.helpers.arrayElement([
            "PERCENTAGE",
            "NOMINAL",
          ]) as "PERCENTAGE" | "NOMINAL";
          const adjustValue =
            adjustType === "PERCENTAGE"
              ? faker.number.int({ min: -20, max: 35 })
              : faker.number.int({ min: -15, max: 50 });

          const created = await prisma.priceAdjustment.create({
            data: {
              roomId: room.id,
              title: faker.company.buzzNoun(),
              startDate,
              endDate,
              adjustType: adjustType as any,
              adjustValue: adjustValue.toString(),
              applyAllDates,
            },
            select: { id: true },
          });

          let dates: string[] | undefined = undefined;
          if (!applyAllDates) {
            const days: string[] = [];
            const totalDays = Math.min(6, Math.max(2, length));
            for (let k = 0; k < totalDays; k++) {
              const dd = addDays(
                startDate,
                faker.number.int({ min: 0, max: length })
              );
              days.push(toISODate(dd));
            }
            dates = Array.from(new Set(days));
            await prisma.priceAdjustmentDate.createMany({
              data: dates.map((iso) => ({
                priceAdjustmentId: created.id,
                date: new Date(iso),
              })),
              skipDuplicates: true,
            });
          }

          adjustments.push({
            id: created.id,
            roomId: room.id,
            startDate,
            endDate,
            adjustType,
            adjustValue,
            applyAllDates,
            dates,
          });
        }
        if (adjustments.length) {
          roomAdjustments.set(room.id, adjustments);
        }
      }
    }
  }

  console.log("Seeding bookings, payments, reviews...");
  const bookingsTarget = Math.min(rooms.length * 2, 60);
  const usedOrderCodes = new Set<string>();

  const availabilityMap = new Map<string, Set<string>>();
  for (const room of rooms) {
    const avails = await prisma.roomAvailability.findMany({
      where: { roomId: room.id, isAvailable: true },
      select: { date: true },
    });
    availabilityMap.set(
      room.id,
      new Set(avails.map((a) => toISODate(new Date(a.date))))
    );
  }

  const pickStay = (
    roomId: string
  ): { checkIn: Date; checkOut: Date } | null => {
    const dates = availabilityMap.get(roomId);
    if (!dates || dates.size === 0) return null;
    const sorted = Array.from(dates).sort();
    const startIdx = faker.number.int({
      min: 0,
      max: Math.max(0, sorted.length - 3),
    });
    const nights = faker.number.int({ min: 1, max: 5 });
    const startISO = sorted[startIdx];
    if (!startISO) return null;
    const start = new Date(startISO);
    const end = addDays(start, nights);
    for (let d = 0; d < nights; d++) {
      const iso = toISODate(addDays(start, d));
      if (!dates.has(iso)) return null;
    }
    for (let d = 0; d < nights; d++) {
      dates.delete(toISODate(addDays(start, d)));
    }
    return { checkIn: start, checkOut: end };
  };

  for (let i = 0; i < bookingsTarget; i++) {
    const guest = faker.helpers.arrayElement(guests);
    const room = faker.helpers.arrayElement(rooms);
    const stay = pickStay(room.id);
    if (!stay) continue;
    const nights = Math.max(
      1,
      Math.round((+stay.checkOut - +stay.checkIn) / (1000 * 60 * 60 * 24))
    );
    const qty = faker.number.int({ min: 1, max: 3 });

    const adjustments = roomAdjustments.get(room.id) || [];
    const effective = calcAdjustedPrice(
      room.basePrice,
      stay.checkIn,
      adjustments
    );

    let orderCode = "";
    do {
      orderCode = `ORD-${faker.string
        .alphanumeric({ length: 8 })
        .toUpperCase()}`;
    } while (usedOrderCodes.has(orderCode));
    usedOrderCodes.add(orderCode);

    const status = faker.helpers.arrayElement([
      "WAITING_PAYMENT",
      "WAITING_CONFIRMATION",
      "PROCESSING",
      "COMPLETED",
      "CANCELED",
    ]) as any;
    const paymentMethod = faker.helpers.arrayElement([
      "MANUAL_TRANSFER",
      "PAYMENT_GATEWAY",
    ]) as any;

    const totalAmount = effective * nights * qty;
    const expiresAt =
      status === "WAITING_PAYMENT" ? addDays(new Date(), 1) : null;

    const created = await prisma.booking.create({
      data: {
        userId: guest.id,
        tenantId: room.tenantId,
        propertyId: room.propertyId,
        roomId: room.id,
        orderCode,
        status,
        paymentMethod,
        checkInDate: stay.checkIn,
        checkOutDate: stay.checkOut,
        nights,
        qty,
        pricePerNight: effective.toString(),
        totalAmount: totalAmount.toString(),
        expiresAt,
      },
      select: { id: true, status: true, paymentMethod: true },
    });

    if (created.paymentMethod === "MANUAL_TRANSFER") {
      if (
        created.status === "WAITING_CONFIRMATION" ||
        created.status === "PROCESSING" ||
        created.status === "COMPLETED"
      ) {
        const accepted = created.status === "COMPLETED" ? new Date() : null;
        const rejected = null;
        await prisma.paymentProof.create({
          data: {
            orderId: created.id,
            uploadedBy: guest.id,
            imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
            acceptedAt: accepted,
            rejectedAt: rejected,
            reviewedBy: accepted
              ? faker.helpers.arrayElement(tenants).id
              : null,
          },
        });
      }
    } else if (created.paymentMethod === "PAYMENT_GATEWAY") {
      if (created.status === "PROCESSING" || created.status === "COMPLETED") {
        await prisma.gatewayPayment.create({
          data: {
            orderId: created.id,
            provider: faker.helpers
              .arrayElement(["midtrans", "xendit", "stripe"])
              .toUpperCase(),
            providerRef: faker.string
              .alphanumeric({ length: 10 })
              .toUpperCase(),
            paidAmount:
              created.status === "COMPLETED" ? totalAmount.toString() : null,
            paidAt: created.status === "COMPLETED" ? new Date() : null,
            status: created.status === "COMPLETED" ? "paid" : "pending",
            payload: {
              channel: faker.helpers.arrayElement(["cc", "va", "ewallet"]),
              note: faker.lorem.sentence(),
            } as any,
          },
        });
      }
    }

    if (created.status === "COMPLETED" && faker.datatype.boolean()) {
      await prisma.review.create({
        data: {
          orderId: created.id,
          userId: guest.id,
          propertyId: room.propertyId,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentences({ min: 1, max: 3 }),
        },
      });
    }
  }

  console.log("Seeding finished");
}

seed()
  .then(async () => {
    console.log("Seed completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
