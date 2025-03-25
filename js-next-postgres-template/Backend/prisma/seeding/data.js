// Seed data for the database
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roleOptions = ['superadmin', 'admin', 'cashier', 'manager',];
const statusOptions = ['active', 'inactive', 'invited', 'suspended'];
const taskStatusOptions = ['todo', 'in progress', 'done', 'canceled', 'backlog' ];
const labelOptions = ['bug', 'feature', 'documentation'];
const priorityOptions = ['low', 'medium', 'high',];

async function generateSampleUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username({ firstName, lastName }).toLowerCase();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    password: await bcrypt.hash(faker.internet.password({ length: 10, pattern: /[A-Z]/ }), 10),
    role: faker.helpers.arrayElement(roleOptions),
    status: faker.helpers.arrayElement(statusOptions),
    username,
    phone: faker.phone.number(),
    profile: {
      username,
      bio: faker.person.bio(),
      urls: [
        faker.internet.url(),
        `https://github.com/${username}`,
        `https://twitter.com/${username}`
      ]
    },
    account: {
      firstName,
      dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
    }
  };
}

async function main() {
  console.log('🌱 Starting database seeding...');
  
  const userIds= [];

  // Generate 20 users
  for (let i = 0; i < 93; i++) {
    const sampleUser = await generateSampleUser();
    
    const user = await prisma.user.create({
      data: {
        email: sampleUser.email,
        password: sampleUser.password,
        role: sampleUser.role,
        status: sampleUser.status,
        first_name: sampleUser.firstName,
        last_name: sampleUser.lastName,
        username: sampleUser.username,
        phone: sampleUser.phone,
        // Create related account
        account: {
          create: {
            first_name: sampleUser.account.firstName,
            dob: sampleUser.account.dob
          }
        },
        // Create related profile
        profile: {
          create: {
            username: sampleUser.profile.username,
            bio: sampleUser.profile.bio,
            urls: sampleUser.profile.urls
          }
        }
      }
    });
    
    userIds.push(user.id);
    console.log(`👤 Created user: ${sampleUser.firstName} ${sampleUser.lastName} (${sampleUser.role})`);
  }
  
  // Generate 100 tasks distributed among users
  const taskData = Array.from({ length: 93 }, () => {
    const randomUserIndex = Math.floor(Math.random() * userIds.length);
    
    return {
      title: faker.hacker.phrase(),
      status: faker.helpers.arrayElement(taskStatusOptions),
      label: faker.helpers.arrayElement(labelOptions),
      priority: faker.helpers.arrayElement(priorityOptions)
    };
  });
  
  // Create all tasks at once for efficiency
  await prisma.task.createMany({
    data: taskData
  });
  
  console.log(`✅ Created user related fields for each user.`);
  console.log('✅ Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });