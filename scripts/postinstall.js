const { execSync } = require('child_process');
const path = require('path');

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