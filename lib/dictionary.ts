export type Language = 'en' | 'es' | 'jp';

export const dictionary = {
  en: {
    navbar: {
      about: "About",
      stack: "Stack",
      works: "Works",
      contact: "Contact",
    },
    hero: {
      role: "Full Stack Developer",
      subtitle: "System Architecture • UI/UX Refined",
    },
    about: {
      title: "Architecture",
      solid_title: "Solid System",
      fluid_title: "Fluid Motion",
      description_1: "Code is the structure. Design is the fluid. I exist in the space between.",
      description_2: "I build digital ecosystems that feel alive. No templates, no shortcuts. Just pure, brutally elegant engineering.",
      bio: "Jorge Medrano. Full Stack Freelancer. Frontend UI/UX Specialist.",
      solid_desc: "Prioritizing robust software architecture isn't a choice; it's a necessity. Every pixel is supported by a calculated structure.",
      fluid_desc: "Code becomes liquid. Using GSAP and WebGL, interfaces breathe and react. Structure implies function; Animation implies life.",
      systems: "Systems",
      scalability: "Scalability",
      eng_approach: "Engineering Approach",
      future_proof: "Future Proof",
      artist_category: "The Artist",
      artist_name: "KamiDev",
      artist_bio: "Code becomes liquid in my hands, transforming ideas into digital experiences that flow with elegance and purpose. I'm Jorge Medrano, known in the digital world as 'KamiDev', a Full Stack developer passionate about creating interfaces that not only work, but also inspire.",
      experience_label: "Experience",
      experience_value: "2+ Years",
      projects_label: "Projects",
      projects_value: "10+ and more incoming",
      status_label: "Status",
      status_value: "Available for Hire"
    },
    stack: {
      category: "Engineering",
      title: "The \nArsenal",
      description: "A curated selection of high-performance tools aimed at building scalable, reactive, and visually fluid applications.",
      items: {
        next: "Core Framework",
        react: "UI Library",
        ts: "Language",
        tailwind: "Styling",
        gsap: "Animation",
        firebase: "Backend / Auth",
        supabase: "SQL Database",
        vertex: "Intelligence",
        python: "Scripting / AI",
        kotlin: "Android",
      }
    },
    works: {
      category: "Selected Works",
      title: "The \nGallery",
      viewCase: "View Case",
      modal: {
        viewLive: "View Live Site",
        viewCode: "View Code",
        challenges: "Challenges",
        solutions: "Solutions",
        technologies: "Technologies",
        features: "Key Features",
        gallery: "Gallery",
      },
      projects: {
        alvinGamesStore: {
          title: "Alvin Games Store",
          category: "E-Commerce",
          desc: "Progressive Web App for video games, consoles, and gaming accessories for the Bolivian market. Features QR payment system, AI-powered receipt verification, and complete admin panel.",
          fullDesc: "Alvin Games Store is a comprehensive e-commerce platform built specifically for the Bolivian gaming market. The platform revolutionizes the local gaming retail experience by combining modern web technologies with AI-powered automation, creating a seamless shopping experience from browsing to payment verification.",
          challenges: [
            "Complex payment ecosystem in Bolivia requiring QR integration with multiple banking systems",
            "Need for automated receipt verification to prevent fraud while maintaining fast order processing",
            "Managing large product catalog with real-time inventory synchronization",
            "Creating intuitive admin dashboard for non-technical staff",
            "Optimizing performance for users with varying internet speeds across Bolivia"
          ],
          solutions: [
            "Implemented multi-bank QR payment gateway with unified API handling multiple banking protocols",
            "Developed custom AI model using Vertex AI for automatic receipt validation with 95% accuracy",
            "Built real-time inventory system with Firebase Firestore and optimistic UI updates",
            "Designed drag-and-drop admin interface with instant preview and bulk operations",
            "Implemented PWA with offline-first architecture and image optimization pipeline"
          ],
          technologies: [
            { name: "Next.js 16", purpose: "Framework for SSR and optimal performance" },
            { name: "TypeScript", purpose: "Type safety and developer experience" },
            { name: "Firebase", purpose: "Real-time database and authentication" },
            { name: "Vertex AI", purpose: "AI-powered receipt verification" },
            { name: "PWA", purpose: "Offline support and app-like experience" },
            { name: "Tailwind CSS", purpose: "Rapid UI development" }
          ],
          features: [
            "Multi-bank QR payment integration",
            "AI-powered receipt verification",
            "Real-time inventory management",
            "Order tracking system",
            "Admin dashboard with analytics",
            "Multi-image product gallery"
          ],
          metrics: [
            { label: "Load Time", value: "< 1.1s" },
            { label: "AI Accuracy", value: "98%" },
            { label: "Products", value: "50+" },
            { label: "Orders/Day", value: "10+" }
          ]
        },
        triadaAi: {
          title: "Triada AI",
          category: "AI SaaS Dashboard",
          desc: "Web application designed to help students 'master any book with the power of AI'. Works as a gamified platform (similar to Duolingo) where you can upload book pages and learn through interactive AI-generated lessons.",
          fullDesc: "Triada AI transforms traditional reading into an interactive, gamified learning experience. By leveraging advanced AI technology, the platform generates personalized lessons from any book, making learning more engaging and effective. Students can track their progress, earn achievements, and learn at their own pace.",
          challenges: [
            "Processing and analyzing various book formats and image qualities",
            "Generating contextually accurate and engaging lesson content from extracted text",
            "Creating adaptive difficulty system that matches student's learning pace",
            "Maintaining user engagement through gamification without compromising educational value",
            "Handling large-scale AI processing while keeping costs manageable"
          ],
          solutions: [
            "Built OCR pipeline with preprocessing for various image conditions and text extraction optimization",
            "Implemented multi-stage AI prompt engineering with Vertex AI for consistent lesson quality",
            "Developed adaptive algorithm analyzing response patterns to adjust difficulty in real-time",
            "Created achievement system with micro-rewards and progress visualization using GSAP animations",
            "Optimized AI calls with caching strategy and batch processing reducing costs by 60%"
          ],
          technologies: [
            { name: "Next.js 16", purpose: "Full-stack framework for app and API" },
            { name: "TypeScript", purpose: "Type-safe development" },
            { name: "Vertex AI", purpose: "Lesson generation and content analysis" },
            { name: "Firebase", purpose: "User data and progress tracking" },
            { name: "Tailwind CSS", purpose: "Responsive UI design" },
            { name: "GSAP", purpose: "Engaging animations and transitions" }
          ],
          features: [
            "Book page upload and OCR processing",
            "AI-generated interactive lessons",
            "Adaptive difficulty system",
            "Progress tracking and analytics",
            "Achievement and reward system",
            "Streak tracking and reminders",
            "Multiple question types (MCQ, fill-in, matching)",
            "Spaced repetition algorithm",
            "Study session history",
            "Performance insights dashboard"
          ],
          metrics: [
            { label: "Accuracy", value: "92%" },
            { label: "Avg. Session", value: "25min" },
            { label: "Retention", value: "78%" },
            { label: "Books", value: "100+" }
          ]
        },
        hadoukenDojo: {
          title: "Hadouken Dojo",
          category: "SaaS Dashboard",
          desc: "Social management platform for Pro-Players affiliated with the Hadouken Dojo Gamer brand. Includes booking system, tournament management, and internal ranking.",
          fullDesc: "Hadouken Dojo is a comprehensive management platform designed for gaming centers and esports communities. It streamlines operations from equipment booking to tournament organization, while fostering community engagement through rankings and social features.",
          challenges: [
            "Managing concurrent booking requests for limited gaming equipment without conflicts",
            "Creating flexible tournament bracket system supporting various game formats",
            "Building real-time ranking system that updates fairly across different game types",
            "Designing intuitive UX for both staff and players with varying technical skills",
            "Handling peak traffic during tournament registrations and live match updates"
          ],
          solutions: [
            "Implemented optimistic locking and queue system for bookings with automatic conflict resolution",
            "Built modular tournament engine supporting single/double elimination, round-robin, and custom formats",
            "Developed ELO-based ranking algorithm with game-specific weight adjustments and decay system",
            "Created role-based interface with contextual navigation adapting to user permissions",
            "Leveraged Supabase real-time subscriptions with connection pooling for scalable live updates"
          ],
          technologies: [
            { name: "React 18", purpose: "Dynamic user interface" },
            { name: "JavaScript", purpose: "Application logic" },
            { name: "Supabase", purpose: "Database and real-time features" },
            { name: "Tailwind CSS", purpose: "Consistent styling system" },
            { name: "React Query", purpose: "Data fetching and caching" }
          ],
          features: [
            "Equipment booking system",
            "Tournament bracket generation",
            "ELO-based ranking system",
            "Player profiles and stats",
            "Real-time match updates",
            "Event calendar",
            "Payment integration",
            "Staff management tools",
            "Automated notifications",
            "Analytics dashboard"
          ],
          metrics: [
            { label: "Active Users", value: "200+" },
            { label: "Tournaments", value: "50+" },
            { label: "Bookings/Week", value: "300+" },
            { label: "Uptime", value: "99.9%" }
          ]
        },
      }
    },
    skills: {
      category: "System Capabilities",
      identity: "IDENTITY",
      role: "ROLE",
      location: "LOCATION",
      languages: "LANGUAGES",
      creative: "CREATIVE_SUITE",
      role_val: "Full Stack Dev // UI/UX Architecture",
      loc_val: "Cyberspace / Remote",
      lang_val: "Español [Native] :: English [C1/Advanced] :: 日本語 [N5/Basic]",
      lines: [
        "Initializing system profile...",
        "Loading neural pathways...",
        "> Subject is a self-taught polymath driven by architectural purity.",
        "> Primary directive: Forge 'Brutally Elegant' digital experiences.",
        "> Specialization: React Ecosystem (Next.js 16) & Motion Graphics (GSAP).",
        "> Status: Available for high-impact contracts."
      ]
    },
    footer: {
      title_1: "Let's",
      title_2: "Build",
      name_ph: "Name",
      email_ph: "Email",
      vision_ph: "Project Vision",
      submit: "Send Transmission",
      loading: "Sending Transmission...",
      success: "Transmitted!",
      successMessage: "Message sent successfully! I'll get back to you soon.",
      validation: {
        name: "Name is required (min 2 characters)",
        email: "Valid email is required",
        message: "Message must be at least 10 characters",
      },
      errors: {
        rateLimit: "Too many requests. Please wait a moment.",
        generic: "Something went wrong. Please try again.",
      },
      copyright: "FULL STACK DEVELOPER",
    },
    preloader: {
      text: "Constructing Reality",
    }
  },
  es: {
    navbar: {
      about: "Sobre Mí",
      stack: "Stack",
      works: "Proyectos",
      contact: "Contacto",
    },
    hero: {
      role: "Desarrollador Full Stack",
      subtitle: "Arquitectura de Sistemas • UI/UX Refinado",
    },
    about: {
      title: "Arquitectura",
      solid_title: "Sistema Sólido",
      fluid_title: "Movimiento Fluido",
      description_1: "El código es la estructura. El diseño es el fluido. Existo en el espacio entre ambos.",
      description_2: "Construyo ecosistemas digitales que se sienten vivos. Sin plantillas, sin atajos. Solo ingeniería brutalmente elegante.",
      bio: "Jorge Medrano. Full Stack Freelancer. Especialista Frontend UI/UX.",
      solid_desc: "Priorizar una arquitectura de software robusta no es una opción; es una necesidad. Cada píxel está soportado por una estructura calculada.",
      fluid_desc: "El código se vuelve líquido. Usando GSAP y WebGL, las interfaces respiran y reaccionan. La estructura implica función; la animación implica vida.",
      systems: "Sistemas",
      scalability: "Escalabilidad",
      eng_approach: "Enfoque de Ingeniería",
      future_proof: "Preparado para el Futuro y lo que venga",
      artist_category: "El Artista",
      artist_name: "KamiDev",
      artist_bio: "El código se vuelve líquido en mis manos, transformando ideas en experiencias digitales que fluyen con elegancia y propósito. Soy Jorge Medrano, conocido en el mundo digital como 'KamiDev', un desarrollador Full Stack apasionado por crear interfaces que no solo funcionan, sino que también inspiran.",
      experience_label: "Experiencia",
      experience_value: "2+ Años",
      projects_label: "Proyectos",
      projects_value: "10+ y más en camino",
      status_label: "Estado",
      status_value: "Disponible para Contratar"
    },
    stack: {
      category: "Ingeniería",
      title: "El \nArsenal",
      description: "Una selección curada de herramientas de alto rendimiento para construir aplicaciones escalables, reactivas y visualmente fluidas.",
      items: {
        next: "Framework Principal",
        react: "Librería UI",
        ts: "Lenguaje",
        tailwind: "Estilos",
        gsap: "Animación",
        firebase: "Backend / Auth",
        supabase: "Base de Datos SQL",
        vertex: "Inteligencia",
        python: "Scripting / IA",
        kotlin: "Android",
      }
    },
    works: {
      category: "Portafolio",
      title: "La \nGalería",
      viewCase: "Ver Caso",
      modal: {
        viewLive: "Ver Sitio en Vivo",
        viewCode: "Ver Código",
        challenges: "Desafíos",
        solutions: "Soluciones",
        technologies: "Tecnologías",
        features: "Características Clave",
        gallery: "Galería",
      },
      projects: {
        alvinGamesStore: {
          title: "Alvin Games Store",
          category: "E-Commerce",
          desc: "E-commerce de videojuegos, consolas y accesorios gaming para el mercado boliviano. Aplicación web progresiva (PWA) con sistema de pagos por QR, verificación automática de comprobantes mediante IA y panel de administración completo.",
          fullDesc: "Alvin Games Store es una plataforma e-commerce integral construida específicamente para el mercado gamer boliviano. La plataforma revoluciona la experiencia de compra local al combinar tecnologías web modernas con automatización impulsada por IA, creando una experiencia de compra fluida desde la navegación hasta la verificación de pagos.",
          challenges: [
            "Ecosistema de pagos complejo en Bolivia requiriendo integración QR con múltiples sistemas bancarios",
            "Necesidad de verificación automática de comprobantes para prevenir fraude manteniendo procesamiento rápido",
            "Gestión de catálogo extenso con sincronización de inventario en tiempo real",
            "Crear dashboard intuitivo para personal no técnico",
            "Optimizar rendimiento para usuarios con velocidades de internet variables en Bolivia"
          ],
          solutions: [
            "Implementé gateway de pagos QR multi-banco con API unificada manejando múltiples protocolos bancarios",
            "Desarrollé modelo IA personalizado con Vertex AI para validación automática de comprobantes con 95% precisión",
            "Construí sistema de inventario en tiempo real con Firebase Firestore y actualizaciones UI optimistas",
            "Diseñé interfaz admin drag-and-drop con preview instantáneo y operaciones en lote",
            "Implementé PWA con arquitectura offline-first y pipeline de optimización de imágenes"
          ],
          technologies: [
            { name: "Next.js 16", purpose: "Framework para SSR y rendimiento óptimo" },
            { name: "TypeScript", purpose: "Seguridad de tipos y experiencia del desarrollador" },
            { name: "Firebase", purpose: "Base de datos en tiempo real y autenticación" },
            { name: "Vertex AI", purpose: "Verificación de comprobantes con IA" },
            { name: "PWA", purpose: "Soporte offline y experiencia tipo app" },
            { name: "Tailwind CSS", purpose: "Desarrollo rápido de UI" }
          ],
          features: [
            "Integración de pagos QR multi-banco",
            "Verificación de comprobantes con IA",
            "Gestión de inventario en tiempo real",
            "Sistema de seguimiento de pedidos",
            "Dashboard admin con analíticas",
            "Notificaciones push para ofertas",
            "Galería multi-imagen de productos"
          ],
          metrics: [
            { label: "Tiempo de Carga", value: "< 1.1s" },
            { label: "Precisión IA", value: "98%" },
            { label: "Productos", value: "50+" },
            { label: "Pedidos/Día", value: "10+" }
          ]
        },
        triadaAi: {
          title: "Triada AI",
          category: "Dashboard SaaS AI",
          desc: "Aplicación web diseñada para ayudar a estudiantes a 'dominar cualquier libro con el poder de la IA'. Funciona como una plataforma gamificada (similar a Duolingo) donde puedes subir páginas de tus libros y aprender de ellos a través de lecciones interactivas generadas por Inteligencia Artificial.",
          fullDesc: "Triada AI transforma la lectura tradicional en una experiencia de aprendizaje interactiva y gamificada. Aprovechando tecnología IA avanzada, la plataforma genera lecciones personalizadas de cualquier libro, haciendo el aprendizaje más atractivo y efectivo. Los estudiantes pueden seguir su progreso, ganar logros y aprender a su propio ritmo.",
          challenges: [
            "Procesar y analizar varios formatos de libros y calidades de imagen",
            "Generar contenido de lecciones contextualmente preciso y atractivo del texto extraído",
            "Crear sistema de dificultad adaptativa que coincida con el ritmo de aprendizaje del estudiante",
            "Mantener engagement del usuario mediante gamificación sin comprometer valor educativo",
            "Manejar procesamiento IA a gran escala manteniendo costos manejables"
          ],
          solutions: [
            "Construí pipeline OCR con preprocesamiento para varias condiciones de imagen y optimización de extracción",
            "Implementé ingeniería de prompts multi-etapa con Vertex AI para calidad consistente de lecciones",
            "Desarrollé algoritmo adaptativo analizando patrones de respuesta para ajustar dificultad en tiempo real",
            "Creé sistema de logros con micro-recompensas y visualización de progreso usando animaciones GSAP",
            "Optimicé llamadas IA con estrategia de caché y procesamiento en lote reduciendo costos en 60%"
          ],
          technologies: [
            { name: "Next.js 16", purpose: "Framework full-stack para app y API" },
            { name: "TypeScript", purpose: "Desarrollo con seguridad de tipos" },
            { name: "Vertex AI", purpose: "Generación de lecciones y análisis de contenido" },
            { name: "Firebase", purpose: "Datos de usuario y seguimiento de progreso" },
            { name: "Tailwind CSS", purpose: "Diseño UI responsive" },
            { name: "GSAP", purpose: "Animaciones y transiciones atractivas" }
          ],
          features: [
            "Carga de páginas de libros y procesamiento OCR",
            "Lecciones interactivas generadas por IA",
            "Sistema de dificultad adaptativa",
            "Seguimiento de progreso y analíticas",
            "Sistema de logros y recompensas",
            "Seguimiento de rachas y recordatorios",
            "Múltiples tipos de preguntas (opción múltiple, completar, emparejar)",
            "Algoritmo de repetición espaciada",
            "Historial de sesiones de estudio",
            "Dashboard de insights de rendimiento"
          ],
          metrics: [
            { label: "Precisión", value: "92%" },
            { label: "Sesión Prom.", value: "25min" },
            { label: "Retención", value: "78%" },
            { label: "Libros", value: "100+" }
          ]
        },
        hadoukenDojo: {
          title: "Hadouken Dojo",
          category: "Dashboard SaaS",
          desc: "Plataforma de gestión social para Pro-Players afiliados a la marca Hadouken Dojo Gamer. Incluye sistema de reservas, gestión de torneos y ranking interno.",
          fullDesc: "Hadouken Dojo es una plataforma de gestión integral diseñada para centros de gaming y comunidades de esports. Optimiza operaciones desde reservas de equipos hasta organización de torneos, mientras fomenta el engagement comunitario mediante rankings y características sociales.",
          challenges: [
            "Gestionar solicitudes de reserva concurrentes para equipos gaming limitados sin conflictos",
            "Crear sistema flexible de brackets de torneos soportando varios formatos de juegos",
            "Construir sistema de ranking en tiempo real que actualice justamente entre diferentes tipos de juegos",
            "Diseñar UX intuitiva para staff y jugadores con habilidades técnicas variables",
            "Manejar tráfico pico durante registros de torneos y actualizaciones de partidas en vivo"
          ],
          solutions: [
            "Implementé bloqueo optimista y sistema de cola para reservas con resolución automática de conflictos",
            "Construí motor de torneos modular soportando eliminación simple/doble, round-robin y formatos custom",
            "Desarrollé algoritmo de ranking basado en ELO con ajustes de peso específicos por juego y sistema de decay",
            "Creé interfaz basada en roles con navegación contextual adaptándose a permisos de usuario",
            "Aproveché suscripciones en tiempo real de Supabase con connection pooling para actualizaciones escalables"
          ],
          technologies: [
            { name: "React 18", purpose: "Interfaz de usuario dinámica" },
            { name: "JavaScript", purpose: "Lógica de aplicación" },
            { name: "Supabase", purpose: "Base de datos y características en tiempo real" },
            { name: "Tailwind CSS", purpose: "Sistema de estilos consistente" },
            { name: "React Query", purpose: "Obtención y caché de datos" }
          ],
          features: [
            "Sistema de reserva de equipos",
            "Generación de brackets de torneos",
            "Sistema de ranking basado en ELO",
            "Perfiles y estadísticas de jugadores",
            "Actualizaciones de partidas en tiempo real",
            "Calendario de eventos",
            "Integración de pagos",
            "Herramientas de gestión de staff",
            "Notificaciones automatizadas",
            "Dashboard de analíticas"
          ],
          metrics: [
            { label: "Usuarios Activos", value: "200+" },
            { label: "Torneos", value: "50+" },
            { label: "Reservas/Semana", value: "300+" },
            { label: "Uptime", value: "99.9%" }
          ]
        },
      }
    },
    skills: {
      category: "Capacidades del Sistema",
      identity: "IDENTIDAD",
      role: "ROL",
      location: "UBICACIÓN",
      languages: "IDIOMAS",
      creative: "SUITE_CREATIVA",
      role_val: "Desarrollador Full Stack // Arquitectura UI/UX",
      loc_val: "Ciberespacio / Remoto",
      lang_val: "Español [Nativo] :: Inglés [C1/Avanzado] :: Japonés [N5/Básico]",
      lines: [
        "Iniciando perfil del sistema...",
        "Cargando redes neuronales...",
        "> Sujeto: Polímata autodidacta impulsado por la pureza arquitectónica.",
        "> Directiva Primaria: Forjar experiencias digitales 'Brutalmente Elegantes'.",
        "> Especialización: Ecosistema React (Next.js 16) & Motion Graphics (GSAP).",
        "> Estado: Disponible para contratos de alto impacto."
      ]
    },
    footer: {
      title_1: "Vamos a",
      title_2: "Crear",
      name_ph: "Nombre",
      email_ph: "Correo",
      vision_ph: "Visión del Proyecto",
      submit: "Enviar Transmisión",
      loading: "Enviando Transmisión...",
      success: "¡Transmitido!",
      successMessage: "¡Mensaje enviado con éxito! Te responderé pronto.",
      validation: {
        name: "El nombre es requerido (mín 2 caracteres)",
        email: "Se requiere un email válido",
        message: "El mensaje debe tener al menos 10 caracteres",
      },
      errors: {
        rateLimit: "Demasiadas solicitudes. Por favor espera un momento.",
        generic: "Algo salió mal. Por favor intenta de nuevo.",
      },
      copyright: "DESARROLLADOR FULL STACK",
    },
    preloader: {
      text: "Construyendo Realidad",
    }
  },
  jp: {
    navbar: {
      about: "私について",
      stack: "技術",
      works: "作品",
      contact: "連絡",
    },
    hero: {
      role: "フルスタック開発者",
      subtitle: "システムアーキテクチャ • 洗練されたUI/UX",
    },
    about: {
      title: "アーキテクチャ",
      solid_title: "強固なシステム",
      fluid_title: "流動的な動き",
      description_1: "コードは構造。デザインは流動体。私はその間に存在する。",
      description_2: "生きているかのようなデジタルエコシステムを構築する。テンプレートなし。近道なし。純粋で洗練されたエンジニアリング。",
      bio: "ホルヘ・メドラノ。フルスタックフリーランサー。UI/UXスペシャリスト。",
      solid_desc: "堅牢なソフトウェアアーキテクチャを優先することは選択ではなく、必要不可欠です。すべてのピクセルは計算された構造によって支えられています。",
      fluid_desc: "コードは液体になる。GSAPとWebGLを使用して、インターフェースは呼吸し、反応する。構造は機能を意味し、アニメーションは生命を意味する。",
      systems: "システム",
      scalability: "スケーラビリティ",
      eng_approach: "エンジニアリングアプローチ",
      future_proof: "将来性",
      artist_category: "アーティスト",
      artist_name: "KamiDev",
      artist_bio: "私の手の中でコードは液体になり、アイデアを優雅さと目的を持って流れるデジタル体験に変えます。私はホルヘ・メドラノ、デジタル世界では「KamiDev」として知られています。機能するだけでなく、インスピレーションを与えるインターフェースを作ることに情熱を持つフルスタック開発者です。",
      experience_label: "経験",
      experience_value: "2年以上",
      projects_label: "プロジェクト",
      projects_value: "10以上、さらに増加中",
      status_label: "ステータス",
      status_value: "採用可能"
    },
    stack: {
      category: "エンジニアリング",
      title: "  \n武器庫",
      description: "スケーラブルでリアクティブ、そして視覚的に流動的なアプリケーションを構築するための高性能ツールの厳選されたセレクション。",
      items: {
        next: "コアフレームワーク",
        react: "UIライブラリ",
        ts: "言語",
        tailwind: "スタイリング",
        gsap: "アニメーション",
        firebase: "バックエンド / 認証",
        supabase: "SQLデータベース",
        vertex: "インテリジェンス",
        python: "スクリプト / AI",
        kotlin: "アンドロイド",
      }
    },
    works: {
      category: "厳選された作品",
      title: "The \nGallery",
      viewCase: "ケースを見る",
      modal: {
        viewLive: "ライブサイトを見る",
        viewCode: "コードを見る",
        challenges: "課題",
        solutions: "解決策",
        technologies: "技術",
        features: "主な機能",
        gallery: "ギャラリー",
      },
      projects: {
        alvinGamesStore: {
          title: "Alvin Games Store",
          category: "電子商取引",
          desc: "ボリビア市場向けのビデオゲーム、コンソール、ゲーミングアクセサリーのプログレッシブウェブアプリ。QR決済システム、AI搭載の領収書検証、完全な管理パネルを搭載。",
          fullDesc: "Alvin Games Storeは、ボリビアのゲーム市場向けに特別に構築された包括的なeコマースプラットフォームです。最新のWeb技術とAI駆動の自動化を組み合わせ、閲覧から支払い確認までシームレスなショッピング体験を提供します。",
          challenges: [
            "複数の銀行システムとのQR統合を必要とするボリビアの複雑な決済エコシステム",
            "不正防止と高速注文処理を両立する自動領収書検証の必要性",
            "リアルタイム在庫同期を伴う大規模な商品カタログ管理",
            "非技術スタッフ向けの直感的な管理ダッシュボードの作成",
            "ボリビア全土の様々なインターネット速度のユーザー向けパフォーマンス最適化"
          ],
          solutions: [
            "複数の銀行プロトコルを処理する統一APIを持つマルチバンクQR決済ゲートウェイを実装",
            "95%の精度で自動領収書検証を行うVertex AIカスタムモデルを開発",
            "Firebase Firestoreと楽観的UI更新によるリアルタイム在庫システムを構築",
            "即時プレビューと一括操作を備えたドラッグ&ドロップ管理インターフェースを設計",
            "オフラインファースト アーキテクチャと画像最適化パイプラインを持つPWAを実装"
          ],
          technologies: [
            { name: "Next.js 16", purpose: "SSRと最適なパフォーマンスのためのフレームワーク" },
            { name: "TypeScript", purpose: "型安全性と開発者体験" },
            { name: "Firebase", purpose: "リアルタイムデータベースと認証" },
            { name: "Vertex AI", purpose: "AI搭載の領収書検証" },
            { name: "PWA", purpose: "オフラインサポートとアプリライクな体験" },
            { name: "Tailwind CSS", purpose: "迅速なUI開発" }
          ],
          features: [
            "マルチバンクQR決済統合",
            "AI搭載の領収書検証",
            "リアルタイム在庫管理",
            "注文追跡システム",
            "分析付き管理ダッシュボード",
            "マルチ画像製品ギャラリー"
          ],
          metrics: [
            { label: "読み込み時間", value: "< 1.1s" },
            { label: "AI精度", value: "98%" },
            { label: "製品数", value: "50+" },
            { label: "注文/日", value: "10+" }
          ]
        },
        triadaAi: {
          title: "Triada AI",
          category: "AI SaaS ダッシュボード",
          desc: "学生が『AIの力であらゆる本をマスター』することを支援するために設計されたウェブアプリケーション。本のページをアップロードし、AIが生成したインタラクティブなレッスンを通じて学習できるゲーム化されたプラットフォーム（Duolingoに似た）として機能します。",
          fullDesc: "Triada AIは、従来の読書をインタラクティブでゲーム化された学習体験に変換します。高度なAI技術を活用して、どんな本からでもパーソナライズされたレッスンを生成し、学習をより魅力的で効果的にします。",
          challenges: [
            "さまざまな本の形式と画像品質の処理と分析",
            "抽出されたテキストから文脈的に正確で魅力的なレッスンコンテンツの生成",
            "学生の学習ペースに合わせた適応難易度システムの作成",
            "教育価値を損なわずにゲーミフィケーションでユーザーエンゲージメントを維持",
            "コストを管理しながら大規模なAI処理を処理"
          ],
          solutions: [
            "さまざまな画像条件とテキスト抽出最適化のための前処理を備えたOCRパイプラインを構築",
            "一貫したレッスン品質のためにVertex AIを使用したマルチステージプロンプトエンジニアリングを実装",
            "応答パターンを分析してリアルタイムで難易度を調整する適応アルゴリズムを開発",
            "マイクロリワードとGSAPアニメーションを使用した進捗の視覚化を持つ達成システムを作成",
            "キャッシング戦略とバッチ処理でAI呼び出しを最適化し、コストを60%削減"
          ],
          technologies: [
            { name: "Next.js 16", purpose: "アプリとAPIのフルスタックフレームワーク" },
            { name: "TypeScript", purpose: "型安全な開発" },
            { name: "Vertex AI", purpose: "レッスン生成とコンテンツ分析" },
            { name: "Firebase", purpose: "ユーザーデータと進捗追跡" },
            { name: "Tailwind CSS", purpose: "レスポンシブUIデザイン" },
            { name: "GSAP", purpose: "魅力的なアニメーションとトランジション" }
          ],
          features: [
            "書籍ページのアップロードとOCR処理",
            "AI生成のインタラクティブレッスン",
            "適応難易度システム",
            "進捗追跡と分析",
            "達成と報酬システム",
            "ストリーク追跡とリマインダー",
            "複数の質問タイプ（多肢選択、穴埋め、マッチング）",
            "間隔反復アルゴリズム",
            "学習セッション履歴",
            "パフォーマンスインサイトダッシュボード"
          ],
          metrics: [
            { label: "精度", value: "92%" },
            { label: "平均セッション", value: "25分" },
            { label: "定着率", value: "78%" },
            { label: "書籍数", value: "100+" }
          ]
        },
        hadoukenDojo: {
          title: "Hadouken Dojo",
          category: "SaaS ダッシュボード",
          desc: "Hadouken Dojo Gamerブランドに所属するプロプレイヤー向けのソーシャル管理プラットフォーム。予約システム、トーナメント管理、内部ランキングを含みます。",
          fullDesc: "Hadouken Dojoは、ゲームセンターとeスポーツコミュニティ向けに設計された包括的な管理プラットフォームです。機器予約からトーナメント運営まで運用を効率化し、ランキングとソーシャル機能でコミュニティエンゲージメントを促進します。",
          challenges: [
            "競合なしで限られたゲーム機器の同時予約リクエストを管理",
            "さまざまなゲーム形式をサポートする柔軟なトーナメントブラケットシステムの作成",
            "異なるゲームタイプ間で公正に更新されるリアルタイムランキングシステムの構築",
            "さまざまな技術スキルを持つスタッフとプレイヤーの両方のための直感的なUXの設計",
            "トーナメント登録とライブマッチ更新中のピークトラフィックの処理"
          ],
          solutions: [
            "自動競合解決を備えた予約のための楽観的ロックとキューシステムを実装",
            "シングル/ダブルエリミネーション、ラウンドロビン、カスタム形式をサポートするモジュール式トーナメントエンジンを構築",
            "ゲーム固有の重み調整と減衰システムを備えたELOベースのランキングアルゴリズムを開発",
            "ユーザー権限に適応するコンテキストナビゲーションを持つロールベースのインターフェースを作成",
            "スケーラブルなライブ更新のためにコネクションプーリングを備えたSupabaseリアルタイムサブスクリプションを活用"
          ],
          technologies: [
            { name: "React 18", purpose: "動的ユーザーインターフェース" },
            { name: "JavaScript", purpose: "アプリケーションロジック" },
            { name: "Supabase", purpose: "データベースとリアルタイム機能" },
            { name: "Tailwind CSS", purpose: "一貫したスタイリングシステム" },
            { name: "React Query", purpose: "データフェッチとキャッシング" }
          ],
          features: [
            "機器予約システム",
            "トーナメントブラケット生成",
            "ELOベースのランキングシステム",
            "プレイヤープロフィールと統計",
            "リアルタイムマッチ更新",
            "イベントカレンダー",
            "支払い統合",
            "スタッフ管理ツール",
            "自動通知",
            "分析ダッシュボード"
          ],
          metrics: [
            { label: "アクティブユーザー", value: "200+" },
            { label: "トーナメント", value: "50+" },
            { label: "予約/週", value: "300+" },
            { label: "稼働時間", value: "99.9%" }
          ]
        },
      }
    },
    skills: {
      category: "システム機能",
      identity: "アイデンティティ",
      role: "役割",
      location: "場所",
      languages: "言語",
      creative: "クリエイティブスイート",
      role_val: "フルスタック開発者 // UI/UXアーキテクチャ",
      loc_val: "サイバースペース / リモート",
      lang_val: "スペイン語 [ネイティブ] :: 英語 [C1/上級] :: 日本語 [N5/基礎]",
      lines: [
        "システムプロファイルの初期化中...",
        "ニューラルパスウェイの読み込み中...",
        "> 被験者は、建築的純粋さに駆り立てられた独学の博学者です。",
        "> プライマリディレクティブ: 「残酷にエレガントな」デジタル体験を構築する。",
        "> 専門分野: Reactエコシステム (Next.js 16) & モーショングラフィックス (GSAP)。",
        "> ステータス: インパクトのある契約のために利用可能。"
      ]
    },
    footer: {
      title_1: "一築",
      title_2: "しよう",
      name_ph: "名前",
      email_ph: "メール",
      vision_ph: "プロジェクトのビジョン",
      submit: "送信",
      loading: "送信中...",
      success: "送信完了！",
      successMessage: "メッセージが正常に送信されました！すぐに返信いたします。",
      validation: {
        name: "名前が必要です（2文字以上）",
        email: "有効なメールアドレスが必要です",
        message: "メッセージは10文字以上必要です",
      },
      errors: {
        rateLimit: "リクエストが多すぎます。しばらくお待ちください。",
        generic: "エラーが発生しました。もう一度お試しください。",
      },
      copyright: "フルスタック開発者",
    },
    preloader: {
      text: "現実を構築中",
    }
  }
}