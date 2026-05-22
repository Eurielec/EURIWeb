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
      archive: 'Archivo',
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
          colab: 'Colaborar (Eventos, productos, etc)',
          patro: 'Patrocinar (Eventos, imagen, publicidad)',
        },
      },
      results: {
        upm: 'Puedes encontrarnos en la sede (ETSIT A-103.1) o escribirnos al correo electrónico eurielec.eestec@gmail.com.',
        eestec: 'Para relaciones internacionales, intercambios y gente proveniente de otros comites locales de EESTEC contacta con nuestra CP (Contact Person).',
        colab: 'Estamos abiertos a colaborar con talleres técnicos, demos, eventos, hackathons y visitas a oficinas. Cuéntanos tu propuesta.',
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
          desc: 'Nuestra hackathon anual de software y hardware. Equipos de estudiantes compiten durante 48-72h para resolver retos reales planteados por empresas partner.'
        },
        {
          id: 'motivational-days',
          title: 'Motivational Days',
          desc: 'Jornadas locales de team-building, soft skills e integración de nuevos socios. El punto de partida ideal para conocer Eurielec desde dentro.'
        },
        {
          id: 'ssa',
          title: 'SSA (Soft Skills Academy)',
          desc: 'Jornadas centradas en el desarrollo de habilidades blandas (como liderazgo, comunicación, negociación o trabajo en equipo) a través de charlas y dinámicas impartidas por formadores certificados.'
        }
      ]
    },
    projects: {
      title: 'Nuestros Proyectos',
      subtitle: 'Descubre el trabajo y las iniciativas que llevamos a cabo internamente desde las diferentes vocalías.',
      emptyTitle: 'AÚN NO HAY PROYECTOS PÚBLICOS',
      emptyDesc: 'Nuestros socios están cocinando ideas impresionantes.'
    },
    shop: {
      title: 'Tienda Eurielec',
      subtitle: 'Consigue el merchandising oficial de la asociación. Sudaderas, forros polares y mucho más.',
      categories: {
        hoodies: 'Sudaderas',
        hoodiesDesc: 'Sudaderas con y sin capucha, forros polares. El outfit oficial de la ETSIT.',
        lollipops: 'Piruletas',
        lollipopsDesc: 'Nuestras famosas piruletas con mensajes personalizadas. ¡El dulce detalle de San Valentín!',
        merch: 'Merchandising',
        merchDesc: 'Tandas de merchandising con productos personalizados de la asociación. Lleva Eurielec contigo a todas partes.'
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
    },
    legal: {
      titlePart1: 'Aviso',
      titlePart2: 'Legal',
      subtitle: 'Transparencia y Marco Jurídico de la Asociación',
      s1Title: '1. Datos Identificativos',
      s1Desc: 'En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos:',
      s1Entity: 'Entidad:',
      s1EntityVal: 'Asociación Eurielec',
      s1HQ: 'Sede:',
      s1HQVal: 'ETSI Industriales UPM, C/ José Gutiérrez Abascal, 2, 28006 Madrid',
      s1Email: 'Email:',
      s1EmailVal: 'info@eurielec.etsii.upm.es',
      s1Scope: 'Ámbito:',
      s1ScopeVal: 'Asociación de Estudiantes sin ánimo de lucro.',
      s2Title: '2. Usuarios',
      s2Desc: 'El acceso y/o uso de este portal de Eurielec atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.',
      s3Title: '3. Uso del Portal',
      s3Desc: 'La web proporciona acceso a multitud de informaciones, servicios, programas o datos en Internet pertenecientes a Eurielec. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.',
      lastUpdate: 'Última actualización: Abril de 2026.'
    },
    privacyPage: {
      titlePart1: 'Políticas de',
      titlePart2: 'Privacidad',
      subtitle: 'Tratamiento de Datos y Protección al Socio',
      s1Title: 'Información Básica sobre Protección de Datos',
      s1Desc: 'De acuerdo con el Reglamento General de Protección de Datos (RGPD), le informamos de que <strong>LC Madrid (Eurielec ETSIT Madrid)</strong> es el responsable del tratamiento de sus datos personales.',
      s1Box1: 'La finalidad del tratamiento de sus datos es la administración de los eventos, actividades y procesos de registro a los que usted se inscriba. Este tratamiento se basa en el <strong>Artículo 6.1 a) del RGPD de la UE</strong>: el interesado dio su consentimiento para el tratamiento de sus datos personales para uno o más fines específicos.',
      s1Box2: 'Le informamos que los datos serán cedidos a terceros como la universidad <strong>"Universidad Politécnica de Madrid" (UPM)</strong>, la <strong>ETSI de Telecomunicación UPM</strong>, socios y patrocinadores, la asociación europea <strong>EESTEC (Electrical Engineering STudents European assoCiation)</strong> y a la justicia si estuviésemos legalmente obligados a ello.',
      s2Title: 'Sus Derechos',
      s2Desc: 'Usted puede acceder, rectificar y cancelar sus datos, así como ejercer otros derechos detallados en los términos y con las limitaciones indicadas en la información adicional. El cumplimiento de cualquier formulario en este sitio web implica que usted acepta todos los términos de la política de RGPD de Eurielec ETSIT Madrid.',
      s3Title: 'Información Adicional',
      s3Desc: 'Para consultar la información detallada y completa sobre nuestra política de protección de datos, puede acceder al siguiente documento oficial:',
      s3Link: 'Consultar Política de Privacidad Extendida (PDF)',
      lastUpdate: 'Última actualización: Abril de 2026.'
    },
    auth: {
      login: {
        titlePart1: 'Acceso',
        titlePart2: 'Socio',
        subtitle: 'Eurielec Central Systems',
        creds: 'Credenciales Eurielec',
        emailPlaceholder: 'socio@eurielec.es',
        code: 'Código de Acceso',
        codePlaceholder: '••••••••',
        alert: 'ALERTA:',
        submitPending: 'Autorizando...',
        submit: 'Entrar en el Sistema',
        google: 'Sincronizar con Google',
        notMember: '¿No eres miembro?',
        registerLink: 'Regístrate'
      },
      register: {
        title: 'Crear Cuenta',
        subtitle: 'Únete a la asociación Eurielec',
        name: 'Nombre Completo',
        namePlaceholder: 'Juan Pérez',
        email: 'Email',
        emailPlaceholder: 'tu@email.com',
        password: 'Contraseña',
        passwordPlaceholder: '••••••••',
        phone: 'Teléfono',
        phonePlaceholder: '+34 600...',
        zipCode: 'Código Postal',
        zipCodePlaceholder: '28001',
        university: 'Escuela (UPM)',
        universityPlaceholder: 'Selecciona tu escuela...',
        year: 'Curso',
        yearPlaceholder: 'Selecciona tu curso...',
        address: 'Dirección Completa (Calle, Piso, Puerta)',
        addressPlaceholder: 'C/ Falsa 123, 4º Derecha',
        city: 'Ciudad',
        cityPlaceholder: 'Madrid',
        province: 'Provincia',
        provincePlaceholder: 'Selecciona tu provincia...',
        submitPending: 'Creando cuenta...',
        submit: 'Registrarse',
        google: 'Continuar con Google',
        hasAccount: '¿Ya tienes cuenta?',
        loginLink: 'Inicia sesión aquí'
      },
      verify: {
        titlePart1: 'Verifica tu',
        titlePart2: 'Email',
        subtitle: 'Hemos enviado un código de 6 dígitos a',
        submitPending: 'Verificando...',
        submit: 'Verificar Cuenta',
        resendWait: 'Reenviar en',
        resend: 'Reenviar código',
        resendSuccess: 'Código reenviado. Revisa tu bandeja de entrada.',
        resendError: 'Error al reenviar.',
        footer: 'El código expira en 15 minutos. Revisa también la carpeta de spam.'
      },
      completeProfile: {
        logoutTitle: 'Cerrar Sesión',
        titlePart1: 'Completa tu',
        titlePart2: 'Perfil',
        subtitle: 'Necesitamos unos datos extra para finalizar tu registro en Eurielec.',
        submitPending: 'Guardando...',
        submit: 'Finalizar Registro'
      }
    },
    profile: {
      title: 'Mi Perfil',
      memberRole: 'Socio Eurielec',
      adminPanel: 'Panel Admin',
      logout: 'Cerrar Sesión',
      assembly: 'Asamblea General',
      assemblyDesc: 'Accede a la sala de votaciones en tiempo real.',
      enterVoting: 'Entrar a Votar',
      accountStatus: 'Estado de la Cuenta',
      id: 'id:',
      role: 'rol:',
      memberLevel: 'Nivel de Socio',
      totalPoints: 'Puntos Totales',
      recentHistory: 'Historial Reciente',
      noHistory: 'Aún no tienes historial de puntos. ¡Participa en eventos!',
      calendarTitle: 'Tu Calendario',
      calendarDesc: 'Haz clic en los eventos de la Asociación (Rojos) para gestionar tu asistencia.'
    },
    imwPayment: {
      title: 'Pago IMW',
      paid: 'Pagado',
      pendingCash: 'Has indicado que pagarás en efectivo. Acércate a la asociación para abonarlo.',
      payCard: 'Pagar con Tarjeta',
      payCash: 'Pagar en Efectivo',
      errorInit: 'Error al iniciar pago',
      errorUpdate: 'Pago realizado, pero hubo un error al actualizar tu estado.',
      errorCancel: 'El pago ha sido cancelado o rechazado.',
      errorLoad: 'Error al cargar la pasarela de pago',
      errorNet: 'Error de red'
    },
    editProfile: {
      personalInfo: 'Información Personal',
      editData: 'Editar Datos',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      notSpecified: 'No especificado',
      address: 'Dirección Exacta',
      location: 'Ubicación Registrada',
      school: 'Escuela (UPM)',
      year: 'Curso',
      logistics: 'Logística de Eventos',
      editLogistics: 'Editar Logística',
      dietary: 'Alimentación',
      allergies: 'Alergias:',
      tshirt: 'Talla de Camiseta',
      alcohol: 'Bebida Frecuente',
      car: 'Vehículo Propio',
      hasCar: 'Sí (Aporta coche)',
      noCar: 'No tiene'
    },
    board: {
      team: 'NUESTRO EQUIPO',
      title: 'Gobernanza y Visión',
      description: 'La Junta Directiva es el motor estratégico de Eurielec. Como órgano de gobierno, coordinamos la visión a largo plazo, supervisamos la salud financiera y garantizamos que cada socio tenga las herramientas necesarias para crecer. Nuestra gobernanza se basa en la transparencia, el liderazgo distribuido y la pasión por la tecnología que nos une a todos.',
      tags: ['Transparencia', 'Estrategia', 'Comunidad'],
      selectMember: '— SELECCIONA UN MIEMBRO —'
    },
    archive: {
      tag: 'Eurielec Repository',
      titlePart1: 'Archivo',
      titlePart2: '& Transparencia',
      desc: 'Consulta los documentos oficiales, protocolos y el estado de cuentas de la asociación. Navega a través de las carpetas digitales de Eurielec.',
      categories: {
        transparencia: 'Portal de Transparencia',
        actas: 'Actas de Junta',
        protocolos: 'Protocolos y Normativa',
        cuentas: 'Cuentas y Presupuestos',
        personal: 'Personal y Equipo',
        otros: 'Otros Documentos'
      },
      docsCount: 'Documentos',
      empty: 'No hay archivos en esta sección',
      searchTitle: '¿Buscas algo específico?',
      searchDesc: 'Si necesitas un documento que no figura en esta lista o tienes alguna duda sobre la gestión de la asociación, no dudes en contactar directamente con la Junta Directiva.',
      contactBtn: 'Contactar con Administración'
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
      archive: 'Archive',
      contact: 'Contact',
      login: 'Member Login',
      legal: 'Legal Notice',
      privacy: 'Privacy',
    },
    home: {
      tag: 'Registrations are open',
      title: 'EURIELEC ETSIT MADRID',
      subtitle: 'Innovation, technology, and community all in one place. Join us and discover a world full of events and possibilities.',
      join: 'Join Now',
      sequence: [
        {
          title: 'Connecting Students in Europe',
          description: 'Our network spans over 40 technological universities, fostering cultural and professional exchange.',
        },
        {
          title: 'The Epicenter of Technology',
          description: 'Landing in Madrid, a growing hub for electronics, software development, and European innovation.',
        },
        {
          title: 'ETSIT UPM: Our Home',
          description: 'The School of Telecommunications Engineering. Where we organize, innovate, and develop all of Eurielec\'s activities. Av. Complutense 30',
        }
      ]
    },
    about: {
      title: 'About Us',
      subtitle: 'Discover where all the members join us from, our ideas about the world, and the role we play in it.',
      mapTitle: 'Members Map in Spain',
      eestecTag: 'INTERNATIONAL DIMENSION',
      eestecTitle: 'Presence in',
      eestecDesc: 'The Eurielec Association forms the <strong>Local Committee of EESTEC in Madrid</strong>. We are part of a network of Telecommunications Engineering students across <strong>more than 40 leading universities</strong> throughout Europe and the world.',
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
          desc: 'We lead technical training with the EESTech Challenge (our major pan-European hackathon) and soft skills development through international workshops and the Soft Skills Academy.',
        }
      ],
      sections: [
        {
          id: 'quienes-somos',
          title: 'Who We Are',
          subtitle: 'OUR DNA',
          description: 'We are the Telecommunications Engineering Students Association, based at the Technical University of Madrid (UPM). A meeting point where the passion for technology transforms into real projects, creating a collaborative learning ecosystem that goes beyond the classrooms.',
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
      subtitle: 'Meet the different departments and the members in charge who drive Eurielec\'s daily activity.',
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
          colab: 'Collaborate (Events, products, etc)',
          patro: 'Sponsor (Events, image, advertising)',
        },
      },
      results: {
        upm: 'You can find us at the headquarters (ETSIT A-103.1) or write to our email eurielec.eestec@gmail.com.',
        eestec: 'For international relations, exchanges, and people coming from other EESTEC local committees, contact our CP (Contact Person).',
        colab: 'We are open to collaborating on technical workshops, demos, events, hackathons, and office visits. Tell us your proposal.',
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
          desc: 'Our annual software and hardware hackathon. Student teams compete for 48-72 hours to solve real-world challenges set by partner companies.'
        },
        {
          id: 'motivational-days',
          title: 'Motivational Days',
          desc: 'Local team-building days, soft skills, and new member integration. The perfect starting point to discover Eurielec from within.'
        },
        {
          id: 'ssa',
          title: 'SSA (Soft Skills Academy)',
          desc: 'Days focused on developing soft skills (such as leadership, communication, negotiation, or teamwork) through talks and dynamics delivered by certified trainers.'
        }
      ]
    },
    projects: {
      title: 'Our Projects',
      subtitle: 'Discover the work and internal initiatives driven by our different departments.',
      emptyTitle: 'NO PUBLIC PROJECTS YET',
      emptyDesc: 'Our members are cooking up some amazing ideas.'
    },
    shop: {
      title: 'Eurielec Shop',
      subtitle: 'Get the official association merchandise. Hoodies, fleece jackets and much more.',
      categories: {
        hoodies: 'Hoodies',
        hoodiesDesc: 'Hoodies with and without hood, fleece jackets. The official ETSIT outfit.',
        lollipops: 'Lollipops',
        lollipopsDesc: 'Our famous custom lollipops with messages. The sweet detail for Valentine\'s Day!',
        merch: 'Merchandise',
        merchDesc: 'Batches of personalized association merchandise. Carry Eurielec with you everywhere.'
      },
      sizes: 'Sizes',
      order: 'Order',
      visitShop: 'Go to shop',
      close: 'Close',
      contactOrder: 'Contact to order'
    },
    error: {
      title: '404',
      subtitle: 'RESOURCE NOT FOUND',
      desc: 'The system could not locate the requested object in this sector of the network.',
      back: 'Return to Base',
      terminal: [
        '> ACCESSING EURIELEC_OS v4.0.4...',
        '> SEARCHING NODE...',
        '> [ERROR] NODE NOT FOUND.',
        '> INITIATING RETURN PROTOCOL...'
      ]
    },
    legal: {
      titlePart1: 'Legal',
      titlePart2: 'Notice',
      subtitle: 'Transparency and Legal Framework of the Association',
      s1Title: '1. Identification Data',
      s1Desc: 'In compliance with the duty of information contained in article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce, the following data are reflected below:',
      s1Entity: 'Entity:',
      s1EntityVal: 'Eurielec Association',
      s1HQ: 'Headquarters:',
      s1HQVal: 'ETSI Industriales UPM, C/ José Gutiérrez Abascal, 2, 28006 Madrid',
      s1Email: 'Email:',
      s1EmailVal: 'info@eurielec.etsii.upm.es',
      s1Scope: 'Scope:',
      s1ScopeVal: 'Non-profit Student Association.',
      s2Title: '2. Users',
      s2Desc: 'Access and/or use of this Eurielec portal attributes the condition of USER, who accepts, from said access and/or use, the General Conditions of Use reflected here.',
      s3Title: '3. Use of the Portal',
      s3Desc: 'The website provides access to a multitude of information, services, programs or data on the Internet belonging to Eurielec. The USER assumes responsibility for the use of the portal. This responsibility extends to the registration that is necessary to access certain services or content.',
      lastUpdate: 'Last updated: April 2026.'
    },
    privacyPage: {
      titlePart1: 'Privacy',
      titlePart2: 'Policy',
      subtitle: 'Data Processing and Member Protection',
      s1Title: 'Basic Information on Data Protection',
      s1Desc: 'In accordance with the General Data Protection Regulation (GDPR), we inform you that <strong>LC Madrid (Eurielec ETSIT Madrid)</strong> is responsible for processing your personal data.',
      s1Box1: 'The purpose of processing your data is the administration of events, activities, and registration processes you sign up for. This processing is based on <strong>Article 6.1 a) of the EU GDPR</strong>: the data subject has given consent to the processing of their personal data for one or more specific purposes.',
      s1Box2: 'We inform you that the data will be transferred to third parties such as the university <strong>"Universidad Politécnica de Madrid" (UPM)</strong>, the <strong>ETSI de Telecomunicación UPM</strong>, partners and sponsors, the European association <strong>EESTEC (Electrical Engineering STudents European assoCiation)</strong>, and to the justice system if we are legally obliged to do so.',
      s2Title: 'Your Rights',
      s2Desc: 'You can access, rectify, and cancel your data, as well as exercise other rights detailed in the terms and with the limitations indicated in the additional information. The completion of any form on this website implies that you accept all the terms of the Eurielec ETSIT Madrid GDPR policy.',
      s3Title: 'Additional Information',
      s3Desc: 'To consult detailed and complete information about our data protection policy, you can access the following official document:',
      s3Link: 'View Extended Privacy Policy (PDF)',
      lastUpdate: 'Last updated: April 2026.'
    },
    auth: {
      login: {
        titlePart1: 'Member',
        titlePart2: 'Login',
        subtitle: 'Eurielec Central Systems',
        creds: 'Eurielec Credentials',
        emailPlaceholder: 'member@eurielec.es',
        code: 'Access Code',
        codePlaceholder: '••••••••',
        alert: 'ALERT:',
        submitPending: 'Authorizing...',
        submit: 'Enter System',
        google: 'Sync with Google',
        notMember: 'Not a member?',
        registerLink: 'Sign Up'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join the Eurielec association',
        name: 'Full Name',
        namePlaceholder: 'John Doe',
        email: 'Email',
        emailPlaceholder: 'you@email.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        phone: 'Phone',
        phonePlaceholder: '+34 600...',
        zipCode: 'Zip Code',
        zipCodePlaceholder: '28001',
        university: 'School (UPM)',
        universityPlaceholder: 'Select your school...',
        year: 'Academic Year',
        yearPlaceholder: 'Select your year...',
        address: 'Full Address (Street, Floor, Door)',
        addressPlaceholder: 'Fake St 123, 4th Right',
        city: 'City',
        cityPlaceholder: 'Madrid',
        province: 'Province',
        provincePlaceholder: 'Select your province...',
        submitPending: 'Creating account...',
        submit: 'Register',
        google: 'Continue with Google',
        hasAccount: 'Already have an account?',
        loginLink: 'Log in here'
      },
      verify: {
        titlePart1: 'Verify your',
        titlePart2: 'Email',
        subtitle: 'We have sent a 6-digit code to',
        submitPending: 'Verifying...',
        submit: 'Verify Account',
        resendWait: 'Resend in',
        resend: 'Resend code',
        resendSuccess: 'Code resent. Check your inbox.',
        resendError: 'Error resending.',
        footer: 'The code expires in 15 minutes. Please check your spam folder as well.'
      },
      completeProfile: {
        logoutTitle: 'Log Out',
        titlePart1: 'Complete your',
        titlePart2: 'Profile',
        subtitle: 'We need some extra data to finish your Eurielec registration.',
        submitPending: 'Saving...',
        submit: 'Finish Registration'
      }
    },
    profile: {
      title: 'My Profile',
      memberRole: 'Eurielec Member',
      adminPanel: 'Admin Panel',
      logout: 'Log Out',
      assembly: 'General Assembly',
      assemblyDesc: 'Access the voting room in real-time.',
      enterVoting: 'Enter Voting',
      accountStatus: 'Account Status',
      id: 'id:',
      role: 'role:',
      memberLevel: 'Member Level',
      totalPoints: 'Total Points',
      recentHistory: 'Recent History',
      noHistory: "You don't have a points history yet. Participate in events!",
      calendarTitle: 'Your Calendar',
      calendarDesc: 'Click on Association events (Red) to manage your attendance.'
    },
    imwPayment: {
      title: 'IMW Payment',
      paid: 'Paid',
      pendingCash: 'You have indicated that you will pay in cash. Please visit the association to pay.',
      payCard: 'Pay with Card',
      payCash: 'Pay in Cash',
      errorInit: 'Error initiating payment',
      errorUpdate: 'Payment successful, but there was an error updating your status.',
      errorCancel: 'The payment was canceled or declined.',
      errorLoad: 'Error loading the payment gateway',
      errorNet: 'Network error'
    },
    editProfile: {
      personalInfo: 'Personal Information',
      editData: 'Edit Data',
      email: 'Email Address',
      phone: 'Phone',
      notSpecified: 'Not specified',
      address: 'Exact Address',
      location: 'Registered Location',
      school: 'School (UPM)',
      year: 'Academic Year',
      logistics: 'Event Logistics',
      editLogistics: 'Edit Logistics',
      dietary: 'Dietary Needs',
      allergies: 'Allergies:',
      tshirt: 'T-Shirt Size',
      alcohol: 'Frequent Drink',
      car: 'Own Vehicle',
      hasCar: 'Yes (Provides car)',
      noCar: 'None'
    },
    board: {
      team: 'OUR TEAM',
      title: 'Governance and Vision',
      description: 'The Board of Directors is the strategic engine of Eurielec. As a governing body, we coordinate the long-term vision, oversee financial health, and ensure that each member has the necessary tools to grow. Our governance is based on transparency, distributed leadership, and the passion for technology that unites us all.',
      tags: ['Transparency', 'Strategy', 'Community'],
      selectMember: '— SELECT A MEMBER —'
    },
    archive: {
      tag: 'Eurielec Repository',
      titlePart1: 'Archive',
      titlePart2: '& Transparency',
      desc: 'Consult the official documents, protocols, and the financial status of the association. Browse through Eurielec\'s digital folders.',
      categories: {
        transparencia: 'Transparency Portal',
        actas: 'Board Minutes',
        protocolos: 'Protocols and Regulations',
        cuentas: 'Accounts and Budgets',
        personal: 'Staff and Team',
        otros: 'Other Documents'
      },
      docsCount: 'Documents',
      empty: 'There are no files in this section',
      searchTitle: 'Looking for something specific?',
      searchDesc: 'If you need a document that is not on this list or have any questions about the association\'s management, feel free to contact the Board of Directors directly.',
      contactBtn: 'Contact Administration'
    }
  }
};

export type Dictionary = typeof dictionaries.es;
