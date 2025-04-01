export default defineEventHandler((event) => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw createError({
      statusCode: 500,
      message: 'Missing required environment variables'
    });
  }

  // Check database connection
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.error('Invalid DATABASE_URL format');
    throw createError({
      statusCode: 500,
      message: 'Invalid database configuration'
    });
  }
}); 