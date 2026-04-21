// js/seasons.js — Season calendar page
// toggleMenu() is defined in api.js (shared)

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function loadSeasons() {
  const seasons = await apiGetSeasons();
  renderSeasonCards(seasons);
  renderCalendar();
}

function renderSeasonCards(seasons) {
  const wrap = document.getElementById('seasonCards');
  wrap.innerHTML = seasons.map(s => `
    <div class="season-card">
      <div class="season-card-header">
        <span class="season-emoji">${s.emoji}</span>
        <div>
          <div class="season-name">${s.label} Season</div>
          <div class="season-months">${s.months}</div>
        </div>
        <div class="season-desc">${s.description}</div>
        <div style="text-align:center;margin-left:16px">
          <div class="season-count">${s.crops_count}</div>
          <div class="season-count-label">Crops</div>
        </div>
      </div>
      <div class="season-crops-row">
        ${s.crops.map(c=>`<span class="season-crop-pill">${c.image} ${c.name}</span>`).join('')}
      </div>
    </div>`).join('');
}

async function renderCalendar() {
  const crops = await apiGetCrops();
  const grid = document.getElementById('calendarGrid');

  const legend = `<div class="cal-legend">
    <div class="cal-legend-item"><div class="cal-dot" style="background:rgba(126,200,80,0.5)"></div> Sowing months</div>
    <div class="cal-legend-item"><div class="cal-dot" style="background:rgba(212,176,96,0.5)"></div> Harvest months</div>
  </div>`;

  const header = `<div class="cal-row">
    <div class="cal-label" style="background:var(--surface); border-bottom:1px solid var(--border-h); font-family:'DM Mono',monospace; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted);">Crop</div>
    ${MONTHS.map(m => `<div class="cal-month" style="background:var(--surface); border-bottom:1px solid var(--border-h); font-family:'DM Mono',monospace; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); display:flex; align-items:center; justify-content:center;">${m}</div>`).join('')}
  </div>`;

  const rows = crops.map(c => {
    const months = MONTHS.map((m, i) => {
      const isSow     = c.sowing_months.some(sm => sm.startsWith(m));
      const isHarvest = c.harvest_months.some(hm => hm.startsWith(m));
      const cls       = isSow ? 'sow' : isHarvest ? 'harvest' : '';
      return `<div class="cal-month ${cls}" title="${m}${isSow?' (sow)':isHarvest?' (harvest)':''}">${m}</div>`;
    }).join('');
    return `<div class="cal-row">
      <div class="cal-label">${c.image} ${c.name}</div>
      ${months}
    </div>`;
  }).join('');

  grid.innerHTML = legend + `<div class="cal-wrap"><div class="cal-grid">${header}${rows}</div></div>`;
}

loadSeasons();
