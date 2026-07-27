const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  const email = 'admin@rishteforever.com';
  const password = 'RfMatrimony@7Q9!L2x';
  const role = 'ADMIN';

  console.log(`Setting up admin user: ${email}`);

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role,
        passwordHash,
        requiresPasswordChange: true,
      },
      create: {
        email,
        name: 'Administrator',
        role,
        passwordHash,
        requiresPasswordChange: true,
      },
    });
    console.log(`Successfully created/updated admin user with ID: ${user.id}`);
  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
