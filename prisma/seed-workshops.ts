import { prisma } from '../lib/prisma';

async function main() {
  console.log('Sembrando Workshops para Abril 2026...');

  // 1. Semana Temática (Evento multi-día)
  const thematicWeek = await prisma.event.create({
    data: {
      title: 'Workshop Week 2026',
      description: 'Una semana llena de talleres y aprendizaje práctico.',
      date: new Date('2026-04-12T10:00:00.000Z'),
      endDate: new Date('2026-04-17T20:00:00.000Z'),
      type: 'WORKSHOP',
      color: 'bg-purple-500', 
    }
  });

  // 2. Eventos individuales dentro de la semana
  await prisma.event.create({
    data: {
      title: 'Taller de Arduino',
      description: 'Aprende las bases de la electrónica con Arduino.',
      date: new Date('2026-04-13T16:00:00.000Z'),
      type: 'WORKSHOP',
      color: 'bg-orange-500', 
    }
  });

  await prisma.event.create({
    data: {
      title: 'Taller de Soldadura',
      description: 'Aprende a soldar componentes SMD.',
      date: new Date('2026-04-15T17:30:00.000Z'),
      type: 'WORKSHOP',
      color: 'bg-orange-500', 
    }
  });

  console.log('¡Workshops sembrados satisfactoriamente!');
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
