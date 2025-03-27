-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Requested', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('Draft', 'Approved', 'Closed');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'InProgress', 'Completed');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('Furniture', 'Lighting', 'Linens', 'Florals', 'Backdrops', 'Props', 'Tableware', 'Audio', 'Accessories', 'Custom');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Client', 'Staff', 'Vendor');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "guests" INTEGER NOT NULL DEFAULT 0,
    "total_price" DECIMAL(10,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'Client',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "name" VARCHAR(100) NOT NULL,
    "contact" VARCHAR(100),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "client_id" UUID NOT NULL,
    "event_name" VARCHAR(100) NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "event_date" DATE NOT NULL,
    "start_time" TIME,
    "end_time" TIME,
    "venue" VARCHAR(100),
    "venue_address" TEXT,
    "expected_guests" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'Requested',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_stages" (
    "stage_name" VARCHAR(50) NOT NULL,
    "stage_order" SMALLINT NOT NULL,
    "description" TEXT,
    "id" SMALLSERIAL NOT NULL,

    CONSTRAINT "pipeline_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_pipeline" (
    "event_id" UUID NOT NULL,
    "stage_id" SMALLINT NOT NULL,
    "date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "event_pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "is_hire_only" BOOLEAN NOT NULL DEFAULT false,
    "min_quantity" INTEGER DEFAULT 1,
    "has_variants" BOOLEAN NOT NULL DEFAULT false,
    "customizable" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_custom_options" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_custom_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_items" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "booking_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_item_custom_values" (
    "id" UUID NOT NULL,
    "booking_item_id" UUID NOT NULL,
    "product_custom_option_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "booking_item_custom_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_budgets" (
    "event_id" UUID NOT NULL,
    "total_budget" DECIMAL(10,2) NOT NULL,
    "current_expenses" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" "BudgetStatus" NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "event_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_staff" (
    "event_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "event_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "event_id" UUID NOT NULL,
    "staff_id" UUID,
    "task_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "due_date" DATE NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'Medium',
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_id_key" ON "accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_account_id_key" ON "clients"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_account_id_key" ON "staff"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_account_id_key" ON "vendors"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_stages_stage_order_key" ON "pipeline_stages"("stage_order");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_pipeline" ADD CONSTRAINT "event_pipeline_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_pipeline" ADD CONSTRAINT "event_pipeline_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "pipeline_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_custom_options" ADD CONSTRAINT "product_custom_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_item_custom_values" ADD CONSTRAINT "booking_item_custom_values_booking_item_id_fkey" FOREIGN KEY ("booking_item_id") REFERENCES "booking_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_item_custom_values" ADD CONSTRAINT "booking_item_custom_values_product_custom_option_id_fkey" FOREIGN KEY ("product_custom_option_id") REFERENCES "product_custom_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_budgets" ADD CONSTRAINT "event_budgets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_staff" ADD CONSTRAINT "event_staff_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_staff" ADD CONSTRAINT "event_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
