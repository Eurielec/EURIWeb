import { prisma } from '../lib/prisma';

async function main() {
  console.log('Sembrando festivos de Madrid 2026...');

  // Festivos para el año 2026 (Comunidad de Madrid)
  const holidays = [
    { title: 'Año Nuevo', date: new Date('2026-01-01T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Epifanía del Señor', date: new Date('2026-01-06T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Jueves Santo', date: new Date('2026-04-02T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Viernes Santo', date: new Date('2026-04-03T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Fiesta del Trabajo', date: new Date('2026-05-01T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Fiesta de la Comunidad de Madrid', date: new Date('2026-05-02T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Asunción de la Virgen', date: new Date('2026-08-15T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Día de la Hispanidad', date: new Date('2026-10-12T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Todos los Santos', date: new Date('2026-11-01T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'La Almudena (Madrid)', date: new Date('2026-11-09T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Día de la Constitución', date: new Date('2026-12-06T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Inmaculada Concepción', date: new Date('2026-12-08T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
    { title: 'Navidad', date: new Date('2026-12-25T12:00:00.000Z'), type: 'HOLIDAY', color: 'bg-red-500' },
  ] as const;

  for (const h of holidays) {
    // Upsert avoids duplicating if run multiple times
    await prisma.event.create({
      data: {
        title: h.title,
        date: h.date,
        type: h.type,
        color: h.color,
      }
    });
  }

  console.log('¡Festivos de Madrid sembrados satisfactoriamente!');
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
