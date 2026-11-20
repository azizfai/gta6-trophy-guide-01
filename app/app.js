// Leonida Trophy Guide — tracker over the official 55 GTA VI trophies.
// Progress lives in localStorage; export/import move it as a JSON file.
// Spoiler-free mode hides story trophies until they are earned.
const KEY = 'gta6-trophy-guide-v2';
const SPOILER_KEY = 'gta6-trophy-guide-v2-spoilers';

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const progressEl = document.getElementById('progress');
const barFill = document.getElementById('bar-fill');
const gradeCountsEl = document.getElementById('grade-counts');
const resultCountEl = document.getElementById('result-count');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const missableEl = document.getElementById('missable-only');
const spoilerEl = document.getElementById('spoiler');
const earnedOnlyEl = document.getElementById('earned-only');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set(loadEarned());
let selectedId = trophies[1] ? trophies[1].id : trophies[0].id;
let spoilerFree = localStorage.getItem(SPOILER_KEY) === '1';
spoilerEl.checked = spoilerFree;

function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((n) => trophies.some((t) => t.name === n)) : [];
  } catch {
    return [];
  }
}

function saveEarned() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function isHidden(t) {
  return spoilerFree && t.kind === 'story' && !earned.has(t.name);
}

function gradeBadge(t) {
  return `<span class="badge ${t.grade}">${t.grade}</span>`;
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  progressEl.textContent = `${n} of ${total} earned`;
  barFill.style.width = `${Math.round((n / total) * 100)}%`;
  const byGrade = {};
  for (const t of trophies) {
    if (earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  }
  const totals = {};
  for (const t of trophies) totals[t.grade] = (totals[t.grade] ?? 0) + 1;
  gradeCountsEl.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${byGrade[g] ?? 0}/${totals[g]} ${g}`)
    .join(' · ');
}

function filteredTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (missableEl.checked && !t.missable) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderRows() {
  const list = filteredTrophies();
  rowsEl.replaceChildren();
  for (const t of list) {
    const hidden = isHidden(t);
    const card = document.createElement('article');
    card.className = `card${earned.has(t.name) ? ' earned' : ''}${t.id === selectedId ? ' selected' : ''}`;
    card.tabIndex = 0;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveEarned();
      renderAll();
    });
    const body = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = hidden ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Earn this trophy to reveal its name and description.' : t.description;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `${gradeBadge(t)}<span class="badge kind">${t.kind}</span><span>Stage ${t.stage}</span>`;
    if (t.missable) meta.insertAdjacentHTML('beforeend', '<span class="badge missable">Missable</span>');
    if (t.unconfirmed) meta.insertAdjacentHTML('beforeend', '<span class="badge unconfirmed">Unconfirmed</span>');
    body.append(h, desc, meta);
    const side = document.createElement('span');
    side.className = 'meta';
    side.textContent = earned.has(t.name) ? 'Earned ✓' : '';
    card.append(box, body, side);
    card.addEventListener('click', () => { selectedId = t.id; renderAll(); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') { selectedId = t.id; renderAll(); } });
    rowsEl.append(card);
  }
  resultCountEl.textContent = `${list.length} of ${trophies.length} trophies shown · ${earned.size} earned`;
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId) ?? trophies[0];
  const hidden = isHidden(t);
  detailEl.innerHTML = '';
  const h = document.createElement('h2');
  h.textContent = hidden ? 'Hidden story trophy' : t.name;
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `${gradeBadge(t)}<span class="badge kind">${t.kind}</span><span>Roadmap stage ${t.stage}</span>`;
  if (t.missable) meta.insertAdjacentHTML('beforeend', '<span class="badge missable">Missable</span>');
  if (t.unconfirmed) meta.insertAdjacentHTML('beforeend', '<span class="badge unconfirmed">Unconfirmed</span>');
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = hidden ? 'Turn off spoiler-free mode, or earn this trophy, to see its description and guide.' : t.description;
  detailEl.append(h, meta, desc);
  if (hidden) return;
  if (t.missable) {
    const note = document.createElement('p');
    note.className = 'note';
    note.textContent = 'MISSABLE — one meditation spot is only available in Chapter 1 and vanishes after it. Meditate at every spot you find in Chapter 1 before finishing the chapter.';
    detailEl.append(note);
  }
  if (t.unconfirmed) {
    const warn = document.createElement('p');
    warn.className = 'warn';
    warn.textContent = 'UNCONFIRMED — the official description is too vague to pin a reliable method to. This guide does not invent one; check the cited guides for updates.';
    detailEl.append(warn);
  }
  const gh = document.createElement('h4');
  gh.textContent = 'How to earn it';
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = t.guide;
  const sh = document.createElement('h4');
  sh.textContent = 'Sources';
  const ul = document.createElement('ul');
  for (const s of t.sources) {
    const li = document.createElement('li');
    li.textContent = s;
    ul.append(li);
  }
  detailEl.append(gh, guide, sh, ul);
}

const STAGES = [
  { n: 1, title: 'Stage 1 — Story', note: 'Play the story in order: Chapters 1–4, the named missions, and the final mission. Meditate at every Chapter 1 spot before the chapter ends — that is the one missable trophy. Grab the easy secrets on Ocean Beach and at the bowling alley as you pass them.' },
  { n: 2, title: 'Stage 2 — Heists & duo work', note: 'Finish the stranger and contact mission strands (Andy, Kenton, Billy, Randy, Tyrone and the 8 stranger strands), then the duo trophies with your partner: losing 4-star heat together and the back-to-back shop robberies.' },
  { n: 3, title: 'Stage 3 — Open-world grind', note: 'The long counts: 250 stunts, 42 gold Shooting Range challenges, drone races at all 14 spots, 20 race wins, 18 meditation spots, card sets, 100 WAiNK It spots, 100 vehicles, 52 areas, 5 bank vaults, and the gang operations. Chip away at these between missions.' },
  { n: 4, title: 'Stage 4 — Cleanup & 100%', note: 'Finish the last counts ($250,000 laundered, $100,000 spent, all garages, 10 Scooter Bros registrations), reach 100% completion for the gold, and the platinum pops with it.' },
];

function renderRoadmap() {
  const wrap = document.getElementById('roadmap');
  wrap.replaceChildren();
  for (const s of STAGES) {
    const stageTrophies = trophies.filter((t) => t.stage === s.n);
    const done = stageTrophies.filter((t) => earned.has(t.name)).length;
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = `${s.title} — ${done}/${stageTrophies.length} earned`;
    const p = document.createElement('p');
    p.textContent = s.note;
    const ul = document.createElement('ul');
    for (const t of stageTrophies) {
      const li = document.createElement('li');
      li.textContent = `${earned.has(t.name) ? '✓ ' : ''}${t.name} (${t.grade})${t.missable ? ' — MISSABLE' : ''}${t.unconfirmed ? ' — UNCONFIRMED' : ''}`;
      ul.append(li);
    }
    div.append(h, p, ul);
    wrap.append(div);
  }
}

function renderMissables() {
  const wrap = document.getElementById('missables');
  wrap.replaceChildren();
  const miss = trophies.filter((t) => t.missable);
  const unc = trophies.filter((t) => t.unconfirmed);
  const h1 = document.createElement('h3');
  h1.textContent = 'The one missable trophy';
  wrap.append(h1);
  for (const t of miss) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<div><h3>${t.name} ${gradeBadge(t)}</h3><p class="desc">${t.description}</p><p class="guide">${t.guide}</p></div>`;
    wrap.append(d);
  }
  const p = document.createElement('p');
  p.textContent = 'Every other trophy is earned by playing, grinding a count, or finishing a strand — none of them is locked behind a one-time story moment, as far as the official descriptions show.';
  wrap.append(p);
  const h2 = document.createElement('h3');
  h2.textContent = 'Unconfirmed methods (5)';
  wrap.append(h2);
  for (const t of unc) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<div><h3>${t.name} ${gradeBadge(t)} <span class="badge unconfirmed">Unconfirmed</span></h3><p class="desc">${t.description}</p><p class="guide">${t.guide}</p></div>`;
    wrap.append(d);
  }
}

function showView(name) {
  for (const v of ['guide', 'roadmap', 'missables']) {
    document.getElementById(`view-${v}`).classList.toggle('hidden', v !== name);
    document.getElementById(`tab-${v}`).classList.toggle('active', v === name);
  }
  if (name === 'roadmap') renderRoadmap();
  if (name === 'missables') renderMissables();
}

function renderAll() {
  renderProgress();
  renderRows();
  renderDetail();
}

document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
for (const el of [searchEl, kindEl, gradeEl, missableEl, earnedOnlyEl]) el.addEventListener('input', renderRows);
spoilerEl.addEventListener('change', () => {
  spoilerFree = spoilerEl.checked;
  localStorage.setItem(SPOILER_KEY, spoilerFree ? '1' : '0');
  renderAll();
});

document.getElementById('export').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned] };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const valid = names.filter((n) => trophies.some((t) => t.name === n));
    earned = new Set(valid);
    saveEarned();
    renderAll();
  } catch {
    alert('That file is not a valid trophy progress export.');
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});

// Deep-link support for screenshots and sharing: ?view=roadmap|missables, ?trophy=<id>, ?spoilers=on
const params = new URLSearchParams(location.search);
if (params.get('spoilers') === 'on') {
  spoilerFree = true;
  spoilerEl.checked = true;
  localStorage.setItem(SPOILER_KEY, '1');
}
const tid = Number(params.get('trophy'));
if (tid && trophies.some((t) => t.id === tid)) selectedId = tid;
renderAll();
if (params.get('view') === 'roadmap' || params.get('view') === 'missables') showView(params.get('view'));
