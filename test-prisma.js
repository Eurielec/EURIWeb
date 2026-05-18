const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const members = await prisma.user.findMany({
      where: {
        role: { in: ['USER', 'ADMIN'] },
        province: { not: null }
      }
    });
    console.log('SUCCESS, members found:', members.length);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
