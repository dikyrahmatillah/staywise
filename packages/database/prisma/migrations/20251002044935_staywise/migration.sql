-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('GUEST', 'TENANT');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSING', 'COMPLETED', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."BookingPaymentMethod" AS ENUM ('MANUAL_TRANSFER', 'PAYMENT_GATEWAY');

-- CreateEnum
CREATE TYPE "public"."PriceAdjustType" AS ENUM ('PERCENTAGE', 'NOMINAL');

-- CreateEnum
CREATE TYPE "public"."Amenities" AS ENUM ('WIFI', 'AIR_CONDITIONER', 'PARKING', 'SWIMMING_POOL', 'KITCHEN', 'TV', 'WATER_HEATER', 'WASHING_MACHINE', 'REFRIGERATOR', 'MICROWAVE', 'ELEVATOR', 'GYM', 'RECEPTION_24H', 'SECURITY', 'CCTV', 'PET_FRIENDLY', 'SMOKING_ALLOWED', 'NON_SMOKING', 'WHEELCHAIR_ACCESS', 'BREAKFAST', 'BALCONY', 'SEA_VIEW', 'MOUNTAIN_VIEW', 'GARDEN', 'BBQ');

-- CreateEnum
CREATE TYPE "public"."BedType" AS ENUM ('KING', 'QUEEN', 'SINGLE', 'TWIN');

-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE');

-- CreateEnum
CREATE TYPE "public"."TokenStatus" AS ENUM ('ACTIVE', 'USED', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."AuthToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."TokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "status" "public"."TokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'GUEST',
    "firstName" VARCHAR(150),
    "lastName" VARCHAR(150),
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" VARCHAR(255),
    "image" TEXT,
    "phone" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyCategory" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomCategory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyCategoryId" TEXT NOT NULL,
    "customCategoryId" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "country" VARCHAR(60) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "maxGuests" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyPicture" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyPicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyFacility" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "facility" "public"."Amenities" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(12,2) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "bedType" "public"."BedType",
    "bedCount" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoomAvailability" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PriceAdjustment" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "title" VARCHAR(150),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "adjustType" "public"."PriceAdjustType" NOT NULL,
    "adjustValue" DECIMAL(12,2) NOT NULL,
    "applyAllDates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PriceAdjustmentDate" (
    "id" TEXT NOT NULL,
    "priceAdjustmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceAdjustmentDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "orderCode" VARCHAR(30) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "paymentMethod" "public"."BookingPaymentMethod" NOT NULL DEFAULT 'MANUAL_TRANSFER',
    "snapToken" TEXT,
    "orderId" TEXT,
    "paidAt" TIMESTAMP(3),
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "pricePerNight" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentProof" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "PaymentProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GatewayPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "providerRef" VARCHAR(100),
    "snapToken" TEXT,
    "redirectUrl" TEXT,
    "paidAmount" DECIMAL(12,2),
    "paidAt" TIMESTAMP(3),
    "status" VARCHAR(30),
    "payload" JSONB,

    CONSTRAINT "GatewayPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_token_key" ON "public"."AuthToken"("token");

-- CreateIndex
CREATE INDEX "AuthToken_userId_type_status_idx" ON "public"."AuthToken"("userId", "type", "status");

-- CreateIndex
CREATE INDEX "AuthToken_expiresAt_idx" ON "public"."AuthToken"("expiresAt");

-- CreateIndex
CREATE INDEX "AuthToken_token_idx" ON "public"."AuthToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyCategory_name_key" ON "public"."PropertyCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomCategory_tenantId_name_key" ON "public"."CustomCategory"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "public"."Property"("slug");

-- CreateIndex
CREATE INDEX "Property_tenantId_idx" ON "public"."Property"("tenantId");

-- CreateIndex
CREATE INDEX "Property_propertyCategoryId_idx" ON "public"."Property"("propertyCategoryId");

-- CreateIndex
CREATE INDEX "Property_customCategoryId_idx" ON "public"."Property"("customCategoryId");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "public"."Property"("city");

-- CreateIndex
CREATE INDEX "PropertyPicture_propertyId_idx" ON "public"."PropertyPicture"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyFacility_propertyId_idx" ON "public"."PropertyFacility"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyFacility_propertyId_facility_key" ON "public"."PropertyFacility"("propertyId", "facility");

-- CreateIndex
CREATE INDEX "Room_propertyId_idx" ON "public"."Room"("propertyId");

-- CreateIndex
CREATE INDEX "RoomAvailability_roomId_idx" ON "public"."RoomAvailability"("roomId");

-- CreateIndex
CREATE INDEX "RoomAvailability_bookingId_idx" ON "public"."RoomAvailability"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomAvailability_roomId_date_key" ON "public"."RoomAvailability"("roomId", "date");

-- CreateIndex
CREATE INDEX "PriceAdjustment_roomId_idx" ON "public"."PriceAdjustment"("roomId");

-- CreateIndex
CREATE INDEX "PriceAdjustment_startDate_endDate_idx" ON "public"."PriceAdjustment"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "PriceAdjustmentDate_priceAdjustmentId_idx" ON "public"."PriceAdjustmentDate"("priceAdjustmentId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceAdjustmentDate_priceAdjustmentId_date_key" ON "public"."PriceAdjustmentDate"("priceAdjustmentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_orderCode_key" ON "public"."Booking"("orderCode");

-- CreateIndex
CREATE INDEX "Booking_tenantId_idx" ON "public"."Booking"("tenantId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "public"."Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_propertyId_idx" ON "public"."Booking"("propertyId");

-- CreateIndex
CREATE INDEX "Booking_roomId_idx" ON "public"."Booking"("roomId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentProof_orderId_key" ON "public"."PaymentProof"("orderId");

-- CreateIndex
CREATE INDEX "PaymentProof_uploadedBy_idx" ON "public"."PaymentProof"("uploadedBy");

-- CreateIndex
CREATE UNIQUE INDEX "GatewayPayment_orderId_key" ON "public"."GatewayPayment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_key" ON "public"."Review"("orderId");

-- CreateIndex
CREATE INDEX "Review_propertyId_idx" ON "public"."Review"("propertyId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "public"."AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomCategory" ADD CONSTRAINT "CustomCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_propertyCategoryId_fkey" FOREIGN KEY ("propertyCategoryId") REFERENCES "public"."PropertyCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_customCategoryId_fkey" FOREIGN KEY ("customCategoryId") REFERENCES "public"."CustomCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyPicture" ADD CONSTRAINT "PropertyPicture_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyFacility" ADD CONSTRAINT "PropertyFacility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomAvailability" ADD CONSTRAINT "RoomAvailability_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomAvailability" ADD CONSTRAINT "RoomAvailability_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceAdjustment" ADD CONSTRAINT "PriceAdjustment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceAdjustmentDate" ADD CONSTRAINT "PriceAdjustmentDate_priceAdjustmentId_fkey" FOREIGN KEY ("priceAdjustmentId") REFERENCES "public"."PriceAdjustment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentProof" ADD CONSTRAINT "PaymentProof_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentProof" ADD CONSTRAINT "PaymentProof_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GatewayPayment" ADD CONSTRAINT "GatewayPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
