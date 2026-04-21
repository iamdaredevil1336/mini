// js/seeds.js — Seed guide page
// toggleMenu() is defined in api.js (shared)

const i18n = {
  en: {
    seed_guide_title: "🌱 Seed Guide",
    seed_guide_sub: "Sowing depth, seed rates, germination time & spacing for every crop",
    search_seeds: "Search seeds…",
    th_crop: "Crop",
    th_type: "Seed Type",
    th_depth: "Sowing Depth",
    th_rate: "Seed Rate / Acre",
    th_germ: "Germination",
    th_space: "Spacing (cm)",
    th_season: "Season",
    care_tips_title: "Crop Care Tips",
    crops: {} // Default names from data
  },
  hi: {
    seed_guide_title: "🌱 बीज मार्गदर्शिका",
    seed_guide_sub: "बुवाई की गहराई, बीज दर, अंकुरण समय और हर फसल के लिए दूरी",
    search_seeds: "बीज खोजें…",
    th_crop: "फसल",
    th_type: "बीज प्रकार",
    th_depth: "बुवाई की गहराई",
    th_rate: "बीज दर / एकड़",
    th_germ: "अंकुरण",
    th_space: "दूरी (सेमी)",
    th_season: "मौसम",
    care_tips_title: "फसल देखभाल के सुझाव",
    crops: {
      "Wheat": "गेहूं", "Rice": "चावल", "Maize": "मक्का", "Cotton": "कपास",
      "Tomato": "टमाटर", "Sugarcane": "गन्ना", "Potato": "आलू", "Sunflower": "सूरजमुखी",
      "Chickpea": "चना", "Mango": "आम", "Onion": "प्याज", "Groundnut": "मूंगफली",
      "Barley": "जौ", "Sorghum": "ज्वार", "Pearl Millet": "बाजरा", "Cabbage": "पत्ता गोभी",
      "Cauliflower": "फूलगोभी", "Broccoli": "ब्रोकोली", "Spinach": "पालक", "Carrot": "गाजर",
      "Radish": "मूली", "Garlic": "लहसुन", "Ginger": "अदरक", "Turmeric": "हल्दी",
      "Chili": "मिर्च", "Brinjal": "बैंगन", "Okra": "भिंडी", "Cucumber": "खीरा",
      "Banana": "केला", "Orange": "संतरा", "Grape": "अंगूर", "Papaya": "पपीता",
      "Guava": "अमरूद", "Pineapple": "अनानास", "Watermelon": "तरबूज", "Lemon": "नींबू",
      "Coconut": "नारियल", "Mustard": "सरसों", "Soybean": "सोयाबीन", "Tea": "चाय"
    }
  },
  gu: {
    seed_guide_title: "🌱 બીજ માર્ગદર્શિકા",
    seed_guide_sub: "વાવણીની ઊંડાઈ, બીજનો દર, અંકુરણનો સમય અને દરેક પાક માટે અંતર",
    search_seeds: "બીજ શોધો…",
    th_crop: "પાક",
    th_type: "બીજનો પ્રકાર",
    th_depth: "વાવણીની ઊંડાઈ",
    th_rate: "બીજ દર / એકર",
    th_germ: "અંકુરણ",
    th_space: "અંતર (સેમી)",
    th_season: "ઋતુ",
    care_tips_title: "પાક સંભાળ માટેની ટિપ્સ",
    crops: {
      "Wheat": "ઘઉં", "Rice": "ચોખા", "Maize": "મકાઈ", "Cotton": "કપાસ",
      "Tomato": "ટમેટા", "Sugarcane": "શેરડી", "Potato": "બટાકા", "Sunflower": "સૂર્યમુખી",
      "Chickpea": "ચણા", "Mango": "કેરી", "Onion": "ડુંગળી", "Groundnut": "મગફળી",
      "Barley": "જવ", "Sorghum": "જુવાર", "Pearl Millet": "બાજરી", "Cabbage": "કોબીજ",
      "Cauliflower": "ફૂલકોબી", "Broccoli": "બ્રોકોલી", "Spinach": "પાલક", "Carrot": "ગાજર",
      "Radish": "મૂળો", "Garlic": "લસણ", "Ginger": "આદુ", "Turmeric": "હળદર",
      "Chili": "મરચું", "Brinjal": "રીંગણ", "Okra": "ભીંડા", "Cucumber": "કાકડી",
      "Banana": "કેળા", "Orange": "નારંગી", "Grape": "દ્રાક્ષ", "Papaya": "પપૈયું",
      "Guava": "જામફળ", "Pineapple": "અનાનસ", "Watermelon": "તરબૂચ", "Lemon": "લીંબુ",
      "Coconut": "નાળિયેર", "Mustard": "સરસવ", "Soybean": "સોયાબીન", "Tea": "ચા"
    }
  }
};

let currentLang = 'en';

function changeLanguage() {
  currentLang = document.getElementById('langSelect').value;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang][key]) {
      el.textContent = i18n[currentLang][key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[currentLang][key]) {
      el.placeholder = i18n[currentLang][key];
    }
  });
  filterSeeds(); // Re-render with new language
}

function getTranslatedName(name) {
  if (currentLang === 'en') return name;
  return i18n[currentLang].crops[name] || name;
}

let allSeeds = [];

async function loadSeeds() {
  allSeeds = await apiGetSeeds();
  renderTable(allSeeds);
  renderCareCards(allSeeds);
}

function renderTable(list) {
  const tbody = document.getElementById('seedTableBody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No results found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map((s, index) => `
    <tr style="animation: fadeUp 0.4s ${index * 0.05}s ease both;">
      <td><div class="seed-crop-cell">
        <span class="seed-crop-emoji">${s.image}</span>
        <div>
          <div class="seed-crop-name">${getTranslatedName(s.crop_name)}</div>
          <div class="seed-type-tag">${s.type}</div>
        </div>
      </div></td>
      <td>${s.type}</td>
      <td class="mono">${s.sowing_depth_cm} cm</td>
      <td class="mono">${s.seed_rate_kg_per_acre}</td>
      <td class="mono">${s.germination_days} days</td>
      <td class="mono">${s.spacing_cm}</td>
      <td>${s.season.map(se=>`<span class="tag" style="font-size:0.6rem">${se}</span>`).join(' ')}</td>
    </tr>`).join('');
}

function renderCareCards(list) {
  const grid = document.getElementById('careGrid');
  grid.innerHTML = list.map((s, index) => `
    <div class="care-card" style="animation: fadeUp 0.5s ${index * 0.05}s ease both;">
      <div class="care-card-header">
        <span class="care-card-emoji">${s.image}</span>
        <div>
          <div class="care-card-name">${getTranslatedName(s.crop_name)}</div>
          <div class="care-card-cat">${s.category ? s.category.replace('_',' ') : ''}</div>
        </div>
      </div>
      <ul class="care-tips-list-sm">
        ${(s.care_tips || []).map(t=>`<li>${t}</li>`).join('')}
      </ul>
    </div>`).join('');
}

function filterSeeds() {
  const q        = document.getElementById('seedSearch').value.toLowerCase();
  const category = document.getElementById('seedCategory').value;
  const season   = document.getElementById('seedSeason').value;
  let r = allSeeds;
  if (q)        r = r.filter(s => s.crop_name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
  if (category) r = r.filter(s => s.category === category);
  if (season)   r = r.filter(s => s.season && s.season.includes(season));
  renderTable(r);
}

loadSeeds();
