/**
 * Portfolio Data Layer
 * Contains project configuration, owner details, and data validation.
 * This file is loaded before app.js via deferred script tags.
 */

// Valid category enum values
const VALID_CATEGORIES = ['web', 'tool', 'pwa', 'internal'];

// Project data array
const projects = [
  {
    id: 'tablelink',
    title: 'TableLink',
    subtitle: 'Restaurant Management System',
    description: 'Comprehensive restaurant management system with QR code ordering, real-time analytics, and business dashboard.',
    features: [
      'QR code table ordering',
      'Real-time business analytics',
      'JWT authentication',
      'Admin dashboard with Chart.js visualizations',
      'CSV/Excel export'
    ],
    techStack: {
      backend: ['FastAPI', 'SQLAlchemy'],
      frontend: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
      database: ['SQLite'],
      deployment: []
    },
    languages: { Python: 49, HTML: 20, JavaScript: 18, CSS: 9, Other: 4 },
    category: 'web',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/TableLink',
    liveUrl: null,
    image: null,
    restrictedLabel: null
  },
  {
    id: 'tablelink-platform',
    title: 'TableLink Platform',
    subtitle: 'Multi-Tenant Restaurant & Hotel Management',
    description: 'Multi-tenant platform evolving from restaurant ordering to full hotel management with cyberpunk-styled UI, room management, and photo galleries.',
    features: [
      'Multi-tenant architecture',
      'Client QR code ordering',
      'Real-time dashboard with table status',
      'Excel/PDF menu import',
      'Hotel room management with photo galleries',
      'PostgreSQL for production'
    ],
    techStack: {
      backend: ['FastAPI', 'SQLAlchemy'],
      frontend: ['HTML', 'CSS', 'JavaScript'],
      database: ['PostgreSQL', 'SQLite'],
      deployment: ['Heroku', 'Railway']
    },
    languages: { HTML: 47, Python: 35, JavaScript: 9, CSS: 9 },
    category: 'web',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/tablelink-platform',
    liveUrl: null,
    image: null,
    restrictedLabel: null
  },
  {
    id: 'minore-barbershop',
    title: 'Minore Barbershop',
    subtitle: 'Appointment Booking System',
    description: 'Production appointment booking system for a real barbershop. Features same-day scheduling, email confirmations, revenue tracking, and admin dashboard. Deployed and actively used.',
    features: [
      'QR code access for booking',
      'Same-day appointment scheduling',
      'Email confirmations with cancellation links',
      'Real-time revenue tracking per barber',
      'Client accounts',
      'CI/CD with GitHub Actions',
      'Sentry error monitoring'
    ],
    techStack: {
      backend: ['FastAPI', 'SQLAlchemy'],
      frontend: ['HTML', 'CSS', 'JavaScript'],
      database: ['PostgreSQL'],
      deployment: ['Render', 'GitHub Actions', 'Sentry']
    },
    languages: { Python: 55, HTML: 32, CSS: 11, JavaScript: 2 },
    category: 'web',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/minore-barbershop',
    liveUrl: null,
    image: null,
    restrictedLabel: null
  },
  {
    id: 'modelagency',
    title: 'RED MARBS',
    subtitle: 'Luxury Modeling Agency Platform',
    description: 'Luxury modeling agency platform featuring model portfolios with photo galleries, booking system, and complete admin dashboard. Cloudinary for persistent photo storage.',
    features: [
      'Model directory with advanced filtering',
      'Professional profiles with photo galleries',
      'Direct booking system',
      'Admin dashboard with model management',
      'Cloudinary photo storage',
      'Multi-photo upload'
    ],
    techStack: {
      backend: ['FastAPI', 'SQLAlchemy'],
      frontend: ['HTML', 'CSS', 'JavaScript', 'Bootstrap 5'],
      database: ['PostgreSQL', 'SQLite'],
      deployment: ['Render', 'Cloudinary']
    },
    languages: { HTML: 70, Python: 30 },
    category: 'web',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/modelagency',
    liveUrl: null,
    image: null,
    restrictedLabel: null
  },
  {
    id: 'cargomatecetem',
    title: 'CargoMate',
    subtitle: 'Transport Company Website',
    description: 'Professional business website for a transport and logistics company. Bilingual (Spanish/Romanian) with contact form integration via EmailJS.',
    features: [
      'Bilingual content (ES/RO)',
      'EmailJS contact integration',
      'Responsive mobile-first design',
      'SVG logo and branding',
      'Hamburger mobile menu'
    ],
    techStack: {
      backend: [],
      frontend: ['HTML', 'CSS', 'JavaScript', 'EmailJS'],
      database: [],
      deployment: []
    },
    languages: { JavaScript: 36, HTML: 36, CSS: 17, Other: 11 },
    category: 'web',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/Cargomatecetem',
    liveUrl: null,
    image: null,
    restrictedLabel: null
  },
  {
    id: 'realrunclub',
    title: 'Real Run Club',
    subtitle: 'Running Club PWA',
    description: 'Progressive Web App for a running club community with member management, event tracking, and Heroku deployment with PostgreSQL database.',
    features: [
      'PWA installable on mobile',
      'Member management',
      'Event tracking',
      'PostgreSQL database',
      'Heroku deployment'
    ],
    techStack: {
      backend: ['Node.js'],
      frontend: ['JavaScript'],
      database: ['PostgreSQL'],
      deployment: ['Heroku']
    },
    languages: { JavaScript: 100 },
    category: 'pwa',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/realrunclub',
    liveUrl: null,
    image: null,
    restrictedLabel: null
  },
  {
    id: 'affinity-demo',
    title: 'RelIQ',
    subtitle: 'Relationship Intelligence CRM',
    description: "Working demo of Affinity-style relationship intelligence CRM. Computes relationship strength from communication history using frequency + recency-decay, finds warmest introduction paths via Dijkstra's algorithm. Live GitHub Pages demo available.",
    features: [
      'Relationship strength scoring (0-100)',
      'Cooling relationship detection',
      "Warmest path via Dijkstra's algorithm",
      'Mock email/meeting sync',
      'Static GitHub Pages version with TypeScript engine',
      'No LLM dependency — deterministic math'
    ],
    techStack: {
      backend: ['FastAPI', 'SQLAlchemy'],
      frontend: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      database: ['SQLite'],
      deployment: ['GitHub Pages']
    },
    languages: { TypeScript: 81, Python: 19 },
    category: 'web',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/affinity_demo',
    liveUrl: 'https://lensordr.github.io/affinity_demo/',
    image: null,
    restrictedLabel: null
  },
  {
    id: 'moslaries',
    title: 'Moslaries',
    subtitle: 'AI Calorie & Macro Tracker PWA',
    description: 'Personal AI-assisted calorie and macro tracker PWA. Calculates BMR/TDEE using Mifflin-St Jeor formula, AI meal parsing via Groq API, all data stored locally in IndexedDB. Privacy-first — no server, no uploads.',
    features: [
      'BMR/TDEE calculation (Mifflin-St Jeor)',
      'AI meal parsing via Groq API',
      'Coach chat assistant',
      'Weight trend tracking',
      'IndexedDB local storage',
      'Offline-capable PWA',
      'JSON data export/import'
    ],
    techStack: {
      backend: [],
      frontend: ['JavaScript', 'Vite', 'Tailwind CSS'],
      database: ['IndexedDB'],
      deployment: ['GitHub Pages']
    },
    languages: { JavaScript: 98, HTML: 1, CSS: 1 },
    category: 'pwa',
    isPrivate: false,
    repoUrl: 'https://github.com/lensordr/moslaries',
    liveUrl: 'https://lensordr.github.io/moslaries/',
    image: null,
    restrictedLabel: null
  },
  {
    id: 'datalens',
    title: 'DataLens',
    subtitle: 'Internal Analytics Platform',
    description: 'Full-stack analytics platform for internal data visualization, automated reporting, and AI-powered insights.',
    features: [
      'Analytics dashboards',
      'Automated reporting',
      'AI-powered insights'
    ],
    techStack: {
      backend: ['Django', 'DRF'],
      frontend: ['Next.js', 'TypeScript', 'Tailwind'],
      database: ['DynamoDB', 'S3'],
      deployment: ['AWS Bedrock', 'AWS SES']
    },
    languages: {},
    category: 'internal',
    isPrivate: true,
    repoUrl: null,
    liveUrl: null,
    image: null,
    restrictedLabel: 'Internal Tool — Amazon'
  },
  {
    id: 'foc-report-tool',
    title: 'FOC Report Tool',
    subtitle: 'Automated Report Generator',
    description: 'GUI-based reporting tool that generates formatted HTML reports and sends them via AWS SES to stakeholders.',
    features: [
      'HTML report generation',
      'AWS SES email delivery',
      'GUI interface'
    ],
    techStack: {
      backend: ['Python', 'Pandas'],
      frontend: ['Tkinter'],
      database: [],
      deployment: ['AWS SES']
    },
    languages: {},
    category: 'internal',
    isPrivate: true,
    repoUrl: null,
    liveUrl: null,
    image: null,
    restrictedLabel: 'Internal Tool — Amazon'
  },
  {
    id: 'package-override-helper',
    title: 'Package Override Helper',
    subtitle: 'Logistics Automation',
    description: 'Browser automation tool for streamlining package status override processes in logistics operations.',
    features: [
      'Batch processing',
      'Excel file import',
      'API integration'
    ],
    techStack: {
      backend: [],
      frontend: ['JavaScript', 'Tampermonkey'],
      database: [],
      deployment: []
    },
    languages: {},
    category: 'internal',
    isPrivate: true,
    repoUrl: null,
    liveUrl: null,
    image: null,
    restrictedLabel: 'Internal Tool — Amazon'
  }
];

// Owner configuration
const owner = {
  name: 'Rares Mos',
  title: 'Software Developer',
  company: 'Amazon',
  location: 'Spain',
  bio: 'Software developer at Amazon Spain, building internal tools and full-stack web applications. Passionate about creating efficient solutions — from restaurant management systems and booking platforms to analytics dashboards and automation tools.',
  social: {
    github: 'https://github.com/lensordr',
    linkedin: null,
    email: null
  }
};

/**
 * Validates the projects array against all data layer requirements.
 * @param {Array} projectList - Array of project objects to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 *
 * Checks (Requirements 7.1–7.7):
 *  - Unique kebab-case IDs
 *  - Title max 60 characters, non-empty
 *  - Non-empty description
 *  - At least one non-empty techStack category
 *  - Valid category enum value
 *  - Language percentages sum ≈100 (±2%) when provided
 *  - Private projects: repoUrl null, restrictedLabel non-empty
 */
function validateProjects(projectList) {
  const errors = [];
  const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  const seenIds = new Set();

  for (let i = 0; i < projectList.length; i++) {
    const project = projectList[i];
    const prefix = `Project[${i}] (${project.id || 'unknown'})`;

    // Requirement 7.1: Unique, non-empty, kebab-case ID
    if (!project.id || typeof project.id !== 'string') {
      errors.push(`${prefix}: id must be a non-empty string`);
    } else if (!kebabCaseRegex.test(project.id)) {
      errors.push(`${prefix}: id "${project.id}" is not valid kebab-case`);
    } else if (seenIds.has(project.id)) {
      errors.push(`${prefix}: duplicate id "${project.id}"`);
    } else {
      seenIds.add(project.id);
    }

    // Requirement 7.2: Title non-empty, max 60 chars
    if (!project.title || typeof project.title !== 'string') {
      errors.push(`${prefix}: title must be a non-empty string`);
    } else if (project.title.length > 60) {
      errors.push(`${prefix}: title exceeds 60 characters (${project.title.length})`);
    }

    // Requirement 7.3: Non-empty description
    if (!project.description || typeof project.description !== 'string') {
      errors.push(`${prefix}: description must be a non-empty string`);
    }

    // Requirement 7.4: At least one non-empty techStack category
    if (!project.techStack || typeof project.techStack !== 'object') {
      errors.push(`${prefix}: techStack must be an object`);
    } else {
      const hasNonEmptyCategory = Object.values(project.techStack).some(
        (arr) => Array.isArray(arr) && arr.length > 0
      );
      if (!hasNonEmptyCategory) {
        errors.push(`${prefix}: techStack must have at least one non-empty category`);
      }
    }

    // Requirement 7.7: Valid category enum
    if (!VALID_CATEGORIES.includes(project.category)) {
      errors.push(`${prefix}: category "${project.category}" is not valid (must be one of: ${VALID_CATEGORIES.join(', ')})`);
    }

    // Requirement 7.6: Language percentages sum ≈100 (±2%) when provided
    if (project.languages && typeof project.languages === 'object') {
      const values = Object.values(project.languages);
      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        if (Math.abs(sum - 100) > 2) {
          errors.push(`${prefix}: language percentages sum to ${sum}, expected ~100 (±2%)`);
        }
      }
    }

    // Requirement 7.5: Private project constraints
    if (project.isPrivate === true) {
      if (project.repoUrl !== null) {
        errors.push(`${prefix}: private project must have repoUrl set to null`);
      }
      if (!project.restrictedLabel || typeof project.restrictedLabel !== 'string') {
        errors.push(`${prefix}: private project must have a non-empty restrictedLabel`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Run validation on load (development check)
const validationResult = validateProjects(projects);
if (!validationResult.valid) {
  console.warn('Portfolio data validation errors:', validationResult.errors);
}
