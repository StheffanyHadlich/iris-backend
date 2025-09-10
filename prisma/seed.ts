import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.pet.create({
    data: {
      name: 'Lupin',
      age: 2,
      type: 'gato',
      race: 'demônio da tasmânia',
      currentWeight: 4.20,
      status: 'AVAILABLE',
      registrationDate: new Date(),
    }
  })

  await prisma.adopter.create({
    data: {
      name: 'Juninho',
      email: 'juninho@gmail.com',
      telephone: '42999999999',
      address: 'Rua de Lá, 123'
    }
  })
}

main().finally(() => prisma.$disconnect())
