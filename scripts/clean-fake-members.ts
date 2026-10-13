import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Buscando usuarios simulados (@seed.eurielec.es)...');

  // Contar cuántos usuarios simulados hay
  const fakeCount = await prisma.user.count({
    where: {
      email: { endsWith: '@seed.eurielec.es' }
    }
  });

  if (fakeCount === 0) {
    console.log('✨ No hay ningún usuario simulado (@seed.eurielec.es) en la base de datos.');
    return;
  }

  console.log(`⚠️  Se han encontrado ${fakeCount} usuarios simulados. Procediendo a eliminarlos...`);

  // Eliminar en cascada/limpio
  const result = await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@seed.eurielec.es' }
    }
  });

  console.log(`✅ ¡Eliminados con éxito ${result.count} usuarios simulados!`);

  // Comprobar los usuarios reales que quedan
  const remainingRealUsers = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true
    }
  });

  console.log('\n👥 Usuarios reales que permanecen intactos en la base de datos:');
  remainingRealUsers.forEach((u, idx) => {
    console.log(`   ${idx + 1}. ${u.name || 'Sin nombre'} (${u.email}) [${u.role}]`);
  });
  console.log(`Total usuarios reales activos: ${remainingRealUsers.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error limpiando usuarios simulados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
