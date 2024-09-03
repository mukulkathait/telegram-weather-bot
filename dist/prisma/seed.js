"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const encryption_utility_service_1 = require("../src/encryption-utility/encryption-utility.service");
const prisma = new client_1.PrismaClient();
const encryptionService = new encryption_utility_service_1.EncryptionUtilityService();
async function main() {
    const encryptedTelegramBotToken = encryptionService.encrypt(process.env.TELEGRAM_BOT_TOKEN);
    const encryptedWeatherApiKey = encryptionService.encrypt(process.env.WEATHER_API_KEY);
    const encryptedJwtSecret = encryptionService.encrypt(process.env.JWT_SECRET);
    await prisma.apis.create({
        data: {
            telegram_bot_token: encryptedTelegramBotToken,
            weather_api_key: encryptedWeatherApiKey,
            jwt_secret: encryptedJwtSecret,
        },
    });
    console.log('API keys have been seeded successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map