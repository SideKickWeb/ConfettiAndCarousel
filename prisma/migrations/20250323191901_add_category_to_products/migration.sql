/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `booking_item_custom_values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `booking_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_budgets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_pipeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hero_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pipeline_stages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_custom_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_item_custom_values" DROP CONSTRAINT "booking_item_custom_values_booking_item_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_item_custom_values" DROP CONSTRAINT "booking_item_custom_values_product_custom_option_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_account_id_fkey";

-- DropForeignKey
ALTER TABLE "event_budgets" DROP CONSTRAINT "event_budgets_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_pipeline" DROP CONSTRAINT "event_pipeline_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_pipeline" DROP CONSTRAINT "event_pipeline_stage_id_fkey";

-- DropForeignKey
ALTER TABLE "event_staff" DROP CONSTRAINT "event_staff_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_staff" DROP CONSTRAINT "event_staff_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_client_id_fkey";

-- DropForeignKey
ALTER TABLE "product_custom_options" DROP CONSTRAINT "product_custom_options_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_account_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_event_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_account_id_fkey";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "booking_item_custom_values";

-- DropTable
DROP TABLE "booking_items";

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "event_budgets";

-- DropTable
DROP TABLE "event_pipeline";

-- DropTable
DROP TABLE "event_staff";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "hero_settings";

-- DropTable
DROP TABLE "pipeline_stages";

-- DropTable
DROP TABLE "product_custom_options";

-- DropTable
DROP TABLE "product_variants";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "staff";

-- DropTable
DROP TABLE "tasks";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "vendors";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "BudgetStatus";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "TaskPriority";

-- DropEnum
DROP TYPE "TaskStatus";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "staffNotes" TEXT,
    "paymentDetails" TEXT,
    "invoiceId" TEXT,
    "assignedStaffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventProduct" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSetting" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL DEFAULT 'Learn More',
    "buttonLink" TEXT NOT NULL DEFAULT '/contact',
    "textPosition" TEXT NOT NULL DEFAULT 'left',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventProduct_eventId_productId_key" ON "EventProduct"("eventId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_token_key" ON "StaffInvitation"("token");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
