import { PrismaClient } from '@prisma/client';
import { EncryptionUtilityService } from '../src/encryption-utility/encryption-utility.service'; // Assuming you placed the encryption code in a file named `encryption-utils.ts`

const prisma = new PrismaClient();
const encryptionService = new EncryptionUtilityService();

async function main() {
  const encryptedTelegramBotToken = encryptionService.encrypt(
    process.env.TELEGRAM_BOT_TOKEN,
  );
  const encryptedWeatherApiKey = encryptionService.encrypt(
    process.env.WEATHER_API_KEY,
  );
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
