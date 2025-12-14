const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@iot.com' },
    update: {},
    create: {
      email: 'admin@iot.com',
      name: 'Admin IoT',
    },
  });
  console.log({ user });
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });