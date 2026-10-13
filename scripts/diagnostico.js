const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

console.log('====================================================');
console.log('🩺 DIAGNÓSTICO DEL SISTEMA Y BASE DE DATOS EURIELEC');
console.log('====================================================\n');

// 1. Cargar .env
const envFiles = ['.env', '.env.production', '.env.local'];
let loadedEnv = null;
for (const file of envFiles) {
  const p = path.resolve(__dirname, '..', file);
  if (fs.existsSync(p)) {
    loadedEnv = file;
    const content = fs.readFileSync(p, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const m = trimmed.match(/^([^=]+)=(.*)$/);
        if (m) {
          const k = m[1].trim();
          let v = m[2].trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (!process.env[k]) process.env[k] = v;
        }
      }
    }
    break;
  }
}

if (loadedEnv) {
  console.log(`📁 Archivo de entorno detectado: ${loadedEnv}`);
} else {
  console.log('⚠️  No se encontró archivo .env en la raíz del proyecto.');
}

const rawDbUrl = process.env.DATABASE_URL || '';
if (rawDbUrl) {
  const masked = rawDbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`🔗 DATABASE_URL en entorno: ${masked}`);
} else {
  console.log('⚠️  DATABASE_URL no está definida en process.env.');
}

// 2. Verificar Docker
console.log('\n🐳 Comprobando contenedores Docker en el servidor...');
let dockerAvailable = false;
let dbContainerRunning = false;
try {
  const dockerPs = execSync('docker ps --format "{{.Names}}" 2>/dev/null', { encoding: 'utf8' });
  dockerAvailable = true;
  const containers = dockerPs.trim().split('\n').filter(Boolean);
  console.log(`   Contenedores activos: ${containers.join(', ') || 'Ninguno'}`);
  if (containers.includes('asociacion_db')) {
    dbContainerRunning = true;
    console.log('   ✅ Contenedor de base de datos "asociacion_db" DETECTADO y ACTIVO.');
  }
} catch (e) {
  console.log('   ℹ️  Docker no está instalado o el usuario actual no tiene permisos para docker ps.');
}

// 3. Probar conexión a la base de datos
console.log('\n🔌 Probando conexión con PostgreSQL...');

async function testConnection(connStr, label) {
  try {
    const pool = new Pool({ connectionString: connStr, connectionTimeoutMillis: 3000 });
    const res = await pool.query('SELECT count(*) FROM "User";');
    const total = parseInt(res.rows[0].count, 10);
    
    const fakeRes = await pool.query("SELECT count(*) FROM \"User\" WHERE email LIKE '%@seed.eurielec.es';");
    const fakeTotal = parseInt(fakeRes.rows[0].count, 10);

    const realRes = await pool.query("SELECT name, email, role, city FROM \"User\" WHERE email NOT LIKE '%@seed.eurielec.es';");
    
    console.log(`   ✅ ¡Conexión exitosa via ${label}!`);
    console.log(`   📊 Total de usuarios en la tabla "User": ${total}`);
    console.log(`   🤖 Socios simulados (@seed.eurielec.es): ${fakeTotal}`);
    console.log(`   👥 Socios reales en la base de datos: ${realRes.rows.length}`);
    realRes.rows.forEach((u, i) => {
      console.log(`      ${i + 1}. ${u.name || 'Sin nombre'} (${u.email}) [${u.role}] - Ciudad: ${u.city || 'No definida'}`);
    });

    if (fakeTotal === 0) {
      console.log('\n⚠️  ATENCIÓN: Los 86 socios simulados NO están en esta base de datos.');
      console.log('👉 Para inyectarlos ahora mismo ejecuta:');
      if (dbContainerRunning) {
        console.log('   docker exec -i asociacion_db psql -U mi_usuario -d asociacion_web < scripts/seed-fake-members.sql');
      } else {
        console.log('   node scripts/seed-fake-members.js');
      }
    } else {
      console.log('\n🎉 ¡Los socios simulados YA están en esta base de datos!');
      
      const cityRes = await pool.query('SELECT city, count(*) as count FROM "User" WHERE city IS NOT NULL GROUP BY city ORDER BY count DESC;');
      console.log('   📍 Ciudades registradas:');
      cityRes.rows.forEach(c => {
        console.log(`      * ${c.city}: ${c.count}`);
      });
    }

    await pool.end();
    return true;
  } catch (err) {
    console.log(`   ❌ Falló la conexión via ${label}: ${err.message}`);
    return false;
  }
}

async function run() {
  let connected = false;
  if (rawDbUrl) {
    connected = await testConnection(rawDbUrl, 'DATABASE_URL de entorno');
  }

  if (!connected) {
    // Probar fallback común
    const fallback = 'postgresql://mi_usuario:mi_password_secreto@localhost:5432/asociacion_web?schema=public';
    connected = await testConnection(fallback, 'localhost:5432 (default)');
  }

  if (!connected && dbContainerRunning) {
    console.log('\n💡 DIAGNÓSTICO CLAVE:');
    console.log('   PostgreSQL está corriendo DENTRO de Docker ("asociacion_db")');
    console.log('   y el puerto 5432 NO está abierto al exterior en el servidor host.');
    console.log('   Por eso los comandos de Node fallan al conectar con localhost:5432.');
    console.log('\n🚀 SOLUCIÓN DIRECTA (Ejecuta esto en la terminal del servidor):');
    console.log('   docker exec -i asociacion_db psql -U mi_usuario -d asociacion_web < scripts/seed-fake-members.sql');
  }

  console.log('\n====================================================\n');
}

run();
