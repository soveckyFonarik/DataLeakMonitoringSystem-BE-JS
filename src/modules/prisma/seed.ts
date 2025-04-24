// src/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding the database...');

  // 1. Create Users
  const user1 = await prisma.user.create({
    data: {
      uniqueLogin: 'testuser1',
      passwordHash: await bcrypt.hash('password123', 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      uniqueLogin: 'testuser2',
      passwordHash: await bcrypt.hash('securePass', 10),
    },
  });

  // 2. Create UserPasses
  await prisma.userPass.createMany({
    data: [
      {
        userId: user1.id,
        host: 'example.com',
        hashPass: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', // SHA1 of "password"
        login: 'testuser1',
        isLeaked: false,
      },
      {
        userId: user1.id,
        host: 'gmail.com',
        hashPass: await bcrypt.hash('MySuperSecretPassword', 10), // You should hash passwords before storing
        login: 'testuser1@gmail.com',
        isLeaked: false,
      },
      {
        userId: user2.id,
        host: 'github.com',
        hashPass: await bcrypt.hash('AnotherStrongPassword', 10), // Always hash passwords!
        login: 'testuser2',
        isLeaked: false,
      },
    ],
  });

  // 3. Create TypeServices
  const typeService1 = await prisma.typeService.create({
    data: {
      nameService: 'Social Media',
    },
  });

  const typeService2 = await prisma.typeService.create({
    data: {
      nameService: 'Email',
    },
  });

  // 4. Create AlertUserServiceLists
  await prisma.alertUserServiceList.createMany({
    data: [
      {
        userId: user1.id,
        typeServiceId: typeService1.id,
        loginServiceId: 'testuser1_social',
      },
      {
        userId: user2.id,
        typeServiceId: typeService2.id,
        loginServiceId: 'testuser2@email.com',
      },
    ],
  });

  console.log('Database seeding completed.');
}

seed()
  .catch((e) => {
    console.error('Error seeding the database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
