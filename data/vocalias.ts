export interface Vocalia {
  id: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  vocalEmail: string; // Para buscar al usuario en la BBDD por email
  image: string; // Imagen de referencia de la vocalía (placeholder por ahora)
}

export const vocalias: Vocalia[] = [
  {
    id: 'it',
    name: { es: 'IT', en: 'IT' },
    description: { 
      es: 'Gestión de la infraestructura digital, servidores, servicios web y desarrollo de herramientas internas de la asociación.',
      en: 'Management of digital infrastructure, servers, web services, and development of internal association tools.'
    },
    vocalEmail: 'it@eurielec.etsit.upm.es',
    image: '/vocalias/tech.png'
  },
  {
    id: 'electronica',
    name: { es: 'Electrónica', en: 'Electronics' },
    description: { 
      es: 'Mantenimiento del laboratorio, proyectos de hardware, soldadura y formación técnica en sistemas electrónicos.',
      en: 'Laboratory maintenance, hardware projects, soldering, and technical training in electronic systems.'
    },
    vocalEmail: 'electronica@eurielec.etsit.upm.es',
    image: '/vocalias/tech.png'
  },
  {
    id: 'demos',
    name: { es: 'Demos', en: 'Demos' },
    description: { 
      es: 'Creación y mantenimiento de demostraciones técnicas impactantes para ferias, eventos y captación de nuevos socios.',
      en: 'Creation and maintenance of impactful technical demonstrations for fairs, events, and recruitment of new members.'
    },
    vocalEmail: 'demos@eurielec.etsit.upm.es',
    image: '/vocalias/tech.png'
  },
  {
    id: 'sudaderas',
    name: { es: 'Sudaderas', en: 'Hoodies' },
    description: { 
      es: 'Diseño, gestión de stock y pedidos de la ropa y merchandising oficial de Eurielec y la escuela.',
      en: 'Design, stock management, and ordering of official Eurielec and school clothing and merchandising.'
    },
    vocalEmail: 'merch@eurielec.etsit.upm.es',
    image: '/vocalias/lifestyle.png'
  },
  {
    id: 'piruletas',
    name: { es: 'Piruletas', en: 'Lollipops' },
    description: { 
      es: 'Gestión del stock de bienvenida y detalles para la sede, asegurando que siempre haya algo dulce para recibir a los socios.',
      en: 'Management of welcome stock and details for the headquarters, ensuring there is always something sweet to welcome members.'
    },
    vocalEmail: 'bienvenida@eurielec.etsit.upm.es',
    image: '/vocalias/lifestyle.png'
  },
  {
    id: 'cena-navidad',
    name: { es: 'Cena de Navidad', en: 'Christmas Dinner' },
    description: { 
      es: 'Organización integral del evento social más importante del año, coordinando logística y reservas para la comunidad.',
      en: 'Comprehensive organization of the most important social event of the year, coordinating logistics and reservations for the community.'
    },
    vocalEmail: 'eventos@eurielec.etsit.upm.es',
    image: '/vocalias/social.png'
  },
  {
    id: 'pr',
    name: { es: 'PR (Public Relations)', en: 'PR (Public Relations)' },
    description: { 
      es: 'Gestión de la imagen externa, redes sociales corporativas y comunicación oficial de la asociación.',
      en: 'Management of the external image, corporate social networks, and official association communication.'
    },
    vocalEmail: 'pr@eurielec.etsit.upm.es',
    image: '/vocalias/social.png'
  },
  {
    id: 'cr',
    name: { es: 'CR (Corporate Relations)', en: 'CR (Corporate Relations)' },
    description: { 
      es: 'Relación directa con empresas, búsqueda de patrocinadores y gestión de convenios corporativos.',
      en: 'Direct relationship with companies, searching for sponsors, and managing corporate agreements.'
    },
    vocalEmail: 'cr@eurielec.etsit.upm.es',
    image: '/vocalias/social.png'
  },
  {
    id: 'hr',
    name: { es: 'HR (Human Resources)', en: 'HR (Human Resources)' },
    description: { 
      es: 'Atención al socio, gestión de altas y bajas, y fomento de la cohesión interna del equipo.',
      en: 'Member support, management of registrations and cancellations, and fostering internal team cohesion.'
    },
    vocalEmail: 'hr@eurielec.etsit.upm.es',
    image: '/vocalias/social.png'
  },
  {
    id: 'nevera',
    name: { es: 'Nevera', en: 'Fridge' },
    description: { 
      es: 'Logística de suministros de comida y bebida en la sede, garantizando el avituallamiento de los socios.',
      en: 'Logistics of food and drink supplies at the headquarters, guaranteeing the replenishment for members.'
    },
    vocalEmail: 'nevera@eurielec.etsit.upm.es',
    image: '/vocalias/lifestyle.png'
  }

];
