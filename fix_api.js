const fs = require('fs');

const extraCrops = [
  { name: "Barley", category: "cereal", season: ["rabi", "winter"], water: "low", img: "🌾" },
  { name: "Sorghum", category: "cereal", season: ["kharif", "summer"], water: "low", img: "🌾" },
  { name: "Pearl Millet", category: "cereal", season: ["kharif", "summer"], water: "low", img: "🌾" },
  { name: "Oats", category: "cereal", season: ["rabi", "winter"], water: "medium", img: "🌾" },
  { name: "Rye", category: "cereal", season: ["rabi", "winter"], water: "low", img: "🌾" },
  { name: "Quinoa", category: "cereal", season: ["rabi", "winter"], water: "low", img: "🌾" },
  { name: "Buckwheat", category: "cereal", season: ["kharif"], water: "medium", img: "🌾" },
  
  { name: "Cabbage", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🥬" },
  { name: "Cauliflower", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🥦" },
  { name: "Broccoli", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🥦" },
  { name: "Spinach", category: "vegetable", season: ["rabi", "winter"], water: "high", img: "🥬" },
  { name: "Lettuce", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🥬" },
  { name: "Carrot", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🥕" },
  { name: "Radish", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🥕" },
  { name: "Beetroot", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🍠" },
  { name: "Garlic", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🧄" },
  { name: "Ginger", category: "vegetable", season: ["kharif"], water: "medium", img: "🫚" },
  { name: "Turmeric", category: "vegetable", season: ["kharif"], water: "medium", img: "🫚" },
  { name: "Capsicum", category: "vegetable", season: ["kharif", "rabi"], water: "medium", img: "🫑" },
  { name: "Chili", category: "vegetable", season: ["kharif", "rabi", "summer"], water: "medium", img: "🌶️" },
  { name: "Brinjal", category: "vegetable", season: ["kharif", "rabi", "summer"], water: "medium", img: "🍆" },
  { name: "Okra", category: "vegetable", season: ["kharif", "summer"], water: "medium", img: "🥒" },
  { name: "Pumpkin", category: "vegetable", season: ["kharif", "summer"], water: "medium", img: "🎃" },
  { name: "Cucumber", category: "vegetable", season: ["kharif", "summer"], water: "high", img: "🥒" },
  { name: "Bitter Gourd", category: "vegetable", season: ["kharif", "summer"], water: "medium", img: "🥒" },
  { name: "Bottle Gourd", category: "vegetable", season: ["kharif", "summer"], water: "medium", img: "🥒" },
  { name: "Green Beans", category: "vegetable", season: ["kharif", "rabi"], water: "medium", img: "🫘" },
  { name: "Peas", category: "vegetable", season: ["rabi", "winter"], water: "medium", img: "🫛" },
  { name: "Sweet Potato", category: "vegetable", season: ["kharif", "rabi"], water: "medium", img: "🍠" },
  { name: "Cassava", category: "vegetable", season: ["perennial", "annual"], water: "low", img: "🍠" },
  { name: "Yam", category: "vegetable", season: ["kharif", "annual"], water: "medium", img: "🍠" },
  
  { name: "Banana", category: "fruit", season: ["perennial"], water: "high", img: "🍌" },
  { name: "Orange", category: "fruit", season: ["perennial"], water: "medium", img: "🍊" },
  { name: "Grape", category: "fruit", season: ["perennial"], water: "medium", img: "🍇" },
  { name: "Papaya", category: "fruit", season: ["perennial"], water: "high", img: "🥭" },
  { name: "Guava", category: "fruit", season: ["perennial"], water: "medium", img: "🍈" },
  { name: "Pineapple", category: "fruit", season: ["perennial"], water: "medium", img: "🍍" },
  { name: "Watermelon", category: "fruit", season: ["summer"], water: "high", img: "🍉" },
  { name: "Muskmelon", category: "fruit", season: ["summer"], water: "high", img: "🍈" },
  { name: "Pomegranate", category: "fruit", season: ["perennial"], water: "medium", img: "🍎" },
  { name: "Lemon", category: "fruit", season: ["perennial"], water: "medium", img: "🍋" },
  { name: "Coconut", category: "fruit", season: ["perennial"], water: "high", img: "🥥" },
  { name: "Jackfruit", category: "fruit", season: ["perennial"], water: "medium", img: "🍈" },
  
  { name: "Jute", category: "cash_crop", season: ["kharif"], water: "high", img: "🌾" },
  { name: "Tea", category: "cash_crop", season: ["perennial"], water: "high", img: "🍃" },
  { name: "Coffee", category: "cash_crop", season: ["perennial"], water: "medium", img: "☕" },
  { name: "Rubber", category: "cash_crop", season: ["perennial"], water: "high", img: "🌳" },
  { name: "Tobacco", category: "cash_crop", season: ["rabi", "kharif"], water: "medium", img: "🚬" },
  
  { name: "Mustard", category: "oilseed", season: ["rabi", "winter"], water: "low", img: "🌼" },
  { name: "Soybean", category: "oilseed", season: ["kharif"], water: "medium", img: "🫘" },
  { name: "Sesame", category: "oilseed", season: ["kharif", "summer"], water: "low", img: "🌾" },
  { name: "Linseed", category: "oilseed", season: ["rabi"], water: "low", img: "🌼" },
  { name: "Castor", category: "oilseed", season: ["kharif"], water: "low", img: "🌰" },
  
  { name: "Pigeon Pea", category: "pulse", season: ["kharif"], water: "low", img: "🫘" },
  { name: "Green Gram", category: "pulse", season: ["kharif", "summer"], water: "low", img: "🫘" },
  { name: "Black Gram", category: "pulse", season: ["kharif"], water: "low", img: "🫘" },
  { name: "Lentil", category: "pulse", season: ["rabi", "winter"], water: "low", img: "🫘" },
  { name: "Cowpea", category: "pulse", season: ["kharif", "summer"], water: "low", img: "🫘" }
].slice(0, 50);

let idCounter = 13;
const generatedCrops = extraCrops.map(c => {
  return {
    id: idCounter++,
    name: c.name,
    image: c.img,
    category: c.category,
    season: c.season,
    soil_types: ["loamy", "alluvial", "sandy-loam"],
    climate: ["warm", "temperate"],
    water_requirement: c.water,
    sowing_months: ["June", "July"],
    harvest_months: ["October", "November"],
    duration_days: "90-120",
    description: `A resilient crop widely cultivated for its uses. ${c.name} prefers a supportive climate.`,
    care_tips: ["Ensure proper soil drainage", "Monitor for pests during early growth phases", "Apply balanced fertilizers"],
    seeds: {
      type: "Standard Seed",
      sowing_depth_cm: "2-5",
      seed_rate_kg_per_acre: "5-10",
      germination_days: "7-14",
      spacing_cm: "30x10"
    }
  };
});

function formatObj(obj) {
  return `{ id:${obj.id}, name:"${obj.name}", image:"${obj.image}", category:"${obj.category}", season:${JSON.stringify(obj.season)}, soil_types:${JSON.stringify(obj.soil_types)}, climate:${JSON.stringify(obj.climate)}, water_requirement:"${obj.water_requirement}", sowing_months:${JSON.stringify(obj.sowing_months)}, harvest_months:${JSON.stringify(obj.harvest_months)}, duration_days:"${obj.duration_days}", description:"${obj.description}", care_tips:${JSON.stringify(obj.care_tips)}, seeds:{ type:"${obj.seeds.type}", sowing_depth_cm:"${obj.seeds.sowing_depth_cm}", seed_rate_kg_per_acre:"${obj.seeds.seed_rate_kg_per_acre}", germination_days:"${obj.seeds.germination_days}", spacing_cm:"${obj.seeds.spacing_cm}" } }`;
}

// Write to api.js
let apiJS = fs.readFileSync('api.js', 'utf8');
const apiInsertStr = ',\n  ' + generatedCrops.map(c => formatObj(c)).join(',\n  ') + '\n';
apiJS = apiJS.replace('} }\n];', '} }' + apiInsertStr + '];');
fs.writeFileSync('api.js', apiJS);

console.log("Successfully appended 50 crops to api.js!");
