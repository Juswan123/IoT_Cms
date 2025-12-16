const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await require('bcrypt').hash('123456', 10); // Password default

  // 1. Buat ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@iot.com' },
    update: {},
    create: {
      email: 'admin@iot.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN' // <--- Set sebagai Admin
    },
  });

  // 2. Buat USER BIASA
  await prisma.user.upsert({
    where: { email: 'user@iot.com' },
    update: {},
    create: {
      email: 'user@iot.com',
      name: 'Mahasiswa Biasa',
      password: hashedPassword,
      role: 'USER'
    },
  });

  // 2. Isi Daftar Komponen (Master Data)
  const components = [
    { name: 'Arduino Uno', type: 'Microcontroller' },
    { name: 'ESP32', type: 'Microcontroller' },
    { name: 'Sensor DHT11', type: 'Sensor' },
    { name: 'Sensor Ultrasonic', type: 'Sensor' },
    { name: 'LED Merah', type: 'Actuator' },
    { name: 'Resistor 220 Ohm', type: 'Passive' },
    { name: 'Kabel Jumper', type: 'Wiring' }
  ];

  for (const comp of components) {
    await prisma.component.upsert({
      where: { name: comp.name },
      update: {},
      create: comp,
    });
  }
  
  console.log('Database telah diisi komponen!');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });