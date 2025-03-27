export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    message: 'API server is working',
    timestamp: new Date().toISOString()
  }
}) 