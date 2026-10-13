const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Leer .env manualmente si no está cargado
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
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

loadEnv();

const connectionString = process.env.DATABASE_URL || 'postgresql://mi_usuario:mi_password_secreto@localhost:5432/asociacion_web?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const FIRST_NAMES = [
  'Alejandro', 'Lucía', 'Pablo', 'Elena', 'Mario', 'Carmen', 'David', 'Sofía',
  'Javier', 'Paula', 'Carlos', 'Marta', 'Daniel', 'Alba', 'Adrián', 'Sara',
  'Álvaro', 'Claudia', 'Hugo', 'Laura', 'Marcos', 'Irene', 'Gonzalo', 'Andrea',
  'Jorge', 'Nuria', 'Diego', 'Raquel', 'Manuel', 'Silvia', 'Rubén', 'Natalia',
  'Iván', 'Patricia', 'Víctor', 'Marina', 'Héctor', 'Cristina', 'Sergio', 'Beatriz',
  'Guillermo', 'Rocío', 'Óscar', 'Alicia', 'Raúl', 'Belén', 'Ignacio', 'Clara',
  'Fernando', 'Miriam', 'Miguel', 'Lorena', 'Lucas', 'Eva', 'Mateo', 'Inés',
  'Leo', 'Julia', 'Enrique', 'Ainhoa', 'Rodrigo', 'Teresa', 'Ángel', 'Celia',
  'Gabriel', 'Noelia', 'Samuel', 'Ángela', 'Joaquín', 'Victoria', 'Jaime', 'Blanca',
  'Arturo', 'Esther', 'Felipe', 'Lidia', 'Andrés', 'Diana', 'Bruno', 'Adriana',
  'Emilio', 'Gema', 'César', 'Nerea', 'Pelayo', 'Berta'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
  'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez',
  'Muñoz', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez',
  'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Molina', 'Morales', 'Suárez',
  'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Núñez',
  'Iglesias', 'Medina', 'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero',
  'Cano', 'Prieto', 'Méndez', 'Cruz', 'Calvo', 'Gallego', 'Herrera', 'Marquez',
  'Peña', 'Vidal', 'Flores', 'Cabrera', 'Campos', 'Vega', 'Fuentes', 'Carrasco',
  'Diez', 'Caballero', 'Reyes', 'Nieto', 'Aguilar', 'Pascual', 'Santana', 'Herrero',
  'Montero', 'Hidalgo', 'Giménez', 'Lorenzo', 'Vargas', 'Ibáñez', 'Santiago', 'Ferrer',
  'Duran', 'Benítez', 'Mora', 'Vicente', 'Arias', 'Carmona'
];

const LOCATIONS = [
  // 1 persona de arguedas, navarra
  { city: 'Arguedas', province: 'Navarra', latitude: 42.1764, longitude: -1.5975, count: 1 },
  // una de logroño
  { city: 'Logroño', province: 'La Rioja', latitude: 42.4627, longitude: -2.4450, count: 1 },
  // una de valdeverdeja, toledo
  { city: 'Valdeverdeja', province: 'Toledo', latitude: 39.7978, longitude: -5.2206, count: 1 },
  // 1 de illescas
  { city: 'Illescas', province: 'Toledo', latitude: 40.1246, longitude: -3.8475, count: 1 },
  // 2 de salamanca
  { city: 'Salamanca', province: 'Salamanca', latitude: 40.9701, longitude: -5.6635, count: 2 },
  // 1 de neila, burgos
  { city: 'Neila', province: 'Burgos', latitude: 42.0608, longitude: -3.0428, count: 1 },
  // 2 de segovia
  { city: 'Segovia', province: 'Segovia', latitude: 40.9429, longitude: -4.1088, count: 2 },
  // unas 4 de getafe
  { city: 'Getafe', province: 'Madrid', latitude: 40.3083, longitude: -3.7328, count: 4 },
  // 2 de leganes
  { city: 'Leganés', province: 'Madrid', latitude: 40.3282, longitude: -3.7635, count: 2 },
  // uno de humanes
  { city: 'Humanes de Madrid', province: 'Madrid', latitude: 40.2526, longitude: -3.8273, count: 1 },
  // uno del escorial de madrid
  { city: 'El Escorial', province: 'Madrid', latitude: 40.5828, longitude: -4.1283, count: 1 },
  // 1 de rivas
  { city: 'Rivas-Vaciamadrid', province: 'Madrid', latitude: 40.3524, longitude: -3.5350, count: 1 },
  // La gran mayoría en Madrid capital (68 restantes para completar los 86 miembros)
  { city: 'Madrid', province: 'Madrid', latitude: 40.4168, longitude: -3.7038, count: 68 }
];

async function main() {
  console.log('🚀 Iniciando script de seeding de socios simulados para Eurielec...');

  // 1. Limpiar previamente cualquier usuario falso con dominio @seed.eurielec.es
  const deletedOld = await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@seed.eurielec.es' }
    }
  });
  if (deletedOld.count > 0) {
    console.log(`🧹 Eliminados ${deletedOld.count} socios simulados anteriores.`);
  }

  // 2. Cursos académicos: primero (18), segundo (24), tercero (10), cuarto (34) => Total = 86
  const academicYearsList = [
    ...Array(18).fill('1º'),
    ...Array(24).fill('2º'),
    ...Array(10).fill('3º'),
    ...Array(34).fill('4º'),
  ];

  // 3. Universidades: 84 ETSIT y 2 Agronómicas (ETSIAAB) => Total = 86
  const universitiesList = [
    ...Array(84).fill('ETSI Telecomunicación (ETSIT)'),
    ...Array(2).fill('ETSI Agronómica (ETSIAAB)'),
  ];

  // 4. Ubicaciones
  const locationsList = [];
  for (const loc of LOCATIONS) {
    for (let i = 0; i < loc.count; i++) {
      locationsList.push({
        city: loc.city,
        province: loc.province,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
    }
  }

  const hashedPassword = await bcrypt.hash('SocioEurielec2026!', 10);

  // 5. Inyectar los 86 socios
  let createdCount = 0;
  for (let i = 0; i < 86; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName1 = LAST_NAMES[i % LAST_NAMES.length];
    const lastName2 = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName1} ${lastName2}`;
    
    const email = `socio.simulado.${String(i + 1).padStart(3, '0')}@seed.eurielec.es`;
    const loc = locationsList[i];
    const year = academicYearsList[i];
    const uni = universitiesList[i];

    await prisma.user.create({
      data: {
        name: fullName,
        email: email,
        password: hashedPassword,
        role: 'USER',
        emailVerified: true,
        phone: `+34 6${Math.floor(10000000 + Math.random() * 89999999)}`,
        address: `C/ de los Estudiantes, ${i + 1}`,
        city: loc.city,
        province: loc.province,
        latitude: loc.latitude,
        longitude: loc.longitude,
        country: 'España',
        university: uni,
        academicYear: year,
        points: Math.floor(10 + Math.random() * 80),
        membershipPaymentStatus: 'PAID',
      }
    });

    createdCount++;
  }

  console.log(`\n✅ ¡Éxito rotundo! Se han inyectado ${createdCount} socios simulados en la base de datos.`);
  console.log('📊 Resumen de datos inyectados:');
  console.log('   - Total miembros creados: 86');
  console.log('   - Universidades: 84 ETSIT, 2 Agronómicas (ETSIAAB)');
  console.log('   - Cursos: 1º (18), 2º (24), 3º (10), 4º (34)');
  console.log('   - Ubicaciones geográficas:');
  console.log('       * Arguedas (Navarra): 1');
  console.log('       * Logroño (La Rioja): 1');
  console.log('       * Valdeverdeja (Toledo): 1');
  console.log('       * Illescas (Toledo): 1');
  console.log('       * Salamanca: 2');
  console.log('       * Neila (Burgos): 1');
  console.log('       * Segovia: 2');
  console.log('       * Getafe: 4');
  console.log('       * Leganés: 2');
  console.log('       * Humanes de Madrid: 1');
  console.log('       * El Escorial: 1');
  console.log('       * Rivas-Vaciamadrid: 1');
  console.log('       * Madrid capital: 68');
  console.log('\n🗑️  Para borrar todos estos usuarios falsos en cualquier momento:');
  console.log('   node scripts/clean-fake-members.js');
}

main()
  .catch((e) => {
    console.error('❌ Error inyectando socios simulados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
