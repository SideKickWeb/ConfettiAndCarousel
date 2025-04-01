import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runPostinstall() {
  try {
    // Ensure we're in the project root
    process.chdir(path.join(__dirname, '..'));

    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push schema changes if needed
    if (process.env.NODE_ENV === 'production') {
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