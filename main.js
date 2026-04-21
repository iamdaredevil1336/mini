// main.js — Homepage logic
// toggleMenu() and closeModal() live in api.js (shared across all pages)

function buildCropCard(crop, idx) {
  return `
    <div class="crop-card" onclick="openCropModal(${crop.id})" style="animation-delay:${idx * 0.06}s">
      <span class="crop-emoji">${crop.image}</span>
      <div class="crop-name">${crop.name}</div>
      <div class="crop-desc">${crop.description}</div>
      <div class="crop-meta">
        <span class="tag">${crop.season[0]}</span>
        <span class="tag tag-category">${crop.category.replace('_',' ')}</span>
        <span class="tag tag-water">💧 ${crop.water_requirement}</span>
      </div>
    </div>`;
}

let allCrops = [];

async function loadHomeGrid(season = 'all') {
  const grid = document.getElementById('homeCropGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner">Loading…</div>';
  const filters = season !== 'all' ? { season } : {};
  allCrops = await apiGetCrops(filters);
  grid.innerHTML = allCrops.length
    ? allCrops.map((c, i) => buildCropCard(c, i)).join('')
    : '<div class="empty-state"><span class="empty-state-icon">🌿</span><p>No crops found.</p></div>';
}

function filterBySeason(season, btn) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('pill-active'));
  btn.classList.add('pill-active');
  loadHomeGrid(season);
}

// MODAL (shared detail view)
async function openCropModal(id) {
  const crop = await apiGetCropById(id);
  if (!crop) return;
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  document.getElementById('modalBody').innerHTML = `
    <span class="modal-emoji">${crop.image}</span>
    <div class="modal-title">${crop.name}</div>
    <div class="modal-category">${crop.category.replace('_',' ')} · ${crop.season.join(', ')}</div>
    <p class="modal-desc">${crop.description}</p>
    <div class="modal-tags">
      ${crop.soil_types.map(s=>`<span class="tag">${s}</span>`).join('')}
      <span class="tag tag-water">💧 ${crop.water_requirement} water</span>
      <span class="tag tag-category">⏱ ${crop.duration_days} days</span>
    </div>
    <div class="modal-section">
      <h4>🌱 Seed Information</h4>
      <div class="seed-info-grid">
        <div class="seed-info-item"><div class="seed-info-label">Type</div><div class="seed-info-val">${crop.seeds.type}</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Sowing Depth</div><div class="seed-info-val">${crop.seeds.sowing_depth_cm} cm</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Seed Rate/Acre</div><div class="seed-info-val">${crop.seeds.seed_rate_kg_per_acre}</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Germination</div><div class="seed-info-val">${crop.seeds.germination_days} days</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Spacing</div><div class="seed-info-val">${crop.seeds.spacing_cm}</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Sowing Months</div><div class="seed-info-val">${crop.sowing_months.join(', ')}</div></div>
      </div>
    </div>
    <div class="modal-section">
      <h4>🌿 Care Tips</h4>
      <ul class="care-tips-list">
        ${crop.care_tips.map(t=>`<li>${t}</li>`).join('')}
      </ul>
    </div>`;
  overlay.classList.add('open');
}

// Animated stat counter
function animateCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target) || el.dataset.animated) return;
    el.dataset.animated = '1';
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 35);
  });
}

// Subtle parallax on hero orbs
function heroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const orb1 = document.querySelector('.orb1');
    const orb2 = document.querySelector('.orb2');
    if (orb1) orb1.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
    if (orb2) orb2.style.transform = `translate(${x * -20}px, ${y * -15}px)`;
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  heroParallax();
});
loadHomeGrid();
