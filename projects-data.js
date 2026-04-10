/**
 * Portfolio Projects Data Layer — Firebase Firestore
 * Shared between admin.html and index.html
 * All data is stored in Firestore — changes are live for ALL visitors instantly.
 */

// ── Firebase Config ────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAnrTEcoXZxb-cBhAE7-9i6fK3k0-VBXtw",
  authDomain: "hiruna-portfolio.firebaseapp.com",
  projectId: "hiruna-portfolio",
  storageBucket: "hiruna-portfolio.firebasestorage.app",
  messagingSenderId: "674402732767",
  appId: "1:674402732767:web:0ce1c53af586d16fd2f76a"
};

// ── Initialize Firebase (guard against double-init) ───────────────────────
if (!window._firebaseApp) {
  window._firebaseApp = firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const COLLECTION = 'projects';

// ── Default projects (seeded once if Firestore is empty) ───────────────────
const DEFAULT_PROJECTS = [
  {
    id: 'proj-01',
    number: '01',
    title: 'Werde jetzt laut.',
    description: 'Development of a campaign against intimate partner violence, with a focus on raising awareness for male victims and empowering those affected through clear visual communication.',
    category: 'Branding',
    layoutTemplate: 1,
    images: [
      { url: 'assets/projects/poster.png', alt: 'Main Poster', bg: '#f3f4f6', fallback: 'https://images.unsplash.com/photo-1627844642677-8b3e215fa1d2?auto=format&fit=crop&q=80' },
      { url: 'assets/projects/bag.png', alt: 'Bag', bg: '#f8f8f8', fallback: 'https://images.unsplash.com/photo-1597484661747-d35edbe18919?auto=format&fit=crop&q=80' },
      { url: 'assets/projects/spray.png', alt: 'Spray', bg: '#f0f0f0', fallback: 'https://images.unsplash.com/photo-1584824486516-fe547144e5d7?auto=format&fit=crop&q=80' },
      { url: 'assets/projects/magazine.png', alt: 'Magazine', bg: '#e5e7eb', fallback: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'proj-02',
    number: '02',
    title: 'Langhaar',
    description: 'Redesign of the brand Langhaarmädchen, redefining the existing brand identity in a contemporary and cohesive way across all product series.',
    category: 'Packaging',
    layoutTemplate: 2,
    images: [
      { url: 'assets/projects/shampoo.png', alt: 'Shampoo Series', bg: '#faf9f5', fallback: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1615397323675-01bd7bd4a7ea?auto=format&fit=crop&q=80', alt: 'Detail 1', bg: '#fefce8', fallback: '' },
      { url: 'https://images.unsplash.com/photo-1601049541289-9b1b7ce35ee2?auto=format&fit=crop&q=80', alt: 'Detail 2', bg: '#fdf2f8', fallback: '' }
    ]
  },
  {
    id: 'proj-03',
    number: '03',
    title: 'Nexus Analytics',
    description: 'A comprehensive SaaS dashboard redesign focusing on data visualization clarity, reducing cognitive load, and speeding up user workflows.',
    category: 'UI/UX Design',
    layoutTemplate: 3,
    images: [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', alt: 'Dashboard UI', bg: '#f1f5f9', fallback: '' },
      { url: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80', alt: 'Component 1', bg: '#ffffff', fallback: '' },
      { url: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80', alt: 'Component 2', bg: '#ffffff', fallback: '' }
    ]
  },
  {
    id: 'proj-04',
    number: '04',
    title: 'Apex Finance',
    description: 'A minimalist FinTech mobile app creating a frictionless experience for modern banking, investing, and wealth management tracking.',
    category: 'Mobile App',
    layoutTemplate: 4,
    images: [
      { url: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80', alt: 'App Screen 1', bg: '#f8fafc', fallback: '' },
      { url: 'https://images.unsplash.com/photo-1601049541289-9b1b7ce35ee2?auto=format&fit=crop&q=80', alt: 'App Screen 2', bg: '#f8fafc', fallback: '' },
      { url: 'https://images.unsplash.com/photo-1555421689-d28471971485?auto=format&fit=crop&q=80', alt: 'Feature Graphic', bg: '#111827', fallback: '' }
    ]
  },
  {
    id: 'proj-05',
    number: '05',
    title: 'Aurora Brand Sys.',
    description: 'Complete corporate identity and typography guideline designed from the ground up for a progressive energy startup.',
    category: 'Art Direction',
    layoutTemplate: 5,
    images: [
      { url: '', alt: 'Typography Display', bg: '#fffefe', fallback: '' },
      { url: '', alt: 'Brand Badge', bg: '#000000', fallback: '' },
      { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80', alt: 'Brand Identity', bg: '#e5e7eb', fallback: '' }
    ]
  }
];

// ── GET all projects (sorted by number) ────────────────────────────────────
async function getProjects() {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('number').get();
    if (snapshot.empty) {
      // Check if DB was ever initialized before
      const meta = await db.collection('_meta').doc('settings').get();
      if (!meta.exists) {
        // 🆕 Very first run ever — seed defaults and mark as initialized
        await seedDefaults();
        await db.collection('_meta').doc('settings').set({ initialized: true });
        return DEFAULT_PROJECTS;
      }
      // DB is initialized — user just has no projects (they deleted them all)
      return [];
    }
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error('Firestore getProjects error:', e);
    return [];
  }
}

// ── Seed default projects (only called once when DB is empty) ──────────────
async function seedDefaults() {
  const batch = db.batch();
  DEFAULT_PROJECTS.forEach(p => {
    const ref = db.collection(COLLECTION).doc(p.id);
    batch.set(ref, p);
  });
  await batch.commit();
}

// ── ADD a new project ──────────────────────────────────────────────────────
async function addProject(project) {
  const projects = await getProjects();
  project.id = 'proj-' + Date.now();
  project.number = String(projects.length + 1).padStart(2, '0');
  await db.collection(COLLECTION).doc(project.id).set(project);
  return project;
}

// ── UPDATE a project ───────────────────────────────────────────────────────
async function updateProject(id, data) {
  await db.collection(COLLECTION).doc(id).update(data);
}

// ── DELETE a project and renumber ──────────────────────────────────────────
async function deleteProject(id) {
  await db.collection(COLLECTION).doc(id).delete();
  // Renumber remaining projects
  const remaining = await getProjects();
  const batch = db.batch();
  remaining.forEach((p, i) => {
    const ref = db.collection(COLLECTION).doc(p.id);
    batch.update(ref, { number: String(i + 1).padStart(2, '0') });
  });
  await batch.commit();
}

// ── RESET to defaults ──────────────────────────────────────────────────────
async function resetToDefaults() {
  // Delete all existing projects
  const snapshot = await db.collection(COLLECTION).get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  // Also delete the _meta flag so it re-seeds on next getProjects() call
  batch.delete(db.collection('_meta').doc('settings'));
  await batch.commit();
  // Re-seed now
  await seedDefaults();
  await db.collection('_meta').doc('settings').set({ initialized: true });
}

// ── Layout template definitions (unchanged) ───────────────────────────────
const LAYOUT_TEMPLATES = {
  1: {
    name: 'Poster + Details',
    description: '4-column grid — large poster left, 2 detail cells + 1 wide strip',
    slots: 4,
    slotLabels: ['Large Hero (2×2)', 'Detail Top Right', 'Detail Bottom Right', 'Wide Strip Bottom'],
    render(images, containerId) {
      return `
        <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-[200px_200px] md:grid-rows-[300px_250px] gap-0">
          <div class="col-span-2 row-span-2 bento-card overflow-hidden relative" style="background:${images[0]?.bg||'#f3f4f6'}">
            ${images[0]?.url ? `<img src="${images[0].url}" alt="${images[0].alt||''}" class="w-full h-full object-cover bento-img" ${images[0].fallback?`onerror="this.src='${images[0].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-1 bento-card p-4 flex items-center justify-center overflow-hidden" style="background:${images[1]?.bg||'#f8f8f8'}">
            ${images[1]?.url ? `<img src="${images[1].url}" alt="${images[1].alt||''}" class="w-full h-full object-contain bento-img" ${images[1].fallback?`onerror="this.src='${images[1].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-1 bento-card p-4 flex items-center justify-center overflow-hidden" style="background:${images[2]?.bg||'#f0f0f0'}">
            ${images[2]?.url ? `<img src="${images[2].url}" alt="${images[2].alt||''}" class="h-full object-contain bento-img" ${images[2].fallback?`onerror="this.src='${images[2].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-2 row-span-1 bento-card overflow-hidden relative" style="background:${images[3]?.bg||'#e5e7eb'}">
            ${images[3]?.url ? `<img src="${images[3].url}" alt="${images[3].alt||''}" class="w-full h-full object-cover object-top bento-img" ${images[3].fallback?`onerror="this.src='${images[3].fallback}'"`:''}>` : ''}
          </div>
        </div>`;
    }
  },
  2: {
    name: 'Hero + Side Stack',
    description: '3-column grid — large 2×2 hero left, 2 stacked cells right',
    slots: 3,
    slotLabels: ['Large Hero (2×2)', 'Side Top', 'Side Bottom'],
    render(images) {
      return `
        <div class="grid grid-cols-2 md:grid-cols-3 grid-rows-[250px_250px] gap-0">
          <div class="col-span-2 row-span-2 bento-card p-8 flex items-center justify-center overflow-hidden" style="background:${images[0]?.bg||'#faf9f5'}">
            ${images[0]?.url ? `<img src="${images[0].url}" alt="${images[0].alt||''}" class="w-full h-full object-contain bento-img" ${images[0].fallback?`onerror="this.src='${images[0].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-1 bento-card overflow-hidden relative" style="background:${images[1]?.bg||'#fefce8'}">
            ${images[1]?.url ? `<img src="${images[1].url}" alt="${images[1].alt||''}" class="w-full h-full object-cover bento-img" ${images[1].fallback?`onerror="this.src='${images[1].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-1 bento-card overflow-hidden relative" style="background:${images[2]?.bg||'#fdf2f8'}">
            ${images[2]?.url ? `<img src="${images[2].url}" alt="${images[2].alt||''}" class="w-full h-full object-cover bento-img" ${images[2].fallback?`onerror="this.src='${images[2].fallback}'"`:''}>` : ''}
          </div>
        </div>`;
    }
  },
  3: {
    name: 'Wide Main + 2 Cells',
    description: '4-column grid — 3-wide main panel, 2 side cells stacked',
    slots: 3,
    slotLabels: ['Wide Main (3×2)', 'Side Top', 'Side Bottom'],
    render(images) {
      return `
        <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-[250px_200px] gap-0">
          <div class="col-span-2 md:col-span-3 row-span-2 bento-card overflow-hidden relative" style="background:${images[0]?.bg||'#f1f5f9'}">
            ${images[0]?.url ? `<img src="${images[0].url}" alt="${images[0].alt||''}" class="w-full h-full object-cover object-top bento-img" ${images[0].fallback?`onerror="this.src='${images[0].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-1 bento-card p-6 overflow-hidden flex items-center justify-center" style="background:${images[1]?.bg||'#ffffff'}">
            ${images[1]?.url ? `<img src="${images[1].url}" alt="${images[1].alt||''}" class="w-full h-full object-cover bento-img" ${images[1].fallback?`onerror="this.src='${images[1].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-1 bento-card p-6 overflow-hidden flex items-center justify-center" style="background:${images[2]?.bg||'#ffffff'}">
            ${images[2]?.url ? `<img src="${images[2].url}" alt="${images[2].alt||''}" class="w-full h-full object-cover bento-img" ${images[2].fallback?`onerror="this.src='${images[2].fallback}'"`:''}>` : ''}
          </div>
        </div>`;
    }
  },
  4: {
    name: 'Twin Tall + Feature',
    description: '4-column grid — 2 tall portrait cells + 1 wide feature',
    slots: 3,
    slotLabels: ['Left Tall (1×2)', 'Centre Tall (1×2)', 'Right Feature (2×2)'],
    render(images) {
      return `
        <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-[250px_250px] gap-0">
          <div class="col-span-1 row-span-2 bento-card p-6 flex flex-col items-center justify-center overflow-hidden" style="background:${images[0]?.bg||'#f8fafc'}">
            ${images[0]?.url ? `<img src="${images[0].url}" alt="${images[0].alt||''}" class="h-full w-auto object-cover bento-img" ${images[0].fallback?`onerror="this.src='${images[0].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-1 row-span-2 bento-card p-6 flex flex-col items-center justify-center overflow-hidden" style="background:${images[1]?.bg||'#f8fafc'}">
            ${images[1]?.url ? `<img src="${images[1].url}" alt="${images[1].alt||''}" class="h-full w-auto object-cover bento-img" ${images[1].fallback?`onerror="this.src='${images[1].fallback}'"`:''}>` : ''}
          </div>
          <div class="col-span-2 row-span-2 bento-card overflow-hidden relative" style="background:${images[2]?.bg||'#111827'}">
            ${images[2]?.url ? `<img src="${images[2].url}" alt="${images[2].alt||''}" class="w-full h-full object-cover opacity-80 bento-img" ${images[2].fallback?`onerror="this.src='${images[2].fallback}'"`:''}>` : ''}
          </div>
        </div>`;
    }
  },
  5: {
    name: 'Typography + Brand',
    description: '3-column grid — wide type panel, badge cell, full-width strip',
    slots: 3,
    slotLabels: ['Wide Type Panel (2×1)', 'Brand Badge (1×1)', 'Full-Width Strip (3×1)'],
    render(images) {
      return `
        <div class="grid grid-cols-2 md:grid-cols-3 grid-rows-[250px_200px] gap-0">
          <div class="col-span-2 row-span-1 bento-card p-8 overflow-hidden relative flex items-center" style="background:${images[0]?.bg||'#fffefe'}">
            ${images[0]?.url ? `<img src="${images[0].url}" alt="${images[0].alt||''}" class="w-full h-full object-cover bento-img" ${images[0].fallback?`onerror="this.src='${images[0].fallback}'"`:''}>` : '<span class="text-[5rem] font-[900] tracking-tighter leading-none w-full text-center">Aa Ee Rr</span>'}
          </div>
          <div class="col-span-1 row-span-1 bento-card overflow-hidden relative flex items-center justify-center" style="background:${images[1]?.bg||'#000000'}">
            ${images[1]?.url ? `<img src="${images[1].url}" alt="${images[1].alt||''}" class="w-full h-full object-cover bento-img" ${images[1].fallback?`onerror="this.src='${images[1].fallback}'"`:''}>` : '<svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'}
          </div>
          <div class="col-span-3 row-span-1 bento-card overflow-hidden relative" style="background:${images[2]?.bg||'#e5e7eb'}">
            ${images[2]?.url ? `<img src="${images[2].url}" alt="${images[2].alt||''}" class="w-full h-full object-cover object-center bento-img" ${images[2].fallback?`onerror="this.src='${images[2].fallback}'"`:''}>` : ''}
          </div>
        </div>`;
    }
  }
};

function renderProjectHTML(project) {
  const template = LAYOUT_TEMPLATES[project.layoutTemplate] || LAYOUT_TEMPLATES[1];
  return `
    <section class="w-full px-6 md:px-12 lg:px-20 py-12" data-project-id="${project.id}">
      <div class="max-w-[1600px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div class="lg:col-span-4 flex flex-col pt-4">
            <h2 class="text-7xl md:text-8xl lg:text-[7rem] font-[900] tracking-tighter leading-[0.8] mb-12 -ml-1">${project.number}.</h2>
            <div class="mt-auto pb-8 lg:pb-0">
              <h3 class="text-2xl md:text-3xl font-[800] tracking-tight mb-4">${project.title}</h3>
              <p class="text-gray-500 text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-6">${project.description}</p>
              <span class="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-none w-fit">${project.category}</span>
            </div>
          </div>
          <div class="lg:col-span-8">
            ${template.render(project.images || [])}
          </div>
        </div>
      </div>
    </section>`;
}
