import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://mi_usuario:mi_password_secreto@localhost:5432/asociacion_web?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- SEEDING SHOP DATA ---');

  // 1. Configuración de la tienda (Apertura/Cierre)
  await prisma.shopSetting.upsert({
    where: { key: 'hoodies_status' },
    update: {},
    create: { key: 'hoodies_status', value: 'closed' },
  });

  await prisma.shopSetting.upsert({
    where: { key: 'merch_status' },
    update: {},
    create: { key: 'merch_status', value: 'open' },
  });

  // 2. Productos
  
  // -- SUDADERAS --
  const hoodie = await prisma.shopProduct.upsert({
    where: { id: 'seed-hoodie-2024' },
    update: {},
    create: {
      id: 'seed-hoodie-2024',
      name: 'Sudadera Oficial Eurielec 2024',
      description: 'Sudadera de alta calidad con el logotipo bordado de la asociación.',
      price: 25.00,
      category: 'hoodies',
      sizes: 'S,M,L,XL,XXL',
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
      active: true,
    }
  });

  // Variantes para sudaderas
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Rojo'];
  const styles = ['con capucha', 'sin capucha'];

  for (const size of sizes) {
    for (const color of colors) {
      for (const style of styles) {
        await prisma.shopVariant.upsert({
          where: {
            productId_size_color_type_lining: {
              productId: hoodie.id,
              size,
              color,
              type: style,
              lining: 'sin forro'
            }
          },
          update: {},
          create: {
            productId: hoodie.id,
            size,
            color,
            type: style,
            lining: 'sin forro',
            stock: 10 // 10 unidades de cada una
          }
        });
      }
    }
  }

  // -- MERCH --
  const stickers = await prisma.shopProduct.upsert({
    where: { id: 'seed-stickers' },
    update: {},
    create: {
      id: 'seed-stickers',
      name: 'Pack Pegatinas Eurielec',
      description: 'Variedad de stickers para decorar tu portátil con orgullo asociativo.',
      price: 2.50,
      category: 'merch',
      sizes: 'Única',
      imageUrl: 'https://images.unsplash.com/photo-1572375958800-24bc688536f9?q=80&w=800&auto=format&fit=crop',
      active: true,
    }
  });

  await prisma.shopVariant.upsert({
    where: {
      productId_size_color_type_lining: {
        productId: stickers.id,
        size: 'Única',
        color: 'Multicolor',
        type: 'Pegatina',
        lining: 'N/A'
      }
    },
    update: {},
    create: {
      productId: stickers.id,
      size: 'Única',
      color: 'Multicolor',
      type: 'Pegatina',
      lining: 'N/A',
      stock: 100
    }
  });

  const mug = await prisma.shopProduct.upsert({
    where: { id: 'seed-mug' },
    update: {},
    create: {
      id: 'seed-mug',
      name: 'Taza Eurielec Minimalist',
      description: 'Taza de cerámica negra con logotipo en blanco.',
      price: 8.00,
      category: 'merch',
      sizes: 'Única',
      imageUrl: 'https://images.unsplash.com/photo-1517256011252-aa4519770acc?q=80&w=800&auto=format&fit=crop',
      active: true,
    }
  });

  await prisma.shopVariant.upsert({
    where: {
      productId_size_color_type_lining: {
        productId: mug.id,
        size: 'Única',
        color: 'Negro',
        type: 'Cerámica',
        lining: 'N/A'
      }
    },
    update: {},
    create: {
      productId: mug.id,
      size: 'Única',
      color: 'Negro',
      type: 'Cerámica',
      lining: 'N/A',
      stock: 15
    }
  });

  console.log('--- SEEDING COMPLETED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
