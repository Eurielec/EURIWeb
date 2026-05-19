export type Locale = 'es' | 'en';

export const dictionaries = {
  es: {
    nav: {
      home: 'Inicio',
      about: 'Conócenos',
      board: 'La Junta',
      vocalias: 'Vocalías',
      projects: 'Proyectos',
      events: 'Eventos',
      shop: 'Tienda',
      contact: 'Contacto',
      login: 'Acceso Socios',
      legal: 'Aviso Legal',
      privacy: 'Privacidad',
    },
    home: {
      tag: 'Las inscripciones están abiertas',
      title: 'EURIELEC ETSIT MADRID',
      subtitle: 'Innovación, tecnología y comunidad en un solo lugar. Únete a nosotros y descubre un mundo lleno de eventos y posibilidades.',
      join: 'Únete Ahora',
      sequence: [
        {
          title: 'Conectando Estudiantes en Europa',
          description: 'Nuestra red se extiende por más de 40 universidades tecnológicas, fomentando el intercambio cultural y profesional.',
        },
        {
          title: 'El Epicentro de la Tecnología',
          description: 'Aterrizando en Madrid, un hub creciente para la electrónica, el desarrollo de software y la innovación europea.',
        },
        {
          title: 'ETSIT UPM: Nuestro Hogar',
          description: 'La Escuela Técnica Superior de Ingenieros de Telecomunicación. Donde organizamos, innovamos y desarrollamos todas las actividades de Eurielec. Av. Complutense 30',
        }
      ]
    },
    about: {
      title: 'Conócenos',
      subtitle: 'Descubre desde dónde nos acompañan todos los miembros, qué ideas tenemos acerca del mundo y qué rol desempeñamos en el mismo.',
      mapTitle: 'Mapa de Socios en España',
      eestecTag: 'DIMENSIÓN INTERNACIONAL',
      eestecTitle: 'Presencia en',
      eestecDesc: 'La Asociación Eurielec forma el <strong>Comité Local de EESTEC en Madrid</strong>. Formamos parte de una red de estudiantes de Ingeniería en Telecomunicaciones a lo largo de <strong>más de 40 universidades</strong> punteras en toda Europa y el mundo.',
      eestecHistory: [
        {
          year: '1964',
          title: 'El Legado de EURIELEC',
          desc: 'Nacimos inspirados por la red europea de estudiantes EURIELEC fundada en 1964. Su disolución en 1972 impulsó a estudiantes de toda Europa a refundar la idea en 1986. ¡Conservamos orgullosamente ese nombre original!',
        },
        {
          year: '1986',
          title: 'Fundación de EESTEC',
          desc: 'El 3 de mayo de 1986, estudiantes de 17 países se reunieron en Eindhoven para formalizar la creación de EESTEC, uniendo a futuros ingenieros eléctricos y de telecomunicaciones de toda Europa.',
        },
        {
          year: 'Hitos',
          title: 'Impacto y Hazañas',
          desc: 'Lideramos la formación técnica con el EESTech Challenge (nuestro gran hackathon paneuropeo) y el desarrollo de habilidades blandas a través de workshops internacionales y la Soft Skills Academy.',
        }
      ],
      sections: [
        {
          id: 'quienes-somos',
          title: 'Quiénes Somos',
          subtitle: 'NUESTRO ADN',
          description: 'Somos la Asociación de Estudiantes de Ingeniería en Telecomunicaciones, con sede en la Universidad Politécnica de Madrid. Un punto de encuentro donde la pasión por la tecnología se transforma en proyectos reales, creando un ecosistema de aprendizaje colaborativo que va más allá de las aulas.',
        },
        {
          id: 'mision',
          title: 'Nuestra Misión',
          subtitle: 'LO QUE NOS MUEVE',
          description: 'Nuestra misión es potenciar las habilidades técnicas y blandas de los estudiantes europeos mediante la organización de talleres, hackathons e intercambios internacionales. Queremos acortar la brecha entre la universidad y la industria del hardware y software moderno.',
        },
        {
          id: 'vision',
          title: 'Nuestra Visión',
          subtitle: 'EL FUTURO QUE CONSTRUIMOS',
          description: 'Visualizamos un futuro donde cada estudiante tenga el poder de transformar el mundo a través de la electrónica y la informática. Queremos ser el núcleo principal donde nacen los ingenieros y líderes tecnológicos que definirán el futuro de Europa.',
        }
      ]
    },
    vocalias: {
      title: 'Las Vocalías',
      subtitle: 'Conoce los diferentes departamentos y a los socios responsables que impulsan el día a día de Eurielec.',
      vocalLabel: 'Responsable',
      noVocal: 'Puesto vacante'
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Respuestas inteligentes para perfiles dinámicos.',
      back: 'Volver',
      copy: 'Copiar Email',
      copied: '¡Copiado!',
      steps: {
        who: {
          q: '¿Quién eres?',
          alumno: 'Soy un Alumno',
          empresa: 'Soy una Empresa',
          eestec: 'Soy de EESTEC Int.',
        },
        alumnoType: {
          q: '¿Qué tipo de alumno?',
          normal: 'Alumno UPM / Normal',
          inter: 'Internacional / EESTEC',
        },
        empresaGoal: {
          q: '¿Cuál es tu objetivo?',
          colab: 'Colaborar (Charlas/Visitas)',
          patro: 'Patrocinar (Eventos)',
        },
      },
      results: {
        upm: 'Puedes encontrarnos en la sede (ETSIT A-103.1) o escribirnos por Telegram @eurielec.',
        eestec: 'Para relaciones internacionales o intercambios, contacta con nuestra CP (Contact Person).',
        colab: 'Estamos abiertos a organizar talleres técnicos y visitas a oficinas. Cuéntanos tu propuesta.',
        patro: 'Consulta nuestro dossier de patrocinio para los eventos anuales y visibilidad de marca.',
      }
    },
    calendar: {
      title: 'Calendario de Eventos',
      subtitle: 'Consulta todas las festividades, exámenes y próximas reuniones de la Asociación. ¡Inicia sesión para apuntarte!',
      majorTitle: 'Grandes Hitos',
      majorSubtitle: 'Los eventos que definen el año académico en Eurielec.',
      majorEvents: [
        {
          id: 'imw',
          title: 'IMW (International Motivational Weekend)',
          desc: 'Un fin de semana diseñado para la convivencia internacional, recibiendo a miembros de toda la red EESTEC en Madrid para fomentar el intercambio cultural y la motivación del comité local.'
        },
        {
          id: 'workshop',
          title: 'Workshop EESTEC',
          desc: 'Formación técnica intensiva de una semana. Expertos y socios imparten talleres de vanguardia (IA, electrónica, programación) combinados con actividades sociales y visitas culturales.'
        },
        {
          id: 'eurichallenge',
          title: 'Eurichallenge (Hackathon)',
          desc: 'Nuestra hackathon anual de software y hardware. Equipos de estudiantes compiten durante 24-48h para resolver retos reales planteados por empresas partner.'
        },
        {
          id: 'motivational-days',
          title: 'Motivational Days',
          desc: 'Jornadas locales de team-building, soft skills e integración de nuevos socios. El punto de partida ideal para conocer Eurielec desde dentro.'
        }
      ]
    },
    projects: {
      title: 'Nuestros Proyectos',
      subtitle: 'Descubre el trabajo y las iniciativas que llevamos a cabo internamente desde las diferentes vocalías.'
    },
    shop: {
      title: 'Tienda Eurielec',
      subtitle: 'Consigue el merchandising oficial de la asociación. Sudaderas, forros polares y mucho más.',
      categories: {
        hoodies: 'Sudaderas',
        hoodiesDesc: 'Sudaderas con y sin capucha, forros polares. El outfit oficial de Eurielec.',
        lollipops: 'Piruletas',
        lollipopsDesc: 'Nuestras famosas piruletas personalizadas. ¡El dulce detalle de San Valentín!',
        merch: 'Merchandising',
        merchDesc: 'Tazas, pegatinas, llaveros y más. Lleva Eurielec contigo a todas partes.'
      },
      sizes: 'Tallas',
      order: 'Pedir',
      visitShop: 'Ir a la tienda',
      close: 'Cerrar',
      contactOrder: 'Contactar para pedido'
    },
    error: {
      title: '404',
      subtitle: 'RECURSO NO ENCONTRADO',
      desc: 'El sistema no ha podido localizar el objeto solicitado en este sector de la red.',
      back: 'Volver a la Base',
      terminal: [
        '> ACCEDIENDO A EURIELEC_OS v4.0.4...',
        '> BUSCANDO NODO...',
        '> [ERROR] NODO NO ENCONTRADO.',
        '> INICIANDO PROTOCOLO DE RETORNO...'
      ]
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      board: 'The Board',
      vocalias: 'Departments',
      projects: 'Projects',
      events: 'Events',
      shop: 'Shop',
      contact: 'Contact',
      login: 'Member Login',
      legal: 'Legal Notice',
      privacy: 'Privacy Policy',
    },
    home: {
      tag: 'Registrations are open',
      title: 'Eurielec Association',
      subtitle: 'Innovation, technology, and community in one place. Join us and discover a world full of events and possibilities.',
      join: 'Join Now',
      sequence: [
        {
          title: 'Connecting Students in Europe',
          description: 'Our network spans across more than 40 technological universities, fostering cultural and professional exchange.',
        },
        {
          title: 'The Epicenter of Technology',
          description: 'Landing in Madrid, a growing hub for electronics, software development, and European innovation.',
        },
        {
          title: 'ETSIT UPM: Our Home',
          description: 'The School of Telecommunications Engineering. This is where our free software and hardware ideas come to life. Av. Complutense 30.',
        }
      ]
    },
    about: {
      title: 'About Us',
      subtitle: 'Discover where all the official members and the board of the Eurielec Association join us from.',
      mapTitle: 'Members Map in Spain',
      eestecTag: 'INTERNATIONAL DIMENSION',
      eestecTitle: 'Presence in',
      eestecDesc: 'The Eurielec Association forms the <strong>Local Committee of EESTEC in Madrid</strong>. We are part of a network of Electrical Engineering and Computer Science students across <strong>more than 40 leading universities</strong> throughout Europe and the world.',
      eestecHistory: [
        {
          year: '1964',
          title: 'The EURIELEC Legacy',
          desc: 'We were born inspired by the EURIELEC European student network founded in 1964. Its dissolution in 1972 drove students across Europe to refound the idea in 1986. We proudly preserve that original name!',
        },
        {
          year: '1986',
          title: 'EESTEC Foundation',
          desc: 'On May 3, 1986, students from 17 countries gathered in Eindhoven to formalize EESTEC, uniting future electrical and telecommunication engineers from all over Europe.',
        },
        {
          year: 'Milestones',
          title: 'Impact & Feats',
          desc: 'We lead technical training with the EESTech Challenge (our major pan-European hackathon) and soft-skills development through international workshops and the Soft Skills Academy.',
        }
      ],
      sections: [
        {
          id: 'quienes-somos',
          title: 'Who We Are',
          subtitle: 'OUR DNA',
          description: 'We are the Electrical and Computer Engineering Students Association based at the Technical University of Madrid. A meeting point where the passion for technology transforms into real projects, creating a collaborative learning ecosystem that goes beyond the classrooms.',
        },
        {
          id: 'mision',
          title: 'Our Mission',
          subtitle: 'WHAT DRIVES US',
          description: 'Our mission is to enhance the technical and soft skills of European students through the organization of workshops, hackathons, and international exchanges. We want to bridge the gap between university and the modern hardware and software industry.',
        },
        {
          id: 'vision',
          title: 'Our Vision',
          subtitle: 'THE FUTURE WE BUILD',
          description: 'We envision a future where every student has the power to transform the world through electronics and computer science. We want to be the main core where the engineers and tech leaders who will define the future of Europe are born.',
        }
      ]
    },
    vocalias: {
      title: 'The Departments',
      subtitle: 'Meet the different areas and the members in charge who drive Eurielecs daily activity.',
      vocalLabel: 'In Charge',
      noVocal: 'Vacant position'
    },
    contact: {
      title: 'Contact',
      subtitle: 'Smart answers for dynamic profiles.',
      back: 'Back',
      copy: 'Copy Email',
      copied: 'Copied!',
      steps: {
        who: {
          q: 'Who are you?',
          alumno: 'I am a Student',
          empresa: 'I am a Company',
          eestec: 'I am from EESTEC Int.',
        },
        alumnoType: {
          q: 'What kind of student?',
          normal: 'UPM / Regular Student',
          inter: 'International / EESTEC',
        },
        empresaGoal: {
          q: 'What is your goal?',
          colab: 'Collaborate (Talks/Visits)',
          patro: 'Sponsor (Events)',
        },
      },
      results: {
        upm: 'You can find us at the headquarters (ETSIT A-103.1) or write to us on Telegram @eurielec.',
        eestec: 'For international relations or exchanges, contact our CP (Contact Person).',
        colab: 'We are open to organizing technical workshops and office visits. Tell us your proposal.',
        patro: 'Check our sponsorship dossier for annual events and brand visibility.',
      }
    },
    calendar: {
      title: 'Events Calendar',
      subtitle: 'Check all festivities, exams, and upcoming Association meetings. Log in to sign up!',
      majorTitle: 'Major Milestones',
      majorSubtitle: 'The events that define the academic year at Eurielec.',
      majorEvents: [
        {
          id: 'imw',
          title: 'IMW (International Motivational Weekend)',
          desc: 'A weekend designed for international bonding, welcoming members from the entire EESTEC network to Madrid to foster cultural exchange and local committee motivation.'
        },
        {
          id: 'workshop',
          title: 'EESTEC Workshop',
          desc: 'A week of intensive technical training. Experts and members host cutting-edge workshops (AI, electronics, coding) combined with social activities and cultural visits.'
        },
        {
          id: 'eurichallenge',
          title: 'Eurichallenge (Hackathon)',
          desc: 'Our annual software and hardware hackathon. Student teams compete for 24-48 hours to solve real-world challenges set by partner companies.'
        },
        {
          id: 'motivational-days',
          title: 'Motivational Days',
          desc: 'Local team-building, soft skills workshops, and new member integration. The perfect starting point to discover Eurielec from within.'
        }
      ]
    },
    projects: {
      title: 'Our Projects',
      subtitle: 'Discover the hard work and internal initiatives driven by our different departments.'
    },
    shop: {
      title: 'Eurielec Shop',
      subtitle: 'Get the official association merch. Hoodies, fleece jackets and much more.',
      categories: {
        hoodies: 'Hoodies',
        hoodiesDesc: 'Hoodies with and without hood, fleece jackets. The official Eurielec outfit.',
        lollipops: 'Lollipops',
        lollipopsDesc: 'Our famous custom lollipops. The sweet detail for Valentine\'s Day!',
        merch: 'Merchandising',
        merchDesc: 'Mugs, stickers, keychains and more. Carry Eurielec with you everywhere.'
      },
      sizes: 'Sizes',
      order: 'Order',
      visitShop: 'Visit shop',
      close: 'Close',
      contactOrder: 'Contact to order'
    },
    error: {
      title: '404',
      subtitle: 'RECURSO NO ENCONTRADO',
      desc: 'El sistema no ha podido localizar el objeto solicitado en este sector de la red.',
      back: 'Volver a la Base',
      terminal: [
        '> ACCEDIENDO A EURIELEC_OS v4.0.4...',
        '> BUSCANDO NODO...',
        '> [ERROR] NODO NO ENCONTRADO.',
        '> INICIANDO PROTOCOLO DE RETORNO...'
      ]
    }
  }
};

export type Dictionary = typeof dictionaries.es;
