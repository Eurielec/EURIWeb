import { prisma } from '../lib/prisma';

const universities = [
  'ETSI Telecomunicación (ETSIT)',
  'ETSI Sistemas de Telecomunicación (ETSIST)',
  'ETSI Informáticos (ETSIINF)',
  'ETSI Sistemas Informáticos (ETSISI)',
  'ETSI Industriales (ETSII)',
  'ETSI Diseño Industrial (ETSIDI)',
  'ETSI Aeronáutica y del Espacio (ETSIAE)',
  'ETS Arquitectura (ETSAM)',
  'ETS Edificación (ETSEM)',
  'ETSI Agronómica (ETSIAAB)',
  'ETSI Caminos (ETSICCP)',
  'ETSI Minas y Energía (ETSIME)',
  'ETSI Montes',
  'ETSI Navales (ETSIN)',
  'ETSI Civil (ETSIC)',
  'ETSI Topografía (ETSITGC)',
  'INEF (Ciencias del Deporte)',
  'Otra Escuela UPM'
];
const courses = ['1º', '2º', '3º', '4º', 'Máster', 'Doctorado', 'Otro'];

async function main() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    const u = universities[Math.floor(Math.random() * universities.length)];
    const c = courses[Math.floor(Math.random() * courses.length)];
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        university: u,
        academicYear: c
      }
    });
    console.log(`Updated user ${user.name} with ${u} - ${c}`);
  }
  
  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
