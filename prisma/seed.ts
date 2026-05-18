import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  // 1. Encriptamos la contraseña "admin123"
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Administrador (Ya existe, aseguramos rol)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eurielec.es' },
    update: { role: 'ADMIN' },
    create: {
      id: 'dev-admin-id',
      email: 'admin@eurielec.es',
      name: 'Admin Supremo',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Socio normal
  const socio = await prisma.user.upsert({
    where: { email: 'socio@eurielec.es' },
    update: { role: 'USER' },
    create: {
      id: 'dev-socio-id',
      email: 'socio@eurielec.es',
      name: 'Socio de Prueba',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // 3. Otro socio para borrar/probar
  const extra = await prisma.user.upsert({
    where: { email: 'candidato@eurielec.es' },
    update: { role: 'USER' },
    create: {
      id: 'dev-candidato-id',
      email: 'candidato@eurielec.es',
      name: 'Candidato a Socio',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('¡Usuarios de prueba inyectados satisfactoriamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });