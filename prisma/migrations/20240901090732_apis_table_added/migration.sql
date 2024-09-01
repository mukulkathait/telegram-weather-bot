-- CreateTable
CREATE TABLE "Apis" (
    "id" TEXT NOT NULL,
    "telegram_bot_token" TEXT NOT NULL,
    "weather_api_key" TEXT NOT NULL,
    "jwt_secret" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apis_pkey" PRIMARY KEY ("id")
);
