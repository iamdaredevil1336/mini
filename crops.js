// js/crops.js — Crop explorer page
// toggleMenu() and closeModal() are defined in api.js (shared)

let allCrops = [];

function buildCropCard(crop) {
  return `
    <div class="crop-card" onclick="openCropModal(${crop.id})" style="animation-delay:${Math.random()*0.3}s">
      <span class="crop-emoji">${crop.image}</span>
      <div class="crop-name">${crop.name}</div>
      <div class="crop-desc">${crop.description}</div>
      <div class="crop-meta">
        ${crop.season.map(s=>`<span class="tag">${s}</span>`).join('')}
        <span class="tag tag-category">${crop.category.replace('_',' ')}</span>
        <span class="tag tag-water">💧 ${crop.water_requirement}</span>
      </div>
      <div class="crop-card-footer">🌱 Sow: ${crop.sowing_months.slice(0,2).join(', ')} &nbsp;|&nbsp; ⏱ ${crop.duration_days} days</div>
    </div>`;
}

async function loadCrops() {
  allCrops = await apiGetCrops();
  renderCrops(allCrops);
}

function renderCrops(list) {
  const grid = document.getElementById('cropGrid');
  const count = document.getElementById('resultsCount');
  count.textContent = `${list.length} crop${list.length !== 1 ? 's' : ''} found`;
  grid.innerHTML = list.length
    ? list.map(buildCropCard).join('')
    : '<div class="empty-state"><span class="empty-state-icon">🌿</span><p>No crops match your filters. Try clearing some.</p></div>';
}

function applyFilters() {
  const search   = document.getElementById('searchInput').value.toLowerCase();
  const season   = document.getElementById('filterSeason').value;
  const soil     = document.getElementById('filterSoil').value;
  const water    = document.getElementById('filterWater').value;
  const category = document.getElementById('filterCategory').value;
  let r = allCrops;
  if (search)   r = r.filter(c => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search));
  if (season)   r = r.filter(c => c.season.some(s => s === season));
  if (soil)     r = r.filter(c => c.soil_types.some(s => s === soil));
  if (water)    r = r.filter(c => c.water_requirement === water);
  if (category) r = r.filter(c => c.category === category);
  renderCrops(r);
}

function clearFilters() {
  ['searchInput','filterSeason','filterSoil','filterWater','filterCategory'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
  });
  renderCrops(allCrops);
}

async function openCropModal(id) {
  const crop = allCrops.find(c => c.id === id) || await apiGetCropById(id);
  if (!crop) return;
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
        <div class="seed-info-item"><div class="seed-info-label">Seed Type</div><div class="seed-info-val">${crop.seeds.type}</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Sowing Depth</div><div class="seed-info-val">${crop.seeds.sowing_depth_cm} cm</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Seed Rate/Acre</div><div class="seed-info-val">${crop.seeds.seed_rate_kg_per_acre}</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Germination</div><div class="seed-info-val">${crop.seeds.germination_days} days</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Spacing</div><div class="seed-info-val">${crop.seeds.spacing_cm}</div></div>
        <div class="seed-info-item"><div class="seed-info-label">Harvest</div><div class="seed-info-val">${crop.harvest_months.join(', ')}</div></div>
      </div>
    </div>
    <div class="modal-section">
      <h4>🌿 Care Tips</h4>
      <ul class="care-tips-list">${crop.care_tips.map(t=>`<li>${t}</li>`).join('')}</ul>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
}



loadCrops();
