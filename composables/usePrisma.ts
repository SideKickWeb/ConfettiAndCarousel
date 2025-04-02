// This is a safe Prisma wrapper that handles the client/server boundary
export function usePrisma() {
  // Only actually use Prisma on the server
  if (process.server) {
    // Dynamic import to prevent client-side bundling
    return import('../lib/prisma').then(module => module.default)
  }

  // Return a dummy object for client-side
  return Promise.resolve(null)
} 