import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      role: 'USER',
    },
  });

  await prisma.contact.create({
    data: {
      id: uuidv4(),
      userId: user1.id,
      type: 'EMAIL',
      content: faker.internet.email(),
    },
  });

  const project = await prisma.project.create({
    data: {
      id: uuidv4(),
      name: faker.internet.domainName(),
      estimatedCost: parseFloat(
        faker.finance.amount({ min: 10000, max: 1000000 }),
      ),
      currencyType: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'UAH']),
      projectType: faker.helpers.arrayElement(['INVESTMENT', 'DONATION']),
      description: faker.lorem.paragraph(),
      address: faker.location.streetAddress(),
      userId: user1.id,
    },
  });

  await prisma.photo.createMany({
    data: Array.from({ length: 3 }).map((_, index) => ({
      id: uuidv4(),
      projectId: project.id,
      link: faker.image.url(),
      isMain: index === 0,
    })),
  });

  const product = await prisma.product.create({
    data: {
      id: uuidv4(),
      projectId: project.id,
      name: faker.commerce.productName(),
      amount: parseFloat(faker.finance.amount({ min: 10000, max: 1000000 })),
    },
  });

  await prisma.investment.create({
    data: {
      id: uuidv4(),
      productId: product.id,
      userId: user2.id,
      amount: parseFloat(faker.finance.amount({ min: 10000, max: 1000000 })),
    },
  });

  const post = await prisma.post.create({
    data: {
      id: uuidv4(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      userId: user1.id,
    },
  });

  await prisma.comment.create({
    data: {
      id: uuidv4(),
      postId: post.id,
      userId: user2.id,
      content: faker.lorem.sentences(2),
    },
  });

  await prisma.message.create({
    data: {
      id: uuidv4(),
      senderId: user1.id,
      receiverId: user2.id,
      content: faker.lorem.sentence(),
    },
  });
}

main()
  .then(() => {
    console.log('✅ Database seeded successfully with faker data!');
  })
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
