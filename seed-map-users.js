const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const provinces = [
    'Madrid', 'Barcelona', 'Valencia', 'A Coruña', 'Cádiz',
    'Zaragoza', 'Málaga', 'Álava', 'Asturias', 'Palencia'
  ];

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 0; i < provinces.length; i++) {
    const province = provinces[i];
    const email = `prueba${i}@mapa.com`;
    
    // Check if user already exists to avoid unique constraint errors
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: `Socio de ${province}`,
          email: email,
          password: hashedPassword,
          phone: "+34 600000000",
          address: "Calle Falsa 123",
          city: "Ciudad Ejemplo",
          province: province,
          zipCode: "28000",
          role: "USER" // Tiene que ser USER o ADMIN para que salga en el mapa
        }
      });
      console.log(`✅ Creado socio en la provincia: ${province}`);
    } else {
      console.log(`⏭️  El socio de ${province} ya existía.`);
    }
  }
  
  console.log('¡Todos los usuarios de prueba han sido inyectados con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
