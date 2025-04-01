import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixPrismaUrl() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('No .env file found');
    return;
  }

  let envContent = fs.readFileSync(envPath, 'utf8');
  const databaseUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);

  if (databaseUrlMatch && databaseUrlMatch[1].startsWith('prisma://')) {
    const newUrl = databaseUrlMatch[1].replace('prisma://', 'postgresql://');
    envContent = envContent.replace(
      /DATABASE_URL="[^"]+"/,
      `DATABASE_URL="${newUrl}"`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('Fixed DATABASE_URL format');
  }
}

fixPrismaUrl(); 