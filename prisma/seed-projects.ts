import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding projects...');

  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      title: 'Nuevo Servidor y Cluster Kubernetes',
      description: 'Despliegue y configuración de nuestro nuevo servidor Bare-metal. Migración de la infraestructura básica a un entorno distribuido mediante orquestación en contenedores de Kubernetes.',
      vocaliaId: 'it',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Sistema de Control de Accesos por RFID',
      description: 'Un sistema embebido desarrollado desde cero que lee tarjetas del personal y de la UPM para abrir automáticamente la sede y registrar las aperturas.',
      vocaliaId: 'electronica',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Renovación del Laboratorio de Soldadura',
      description: 'Iniciativa para reparar y equipar de nuevo nuestro laboratorio con herramientas avanzadas para la soldadura SMD y montaje de prototipos impresos (PCB).',
      vocaliaId: 'electronica',
      imageUrl: 'https://images.unsplash.com/photo-1623910271000-4ea2121e7845?q=80&w=2070&auto=format&fit=crop'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Plataforma Web 2026',
      description: 'El proyecto que estás viendo ahora mismo. Renovando el diseño de la asociación y unificando el portal público bajo una estética brutalista basada en React/Next.',
      vocaliaId: 'it',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Diseño Merchandising Eurielec',
      description: 'Establecimiento de las guías de marca para la nueva remesa de sudaderas de la temporada 2026, optando por una composición minimalista con estampados pesados.',
      vocaliaId: 'sudaderas',
      imageUrl: null
    }
  });

  console.log('Seed de proyectos completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
