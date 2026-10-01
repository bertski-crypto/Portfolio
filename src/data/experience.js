export const practicalExperience = [
  {
    id: 'system-dev',
    number: '01',
    title: 'IT SYSTEM DEVELOPMENT',
    description: 'Built full-stack web applications using React, Node.js/Express, Python/Flask, and PHP/MySQL. Designed database schemas, implemented REST APIs, developed responsive UIs, and integrated authentication (JWT, bcrypt). Applied system workflows, technical documentation, and frontend debugging practices.',
    highlights: [
      'ITSNMP: React/Express/SQLite support portal with RBAC, ticket lifecycle, asset inventory',
      'Immunization System: React/Flask/SQLite with AI risk classification and SMS notifications',
      'Grocery Inventory: PHP/MySQL with FEFO/FIFO batch tracking, POS, and reporting',
      'Calculator: Vanilla JS with Docker containerization and theme persistence',
    ],
    category: 'SYSTEM DEVELOPMENT',
  },
  {
    id: 'it-support',
    number: '02',
    title: 'IT SUPPORT FUNDAMENTALS',
    description: 'Developed practical IT support skills through hands-on system administration, troubleshooting methodology, and user-facing technical assistance. Focus on structured problem-solving and clear documentation.',
    highlights: [
      'Software installation, configuration, and compatibility troubleshooting on Windows',
      'Hardware component identification, basic diagnostics, and peripheral setup',
      'Windows system maintenance: updates, services, event logs, performance monitoring',
      'Structured troubleshooting methodology (identify, hypothesize, test, resolve, document)',
      'Technical documentation for system setup, user guides, and runbooks',
      'User support communication: translating technical concepts for non-technical users',
    ],
    category: 'IT SUPPORT',
  },
  {
    id: 'dev-workflows',
    number: '03',
    title: 'DEVELOPMENT WORKFLOWS & TOOLING',
    description: 'Established professional development practices through consistent Git/GitHub workflows, containerization with Docker, Linux environment management, and project documentation.',
    highlights: [
      'Git: branching strategies, conventional commits, pull requests, merge/rebase',
      'GitHub: repository management, issues, project boards, README documentation',
      'Docker: Dockerfile authoring, multi-stage builds, docker-compose for multi-service apps',
      'Linux: CLI navigation, permissions, package management, service management, shell scripting basics',
      'VS Code: debugging, integrated terminal, extensions, workspace configuration',
      'Project initialization: scaffolding, dependency management, environment configuration',
    ],
    category: 'TOOLS & WORKFLOWS',
  },
  {
    id: 'networking-labs',
    number: '04',
    title: 'NETWORKING LAB PRACTICE',
    description: 'Active hands-on networking labs using Cisco Packet Tracer and Linux VMs. Translating theoretical concepts into repeatable configuration and verification practice.',
    highlights: [
      'IPv4 addressing, subnetting (CIDR/VLSM), and gateway configuration',
      'DHCP scope creation, DNS zone/record management',
      'Static routing, RIP/OSPF basics (planned/in progress)',
      'VLAN creation, 802.1Q trunking, inter-VLAN routing (planned)',
      'Linux networking: iproute2, nmcli, systemd-resolved, ss, tcpdump basics',
      'Troubleshooting methodology across OSI layers with documentation',
    ],
    category: 'NETWORKING',
  },
];

export const education = [
  {
    id: 'degree',
    degree: 'Bachelor of Science in Information Technology',
    school: 'YOUR_UNIVERSITY_NAME',
    location: 'YOUR_CITY, YOUR_COUNTRY',
    period: 'YEAR_START – YEAR_END (Expected Graduation: YEAR)',
    status: 'IN PROGRESS',
    relevantCoursework: [
      'Computer Programming (Java, Python, C)',
      'Web Development (HTML, CSS, JavaScript, PHP)',
      'Database Systems (SQL, MySQL, Database Design)',
      'Computer Networks (TCP/IP, Routing, Switching)',
      'Operating Systems (Linux, Windows Administration)',
      'Information Systems Analysis & Design',
      'Software Engineering',
      'Capstone Project: AI-Powered Child Immunization Monitoring System',
    ],
    notes: 'Replace placeholder values with actual institution details.',
  },
];

// Verified certifications live in their own module. Re-exported here so any
// existing `from './data/experience'` import keeps working.
export { certifications, getVerifiedCertifications } from './certifications';

export const currentlyLearning = [
  {
    topic: 'Advanced Networking (OSPF, BGP, VLANs, Inter-VLAN Routing)',
    status: 'IN PROGRESS',
    resources: ['Cisco Packet Tracer labs', 'CCNA study materials', 'GNS3 (planned)'],
  },
  {
    topic: 'Linux System Administration (systemd, services, logging, automation)',
    status: 'IN PROGRESS',
    resources: ['Ubuntu Server VM', 'Linux Journey', 'The Linux Command Line (book)'],
  },
  {
    topic: 'IT Support Best Practices (ITIL fundamentals, ticketing workflows, SLA concepts)',
    status: 'EXPLORING',
    resources: ['ITIL 4 Foundation materials', 'ITSNMP project implementation'],
  },
  {
    topic: 'Cloud Fundamentals (AWS/Azure basics, deployment, networking)',
    status: 'PLANNED',
    resources: ['AWS Cloud Practitioner / Azure Fundamentals (planned)'],
  },
  {
    topic: 'TypeScript & Advanced React Patterns',
    status: 'PLANNED',
    resources: ['TypeScript Handbook', 'React official docs', 'Project migration (planned)'],
  },
  {
    topic: 'Container Orchestration (Docker Compose → Kubernetes basics)',
    status: 'PLANNED',
    resources: ['Docker Compose (current)', 'Minikube/K3s (planned)'],
  },
];