const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envFiles = ['.env', '.env.production', '.env.local'];
  for (const file of envFiles) {
    const envPath = path.resolve(__dirname, '..', file);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL || 'postgresql://mi_usuario:mi_password_secreto@localhost:5432/asociacion_web?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Buscando usuarios simulados (@seed.eurielec.es)...');

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

  const result = await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@seed.eurielec.es' }
    }
  });

  console.log(`✅ ¡Eliminados con éxito ${result.count} usuarios simulados!`);

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
    await pool.end();
  });
