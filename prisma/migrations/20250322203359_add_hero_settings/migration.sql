-- CreateTable
CREATE TABLE "hero_settings" (
    "id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "button_text" TEXT NOT NULL,
    "button_link" TEXT NOT NULL,
    "text_position" TEXT NOT NULL DEFAULT 'left',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "hero_settings_pkey" PRIMARY KEY ("id")
);
