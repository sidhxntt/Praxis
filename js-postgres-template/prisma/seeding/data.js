import { prisma } from "../../src/utils/Clients/Prisma.js";
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

async function main() {
  console.log("🌱 Starting database seeding...");

  for (let i = 0; i < 20; i++) {
    console.log(`🔄 Seeding data for User ${i + 1}...`);

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const username = faker.internet.username({ firstName, lastName }).toLowerCase();
    const email = faker.internet.email({ firstName, lastName });

    // Securely hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        username,
        phone: faker.phone.number(),
        website: faker.internet.url(),
        address: {
          create: {
            street: faker.location.streetAddress(),
            suite: `Apt. ${faker.number.int({ min: 100, max: 999 })}`,
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
          },
        },
      },
    });

    console.log(`👤 Created user: ${fullName}`);

    // Create 30 Albums per User (Using Promise.all for better performance)
    console.log(`📸 Creating 30 albums for ${fullName}...`);
    await Promise.all(
      Array.from({ length: 30 }, async () => {
        await prisma.album.create({
          data: {
            userId: user.id,
            title: faker.lorem.words(3),
            Image: {
              create: Array.from({ length: 100 }, () => ({
                title: faker.lorem.words(2),
                url: faker.image.url(),
                thumbnailUrl: faker.image.url(),
              })),
            },
          },
        });
      })
    );

    // Create 500 Posts per User
    console.log(`📝 Creating 500 posts for ${fullName}...`);
    await prisma.post.createMany({
      data: Array.from({ length: 500 }, () => ({
        userId: user.id,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
      })),
    });

    // Create 10 Todos per User
    console.log(`✅ Creating 10 todos for ${fullName}...`);
    await prisma.todos.createMany({
      data: Array.from({ length: 10 }, () => ({
        userId: user.id,
        title: faker.lorem.words(5),
        completed: faker.datatype.boolean(),
      })),
    });

    console.log(`✅ Finished seeding data for ${fullName}!\n`);
  }

  console.log("🚀 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
