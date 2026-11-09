/* ==========================================================================
   CAROUSEL COVERS
   Generated SVG cover art keeps the carousel self-contained and on-brand.
   The images are data URIs, so no extra assets or network requests.
   ========================================================================== */

const PROJECT_ACCENTS = {
  lime: '#a3e635',
  blue: '#4da3ff',
  amber: '#f0b866',
  green: '#34d399',
  red: '#fb7185',
};

const STATUS_ACCENTS = {
  COMPLETED: '#34d399',
  'IN PROGRESS': '#4da3ff',
  LEARNING: '#f0b866',
  PLANNED: '#8d99ab',
  NEXT: '#8d99ab',
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const wrapText = (value, maxChars) => {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines;
};

const dataUri = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const coverFrame = (accent, id) => `
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#080b12"/>
      <stop offset="0.55" stop-color="#0c111d"/>
      <stop offset="1" stop-color="#121a2a"/>
    </linearGradient>
    <radialGradient id="${id}-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.26"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="${id}-grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.035"/>
    </pattern>
  </defs>
  <rect width="900" height="600" fill="url(#${id}-bg)"/>
  <rect width="900" height="600" fill="url(#${id}-grid)"/>
  <circle cx="760" cy="170" r="290" fill="url(#${id}-glow)"/>
`;

const footer = (accent, number, label) => `
  <rect x="64" y="540" width="772" height="1" fill="#ffffff" fill-opacity="0.08"/>
  <text x="64" y="574" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" letter-spacing="2.4" fill="#8d99ab">ALBERT.IT / ${escapeXml(label)}</text>
  <text x="836" y="574" text-anchor="end" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" letter-spacing="2.4" fill="${accent}" fill-opacity="0.8">${escapeXml(number)}</text>
`;

const projectCover = (project) => {
  const accent = PROJECT_ACCENTS[project.accent] || '#4da3ff';
  const titleLines = wrapText(project.title, 22).slice(0, 4);
  const statusWidth = Math.max(124, project.status.length * 9 + 36);
  const tech = project.technologies.slice(0, 3).join('  /  ');

  const title = titleLines
    .map(
      (line, index) =>
        `<text x="64" y="${228 + index * 58}" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="700" letter-spacing="-1.5" fill="#f2f5f9">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
    ${coverFrame(accent, `p${project.number}`)}
    <circle cx="760" cy="330" r="172" fill="none" stroke="${accent}" stroke-opacity="0.22" stroke-width="1.5"/>
    <circle cx="760" cy="330" r="118" fill="none" stroke="${accent}" stroke-opacity="0.14" stroke-width="1"/>
    <text x="836" y="176" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="150" font-weight="800" fill="${accent}" fill-opacity="0.12">${escapeXml(project.number)}</text>
    <rect x="64" y="64" width="64" height="4" rx="2" fill="${accent}"/>
    <text x="64" y="112" font-family="'JetBrains Mono', Consolas, monospace" font-size="17" letter-spacing="4" fill="#8d99ab">${escapeXml(project.category)}</text>
    <rect x="64" y="142" width="${statusWidth}" height="30" rx="15" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.42"/>
    <text x="82" y="162" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" letter-spacing="2" fill="${accent}">${escapeXml(project.status)}</text>
    ${title}
    <text x="64" y="510" font-family="'JetBrains Mono', Consolas, monospace" font-size="15" letter-spacing="2" fill="#8d99ab">${escapeXml(tech)}</text>
    <text x="836" y="510" text-anchor="end" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" letter-spacing="2.4" fill="#8d99ab">CASE STUDY</text>
    ${footer(accent, project.number, 'SELECTED WORK')}
  </svg>`;

  return dataUri(svg);
};

const labCover = (lab) => {
  const accent = STATUS_ACCENTS[lab.status] || '#4da3ff';
  const titleLines = wrapText(lab.name, 20).slice(0, 3);
  const summaryLines = wrapText(lab.summary, 48).slice(0, 3);
  const statusWidth = Math.max(124, lab.status.length * 9 + 36);
  const tools = lab.tools.slice(0, 3).join('  /  ');

  const title = titleLines
    .map(
      (line, index) =>
        `<text x="64" y="${228 + index * 56}" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="-1.5" fill="#f2f5f9">${escapeXml(line)}</text>`,
    )
    .join('');

  const summary = summaryLines
    .map(
      (line, index) =>
        `<text x="64" y="${370 + index * 30}" font-family="Inter, Arial, sans-serif" font-size="20" fill="#8d99ab">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
    ${coverFrame(accent, `l${lab.number}`)}
    <text x="836" y="176" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="150" font-weight="800" fill="${accent}" fill-opacity="0.12">${escapeXml(lab.number)}</text>
    <rect x="64" y="64" width="64" height="4" rx="2" fill="${accent}"/>
    <text x="64" y="112" font-family="'JetBrains Mono', Consolas, monospace" font-size="17" letter-spacing="4" fill="#8d99ab">NETWORKING LAB NOTE</text>
    <rect x="64" y="142" width="${statusWidth}" height="30" rx="15" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.42"/>
    <text x="82" y="162" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" letter-spacing="2" fill="${accent}">${escapeXml(lab.status)}</text>
    ${title}
    ${summary}
    <text x="64" y="510" font-family="'JetBrains Mono', Consolas, monospace" font-size="15" letter-spacing="1.6" fill="#8d99ab">${escapeXml(tools)}</text>
    <g stroke="${accent}" stroke-opacity="0.38" stroke-width="1.5">
      <line x1="700" y1="218" x2="800" y2="270"/>
      <line x1="800" y1="270" x2="742" y2="356"/>
      <line x1="742" y1="356" x2="818" y2="420"/>
      <line x1="700" y1="218" x2="742" y2="356"/>
      <line x1="800" y1="270" x2="818" y2="420"/>
    </g>
    <g fill="#0a0e16" stroke="${accent}" stroke-width="2">
      <circle cx="700" cy="218" r="13"/>
      <circle cx="800" cy="270" r="17"/>
      <circle cx="742" cy="356" r="15"/>
      <circle cx="818" cy="420" r="11"/>
    </g>
    <circle cx="800" cy="270" r="5" fill="${accent}"/>
    <circle cx="742" cy="356" r="4" fill="${accent}"/>
    ${footer(accent, lab.number, 'LAB NOTES')}
  </svg>`;

  return dataUri(svg);
};

export const buildProjectCarouselItems = (projects) =>
  projects.map((project) => ({
    id: project.id,
    src: projectCover(project),
    alt: `Cover art for ${project.title}`,
    title: project.title,
    subtitle: project.category,
  }));

export const buildLabCarouselItems = (labs) =>
  labs.map((lab) => ({
    id: lab.id,
    src: labCover(lab),
    alt: `Lab note cover for ${lab.name}`,
    title: lab.name,
    subtitle: lab.status,
  }));
