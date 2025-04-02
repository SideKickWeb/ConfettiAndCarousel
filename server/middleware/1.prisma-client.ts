import prisma from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  // Ensure Prisma client is initialized on server
  // This doesn't actually do anything except ensure prisma is imported
  // and properly bundled only on the server side
}); 