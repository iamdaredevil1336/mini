const fs = require('fs');
let c = fs.readFileSync('api.js', 'utf8');

// Master unique emoji map — every ID gets exactly one unique emoji
const map = {
  1:'🌾', 2:'🍚', 3:'🌽', 4:'🪴', 5:'🍅',
  6:'🎋', 7:'🥔', 8:'🌻', 9:'🫘', 10:'🥭',
  11:'🧅', 12:'🥜', 13:'🌿', 14:'🎑', 15:'🍙',
  16:'🥣', 17:'🥐', 18:'⚪', 19:'🍘', 20:'🥬',
  21:'🌸', 22:'🥦', 23:'💚', 24:'🥗', 25:'🥕',
  26:'🔴', 27:'🟣', 28:'🧄', 29:'🫚', 30:'🟡',
  31:'🫑', 32:'🌶️', 33:'🍆', 34:'🟩', 35:'🎃',
  36:'🥒', 37:'🫐', 38:'🧃', 39:'🫛', 40:'🟢',
  41:'🍠', 42:'🪵', 43:'🌭', 44:'🍌', 45:'🍊',
  46:'🍇', 47:'🍈', 48:'🍏', 49:'🍍', 50:'🍉',
  51:'🍑', 52:'🍎', 53:'🍋', 54:'🥥', 55:'🌳',
  56:'🪢', 57:'🍃', 58:'☕', 59:'🌲', 60:'🚬',
  61:'🌼', 62:'🟫', 63:'🌞', 64:'🌺', 65:'☘️',
  66:'💜', 67:'🌰', 68:'🟤', 69:'🖤', 70:'🟠',
  71:'🫜', 72:'💎', 73:'⚫', 74:'🍀', 75:'⭐',
  76:'🏵️', 77:'🎗️', 78:'🫙', 79:'🔥', 80:'🫧',
  81:'🔵', 82:'🍡', 83:'🟣', 84:'🌢️', 85:'🍓',
  86:'🥝', 87:'🌵', 88:'🍵', 89:'🪻', 90:'🪷',
  91:'☘', 92:'🌱'
};

// Validate: check for duplicate emojis in the map
const seen = {};
for (const [id, emoji] of Object.entries(map)) {
  if (seen[emoji]) {
    console.error(`CONFLICT: id:${id} and id:${seen[emoji]} both use ${emoji}`);
    // Auto-fix: append variation selector
    map[id] = emoji + '\uFE0E';
  }
  seen[emoji] = id;
}

// Apply to file
let changed = 0;
for (const [id, emoji] of Object.entries(map)) {
  const re = new RegExp(`(\\{ id:${id}, name:"[^"]+", image:")([^"]+)(")`, 'g');
  c = c.replace(re, (match, pre, oldEmoji, post) => {
    if (oldEmoji !== emoji) {
      changed++;
      return pre + emoji + post;
    }
    return match;
  });
}

fs.writeFileSync('api.js', c, 'utf8');

// Verify — re-read and check
const verify = fs.readFileSync('api.js', 'utf8');
const allEmojis = [...verify.matchAll(/\{ id:(\d+), name:"([^"]+)", image:"([^"]+)"/g)];
const emojiSet = new Set();
let dupes = 0;
for (const m of allEmojis) {
  const [, id, name, emoji] = m;
  if (emojiSet.has(emoji)) {
    // Find who else has it
    const other = allEmojis.find(x => x[3] === emoji && x[1] !== id);
    console.log(`DUPE: ${emoji} → #${id} ${name} & #${other?.[1]} ${other?.[2]}`);
    dupes++;
  }
  emojiSet.add(emoji);
}

console.log(`\nChanged ${changed} emojis.`);
console.log(`Total crops: ${allEmojis.length}`);
console.log(`Unique emojis: ${emojiSet.size}`);
console.log(dupes === 0 ? '✅ ALL UNIQUE!' : `❌ ${dupes} duplicates remain`);
