import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runPostinstall() {
  try {
    // Ensure we're in the project root
    process.chdir(path.join(__dirname, '..'));

    const isVercel = process.env.VERCEL === '1';
    const isProd = process.env.NODE_ENV === 'production';

    // Generate Prisma client
    console.log('Generating Prisma client...');
    
    // In Vercel, we need to set specific environment variables
    if (isVercel) {
      console.log('Running in Vercel environment');
      execSync('PRISMA_CLIENT_ENGINE_TYPE=binary npx prisma generate', { 
        stdio: 'inherit',
        env: { ...process.env, PRISMA_CLIENT_ENGINE_TYPE: 'binary' }
      });
    } else {
      execSync('npx prisma generate', { stdio: 'inherit' });
    }

    // Push schema changes if needed
    if (isProd && !isVercel) {
      // Don't run DB push on Vercel build - only when explicitly needed
      console.log('Pushing Prisma schema changes...');
      execSync('npx prisma db push', { stdio: 'inherit' });
    }

    console.log('Postinstall completed successfully');
  } catch (error) {
    console.error('Error during postinstall:', error);
    process.exit(1);
  }
}

runPostinstall(); 