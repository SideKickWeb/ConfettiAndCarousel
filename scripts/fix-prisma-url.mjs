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

  if (databaseUrlMatch) {
    let url = databaseUrlMatch[1];
    let modified = false;

    // Fix prisma:// prefix if present
    if (url.startsWith('prisma://')) {
      url = url.replace('prisma://', 'postgresql://');
      modified = true;
    }

    // Fix incorrect Windows path separators in the URL if present
    if (url.includes('\\')) {
      url = url.replace(/\\/g, '/');
      modified = true;
    }

    // Ensure no spaces in the URL
    if (url.includes(' ')) {
      url = url.replace(/ /g, '%20');
      modified = true;
    }

    if (modified) {
      envContent = envContent.replace(
        /DATABASE_URL="[^"]+"/,
        `DATABASE_URL="${url}"`
      );
      fs.writeFileSync(envPath, envContent);
      console.log('Fixed DATABASE_URL format');
    }
  } else {
    console.log('DATABASE_URL not found in .env file');
  }
}

fixPrismaUrl(); 