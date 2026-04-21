// ============================================================
// AgriSystem — Gemini Image Generator for Crops
// Uses generateContent with gemini-2.0-flash-exp
// ============================================================
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyCggeq9eR5On20lMDZob-AwysuflKc5p78';
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const OUT_DIR = path.join(__dirname, 'images', 'crops');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const crops = [
  { id:1,  file:'wheat.png',       prompt:'Generate a realistic photograph of golden ripe wheat ears in a sunlit field' },
  { id:2,  file:'rice.png',        prompt:'Generate a realistic photograph of lush green rice paddy field with water' },
  { id:3,  file:'maize.png',       prompt:'Generate a realistic photograph of ripe yellow corn cobs on stalks' },
  { id:4,  file:'cotton.png',      prompt:'Generate a realistic photograph of white cotton bolls on plants in a field' },
  { id:5,  file:'tomato.png',      prompt:'Generate a realistic photograph of ripe red tomatoes on a vine' },
  { id:6,  file:'sugarcane.png',   prompt:'Generate a realistic photograph of tall sugarcane stalks in a tropical field' },
  { id:7,  file:'potato.png',      prompt:'Generate a realistic photograph of freshly harvested potatoes on soil' },
  { id:8,  file:'sunflower.png',   prompt:'Generate a realistic photograph of bright yellow sunflower in bloom' },
  { id:9,  file:'chickpea.png',    prompt:'Generate a realistic photograph of chickpea pods on a plant' },
  { id:10, file:'mango.png',       prompt:'Generate a realistic photograph of ripe mangoes on a tree branch' },
  { id:11, file:'onion.png',       prompt:'Generate a realistic photograph of fresh onions on wooden surface' },
  { id:12, file:'groundnut.png',   prompt:'Generate a realistic photograph of groundnut peanut plant with pods' },
  { id:13, file:'barley.png',      prompt:'Generate a realistic photograph of barley grain heads in a field' },
  { id:14, file:'sorghum.png',     prompt:'Generate a realistic photograph of sorghum grain heads on stalks' },
  { id:15, file:'pearl_millet.png', prompt:'Generate a realistic photograph of pearl millet bajra grain heads' },
  { id:16, file:'oats.png',        prompt:'Generate a realistic photograph of oat grain panicles in a field' },
  { id:17, file:'rye.png',         prompt:'Generate a realistic photograph of rye grain heads in a golden field' },
  { id:18, file:'quinoa.png',      prompt:'Generate a realistic photograph of colorful quinoa seed heads' },
  { id:19, file:'buckwheat.png',   prompt:'Generate a realistic photograph of buckwheat plant with white flowers' },
  { id:20, file:'cabbage.png',     prompt:'Generate a realistic photograph of fresh green cabbage head' },
  { id:21, file:'cauliflower.png', prompt:'Generate a realistic photograph of white cauliflower head' },
  { id:22, file:'broccoli.png',    prompt:'Generate a realistic photograph of fresh green broccoli head' },
  { id:23, file:'spinach.png',     prompt:'Generate a realistic photograph of fresh dark green spinach leaves' },
  { id:24, file:'lettuce.png',     prompt:'Generate a realistic photograph of fresh green lettuce head' },
  { id:25, file:'carrot.png',      prompt:'Generate a realistic photograph of fresh orange carrots with green tops' },
  { id:26, file:'radish.png',      prompt:'Generate a realistic photograph of bright red radishes with leaves' },
  { id:27, file:'beetroot.png',    prompt:'Generate a realistic photograph of dark purple beetroot' },
  { id:28, file:'garlic.png',      prompt:'Generate a realistic photograph of fresh garlic bulbs and cloves' },
  { id:29, file:'ginger.png',      prompt:'Generate a realistic photograph of fresh ginger root rhizome' },
  { id:30, file:'turmeric.png',    prompt:'Generate a realistic photograph of turmeric root with bright yellow interior' },
  { id:31, file:'capsicum.png',    prompt:'Generate a realistic photograph of colorful bell peppers' },
  { id:32, file:'chili.png',       prompt:'Generate a realistic photograph of red and green chili peppers on a plant' },
  { id:33, file:'brinjal.png',     prompt:'Generate a realistic photograph of purple eggplant brinjal on plant' },
  { id:34, file:'okra.png',        prompt:'Generate a realistic photograph of green okra lady finger pods' },
  { id:35, file:'pumpkin.png',     prompt:'Generate a realistic photograph of large orange pumpkin in a field' },
  { id:36, file:'cucumber.png',    prompt:'Generate a realistic photograph of fresh green cucumbers on a vine' },
  { id:37, file:'bitter_gourd.png',prompt:'Generate a realistic photograph of bitter gourd karela on vine' },
  { id:38, file:'bottle_gourd.png',prompt:'Generate a realistic photograph of bottle gourd lauki on vine' },
  { id:39, file:'green_beans.png', prompt:'Generate a realistic photograph of fresh green string beans' },
  { id:40, file:'peas.png',        prompt:'Generate a realistic photograph of green pea pods on vine' },
  { id:41, file:'sweet_potato.png',prompt:'Generate a realistic photograph of orange sweet potatoes' },
  { id:42, file:'cassava.png',     prompt:'Generate a realistic photograph of cassava roots' },
  { id:43, file:'yam.png',         prompt:'Generate a realistic photograph of large yam tubers' },
  { id:44, file:'banana.png',      prompt:'Generate a realistic photograph of ripe yellow bananas on a tree' },
  { id:45, file:'orange.png',      prompt:'Generate a realistic photograph of ripe oranges on a citrus tree' },
  { id:46, file:'grape.png',       prompt:'Generate a realistic photograph of purple grape clusters on vine' },
  { id:47, file:'papaya.png',      prompt:'Generate a realistic photograph of ripe papaya fruit on tree' },
  { id:48, file:'guava.png',       prompt:'Generate a realistic photograph of guava fruit cut showing pink inside' },
  { id:49, file:'pineapple.png',   prompt:'Generate a realistic photograph of pineapple growing on plant' },
  { id:50, file:'watermelon.png',  prompt:'Generate a realistic photograph of watermelon cut showing red flesh' },
  { id:51, file:'muskmelon.png',   prompt:'Generate a realistic photograph of muskmelon cantaloupe' },
  { id:52, file:'pomegranate.png', prompt:'Generate a realistic photograph of pomegranate split showing red seeds' },
  { id:53, file:'lemon.png',       prompt:'Generate a realistic photograph of yellow lemons on a tree' },
  { id:54, file:'coconut.png',     prompt:'Generate a realistic photograph of coconuts on a palm tree' },
  { id:55, file:'jackfruit.png',   prompt:'Generate a realistic photograph of large jackfruit on tree' },
  { id:56, file:'jute.png',        prompt:'Generate a realistic photograph of jute plants in a field' },
  { id:57, file:'tea.png',         prompt:'Generate a realistic photograph of green tea leaves on plantation' },
  { id:58, file:'coffee.png',      prompt:'Generate a realistic photograph of red coffee cherries on branch' },
  { id:59, file:'rubber.png',      prompt:'Generate a realistic photograph of rubber tree being tapped for latex' },
  { id:60, file:'tobacco.png',     prompt:'Generate a realistic photograph of large tobacco leaves on plant' },
  { id:61, file:'mustard.png',     prompt:'Generate a realistic photograph of yellow mustard flower field' },
  { id:62, file:'soybean.png',     prompt:'Generate a realistic photograph of soybean pods on plant' },
  { id:63, file:'sunflower2.png',  prompt:'Generate a realistic photograph of a sunflower field at sunset' },
  { id:64, file:'safflower.png',   prompt:'Generate a realistic photograph of orange safflower flowers' },
  { id:65, file:'castor.png',      prompt:'Generate a realistic photograph of castor bean plant with seed pods' },
  { id:66, file:'linseed.png',     prompt:'Generate a realistic photograph of blue flax linseed flowers' },
  { id:67, file:'pigeon_pea.png',  prompt:'Generate a realistic photograph of pigeon pea plant with pods' },
  { id:68, file:'green_gram.png',  prompt:'Generate a realistic photograph of green gram moong bean pods' },
  { id:69, file:'black_gram.png',  prompt:'Generate a realistic photograph of black gram urad bean pods' },
  { id:70, file:'chickpea2.png',   prompt:'Generate a realistic photograph of chickpea chana plant in field' },
  { id:71, file:'lentil.png',      prompt:'Generate a realistic photograph of lentil masur plant with pods' },
  { id:72, file:'cardamom.png',    prompt:'Generate a realistic photograph of green cardamom pods on plant' },
  { id:73, file:'black_pepper.png',prompt:'Generate a realistic photograph of black pepper vine with peppercorns' },
  { id:74, file:'coriander.png',   prompt:'Generate a realistic photograph of fresh green coriander leaves' },
  { id:75, file:'cumin.png',       prompt:'Generate a realistic photograph of cumin jeera seeds and plant' },
  { id:76, file:'fenugreek.png',   prompt:'Generate a realistic photograph of fenugreek methi leaves' },
  { id:77, file:'turmeric2.png',   prompt:'Generate a realistic photograph of turmeric plant with flowers' },
  { id:78, file:'ginger2.png',     prompt:'Generate a realistic photograph of ginger plant with rhizome' },
  { id:79, file:'chili2.png',      prompt:'Generate a realistic photograph of dried red chili peppers hanging' },
  { id:80, file:'garlic2.png',     prompt:'Generate a realistic photograph of garlic field with plants growing' },
  { id:81, file:'onion2.png',      prompt:'Generate a realistic photograph of onion field with green shoots' },
  { id:82, file:'tomato2.png',     prompt:'Generate a realistic photograph of cherry tomatoes ripening on vine' },
  { id:83, file:'brinjal2.png',    prompt:'Generate a realistic photograph of striped Indian brinjal varieties' },
  { id:84, file:'okra2.png',       prompt:'Generate a realistic photograph of okra plant with yellow flower' },
  { id:85, file:'watermelon2.png', prompt:'Generate a realistic photograph of watermelon growing on vine in field' },
  { id:86, file:'muskmelon2.png',  prompt:'Generate a realistic photograph of muskmelon growing in sandy soil' },
  { id:87, file:'aloe_vera.png',   prompt:'Generate a realistic photograph of aloe vera succulent plant' },
  { id:88, file:'stevia.png',      prompt:'Generate a realistic photograph of stevia plant with green leaves' },
  { id:89, file:'moringa.png',     prompt:'Generate a realistic photograph of moringa drumstick tree with pods' },
  { id:90, file:'ashwagandha.png', prompt:'Generate a realistic photograph of ashwagandha plant with berries' },
  { id:91, file:'tulsi.png',       prompt:'Generate a realistic photograph of holy basil tulsi plant' },
  { id:92, file:'hemp.png',        prompt:'Generate a realistic photograph of industrial hemp plant leaves' },
];

function makeRequest(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function generateImage(crop) {
  const outPath = path.join(OUT_DIR, crop.file);

  if (fs.existsSync(outPath)) {
    console.log(`  SKIP ${crop.file} (exists)`);
    return true;
  }

  const body = {
    contents: [{
      parts: [{ text: crop.prompt }]
    }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      responseMimeType: 'text/plain',
    }
  };

  try {
    const res = await makeRequest(API_URL, body);

    if (res.status !== 200) {
      const msg = res.body?.error?.message || `HTTP ${res.status}`;
      console.error(`  FAIL ${crop.file}: ${msg}`);
      return false;
    }

    // Search response for inline image data
    const candidates = res.body?.candidates || [];
    for (const cand of candidates) {
      const parts = cand?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, 'base64');
          // Determine extension from mime type
          let ext = '.png';
          if (part.inlineData.mimeType === 'image/jpeg') ext = '.jpg';
          if (part.inlineData.mimeType === 'image/webp') ext = '.webp';

          const finalPath = outPath.replace('.png', ext);
          fs.writeFileSync(finalPath, buf);
          console.log(`  OK   ${path.basename(finalPath)} (${(buf.length/1024).toFixed(0)}KB)`);
          return { success: true, actualFile: path.basename(finalPath) };
        }
      }
    }

    console.error(`  FAIL ${crop.file}: No image in response`);
    return false;

  } catch (err) {
    console.error(`  ERR  ${crop.file}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`\nGenerating ${crops.length} crop images via Gemini API...\n`);

  let ok = 0, fail = 0;
  const imageMap = {};

  for (let i = 0; i < crops.length; i++) {
    const crop = crops[i];
    process.stdout.write(`[${String(i+1).padStart(2)}/${crops.length}] #${crop.id} `);

    const result = await generateImage(crop);

    if (result && result.actualFile) {
      imageMap[crop.id] = `images/crops/${result.actualFile}`;
      ok++;
    } else if (result === true) {
      // Skipped — file existed
      imageMap[crop.id] = `images/crops/${crop.file}`;
      ok++;
    } else {
      fail++;
    }

    // Rate limit delay
    if (i < crops.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! ${ok} ok, ${fail} failed.\n`);

  // Write image map JS
  const lines = Object.entries(imageMap)
    .map(([id, p]) => `  ${id}: "${p}"`)
    .join(',\n');
  fs.writeFileSync(
    path.join(__dirname, 'crop_images.js'),
    `const CROP_IMAGES = {\n${lines}\n};\n`
  );
  console.log('crop_images.js written.\n');
}

main().catch(console.error);
