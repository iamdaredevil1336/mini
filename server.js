// ============================================================
//  AgriSystem — REST API Server  (Person 3)
//  Run: node server.js   |   Port: 3000
// ============================================================
const express = require('express');
const cors    = require('cors');
const { crops, seasons, soilTypes } = require('./data');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// ── helpers ─────────────────────────────────────────────────
const ok   = (data, meta = {}) => ({ success: true,  ...meta, data });
const fail = (msg, code = 404) => ({ success: false, error: msg, code });

function filterCrops(q) {
  let r = [...crops];
  if (q.season)   r = r.filter(c => c.season.some(s  => s.toLowerCase()  === q.season.toLowerCase()));
  if (q.soil)     r = r.filter(c => c.soil_types.some(s => s.toLowerCase() === q.soil.toLowerCase()));
  if (q.climate)  r = r.filter(c => c.climate.some(cl => cl.toLowerCase() === q.climate.toLowerCase()));
  if (q.water)    r = r.filter(c => c.water_requirement.toLowerCase() === q.water.toLowerCase());
  if (q.category) r = r.filter(c => c.category.toLowerCase() === q.category.toLowerCase());
  if (q.search) {
    const t = q.search.toLowerCase();
    r = r.filter(c => c.name.toLowerCase().includes(t) || c.description.toLowerCase().includes(t) || c.category.toLowerCase().includes(t));
  }
  return r;
}

// ── routes ───────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/api/crops', (req, res) => {
  const result = filterCrops(req.query);
  if (!result.length) return res.status(404).json(fail('No crops found matching filters.'));
  const summary = result.map(({ id, name, image, category, season, soil_types, climate,
    water_requirement, sowing_months, harvest_months, duration_days, description }) =>
    ({ id, name, image, category, season, soil_types, climate, water_requirement, sowing_months, harvest_months, duration_days, description }));
  res.json(ok(summary, { total: summary.length }));
});

app.get('/api/crops/:id', (req, res) => {
  const crop = crops.find(c => c.id === parseInt(req.params.id));
  if (!crop) return res.status(404).json(fail(`Crop id=${req.params.id} not found.`));
  res.json(ok(crop));
});

app.get('/api/seeds', (req, res) => {
  const filtered = filterCrops(req.query);
  const seeds = filtered.map(c => ({ crop_id: c.id, crop_name: c.name, image: c.image, category: c.category, season: c.season, ...c.seeds }));
  if (!seeds.length) return res.status(404).json(fail('No seeds found.'));
  res.json(ok(seeds, { total: seeds.length }));
});

app.get('/api/seeds/:cropId', (req, res) => {
  const crop = crops.find(c => c.id === parseInt(req.params.cropId));
  if (!crop) return res.status(404).json(fail(`Crop id=${req.params.cropId} not found.`));
  res.json(ok({ crop_id: crop.id, crop_name: crop.name, image: crop.image, care_tips: crop.care_tips,
    sowing_months: crop.sowing_months, harvest_months: crop.harvest_months, ...crop.seeds }));
});

app.get('/api/seasons', (req, res) => {
  const result = seasons.map(s => ({
    ...s,
    crops_count: crops.filter(c => c.season.includes(s.id)).length,
    crops: crops.filter(c => c.season.includes(s.id)).map(c => ({ id: c.id, name: c.name, image: c.image }))
  }));
  res.json(ok(result, { total: result.length }));
});

app.get('/api/soils', (req, res) => {
  const result = soilTypes.map(s => ({
    ...s,
    crops: crops.filter(c => c.soil_types.includes(s.id)).map(c => ({ id: c.id, name: c.name, image: c.image, category: c.category }))
  }));
  res.json(ok(result, { total: result.length }));
});

app.get('/api/categories', (req, res) => {
  const cats = [...new Set(crops.map(c => c.category))];
  const result = cats.map(cat => ({
    id: cat, label: cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    crops_count: crops.filter(c => c.category === cat).length,
    crops: crops.filter(c => c.category === cat).map(c => ({ id: c.id, name: c.name, image: c.image }))
  }));
  res.json(ok(result));
});

app.get('/api/search', (req, res) => {
  const q = req.query.q;
  if (!q?.trim()) return res.status(400).json(fail('Provide ?q=term', 400));
  const result = filterCrops({ search: q });
  if (!result.length) return res.status(404).json(fail(`No results for "${q}"`));
  res.json(ok(result, { total: result.length, query: q }));
});

app.use((req, res) => res.status(404).json(fail(`Route "${req.originalUrl}" not found.`)));

app.listen(PORT, () => console.log(`🌾 AgriSystem API → http://localhost:${PORT}`));
module.exports = app;
