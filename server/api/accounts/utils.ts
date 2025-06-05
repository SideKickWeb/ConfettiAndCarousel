import prisma from '../../utils/prisma'

export async function validateAccountData(data: any): Promise<string[]> {
  const errors: string[] = []
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string')
  }
  if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    errors.push('Email must be valid')
  }
  if (data.name && typeof data.name !== 'string') {
    errors.push('Name must be a string')
  }
  return errors
}

export async function getAccountByEmail(email: string) {
  return prisma.account.findUnique({ where: { email } })
} 