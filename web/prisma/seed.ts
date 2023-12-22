import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function dropDb() {
  await prisma.user.deleteMany()
}

async function main() {
  await dropDb()
}

main()
