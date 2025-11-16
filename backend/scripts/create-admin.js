const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      return;
    }

    // Get or create default company
    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: 'Veltrip Admin',
          domain: 'admin.veltrip.com',
        },
      });
      console.log('Created default company');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@veltrip.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+91 9999999999',
        role: 'ADMIN',
        companyId: company.id,
        isActive: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Details:');
    console.log('Email: admin@veltrip.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

