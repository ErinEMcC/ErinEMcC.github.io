let lastCoverLetterText = "";
let lastCoverLetterHtml = "";

// js/tuffet.js
// Requires: jQuery + RiTa already loaded in the HTML

const jobs = ["librarian", "Voltarian", "maker-ian", "contrarian", "riparian"];
const verbs = ["drinking", "writing", "reading", "making", "thinking"];
const gizmos = ["bits and bobs", "odds and ends", "bric a brac", "stuff and things"];
const jjs = ["chic", "shrewd", "swamp", "dream", "sane", "slick", "lithe", "lush", "brash", "curt", "damned", "coy", "calm", "crisp", "dark", "blue", "green", "fast", "fresh", "grand", "huge", "kind", "rough", "sharp", "short", "smart", "smooth", "strong", "sweet", "tough"];
const nouns = ["letter", "story", "basket", "castle", "forest", "garden", "backpack", "gizmo", "snippet", "river", "rocket", "sunset", "treehouse", "secret", "window"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function loadAnimals() {
  try {
    const response = await fetch("./data/animals.json");
    if (!response.ok) throw new Error("animals.json not found");
    const data = await response.json();
    return Array.isArray(data) ? data : (data.animals || []);
  } catch (err) {
    console.warn("Falling back to default animals list:", err);
    return ["spider", "badger", "stoat", "moth", "cat", "rat", "newt", "crow"];
  }
}

async function generatePrompt() {
  const animals = await loadAnimals();

  const name = "Erin";
  const job = pick(jobs);
  const verb = pick(verbs);
  const gizmo = pick(gizmos);
  const adjective = pick(jjs);
  const animal = pick(animals.length ? animals : ["spider"]);
  const noun = pick(nouns);

  const slantBobs = ["and now we're all working gig-jobs.", "he's making more money than god.", "together we slacked, lazy blobs.", "interrupting my Calvin & Hobbes.", "and an invite for doner kebab."];
  const slantEnds = ["plus a syrah-grenache blend.", "preaching about AI trends.", "saying we're more, like, 'work friends'.", "asking to borrow my pen."];
  const slantBrac = ["asking if I go full-stack.", "saying the team has lost track.", "saying we should circle back.", "asking if I saw his message on Slack."];
  const slantThings = ["asking if I've blocked his pings.", "taking me under her wing.", "buying my art made from strings.", "calling me to the 3 rings.", "asking what data to bring."];

  const slantByGizmo = {
    "bits and bobs": slantBobs,
    "odds and ends": slantEnds,
    "bric a brac": slantBrac,
    "stuff and things": slantThings
  };

  const slantLine = pick(slantByGizmo[gizmo] || ["And frightened Miss Muffet away."]);

  const lines = [
    `<h2>My name is ${name}</h2>`,
    `I'm a ${job},`,
    `${verb} my ${gizmo};`,
    `Then came a ${adjective} ${animal},`,
    `with a secret ${noun},`,
    slantLine
  ];

  $("#output").html(lines.join("<br>"));

  lastCoverLetterHtml = lines.join("<br>");
  lastCoverLetterText = lines
  .map(l => l.replace(/<br\s*\/?>/gi, "").replace(/<\/?[^>]+(>|$)/g, "")) // strip tags
  .join("\n");

}

// make it callable from your onclick=""
window.generatePrompt = generatePrompt;

function downloadCoverLetter() {
  const text = (lastCoverLetterText || "").trim();

  if (!text) {
    alert("Cover letter not generated yet. Click 'Read New Cover Letter' first.");
    return;
  }

  // business card @ 300dpi: 3.5in x 2in
  const dpi = 300;
  const w = Math.round(3.5 * dpi); // 1050
  const h = Math.round(2.0 * dpi); // 600

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // background + border
  ctx.fillStyle = "rgba(255,255,255,0.98)";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(149, 191, 13, 1)";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // layout
  const padX = 70;
  const padTop = 80;
  const padBottom = 90;

  const maxTextWidth = w - padX * 2;

  // reserve space at bottom for signature
  const signatureHeight = 95;
  const maxY = h - padBottom - signatureHeight;

  // --- helpers: wrap text ---
  function wrapLines(str, font, maxWidth) {
    ctx.font = font;
    const rawLines = str.split("\n");
    const out = [];

    for (const raw of rawLines) {
      const words = raw.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        out.push(""); // keep blank line
        continue;
      }
      let line = words[0];
      for (let i = 1; i < words.length; i++) {
        const test = line + " " + words[i];
        if (ctx.measureText(test).width <= maxWidth) {
          line = test;
        } else {
          out.push(line);
          line = words[i];
        }
      }
      out.push(line);
    }
    return out;
  }

  // --- draw poem/cover letter ---
  ctx.fillStyle = "rgba(0,0,0,0.88)";
  ctx.textBaseline = "top";

  const poemFont = "30px Georgia";       // small enough to fit on business card
  const lineHeight = 38;

  const poemLines = wrapLines(text, poemFont, maxTextWidth);

  let y = padTop;
  ctx.font = poemFont;

  for (const line of poemLines) {
    if (y + lineHeight > maxY) break; // stop if we run out of space
    ctx.fillText(line, padX, y);
    y += lineHeight;
  }

  // --- signature at bottom ---
  ctx.textBaseline = "alphabetic";

  ctx.font = "34px Georgia";
  ctx.globalAlpha = 0.9;
  ctx.fillText("Erin E. McCabe, Librarian/Maker", padX, h - padBottom - 40);

  ctx.font = "28px Georgia";
  ctx.globalAlpha = 0.75;
  ctx.fillText("erinemcc.github.io", padX, h - padBottom);
  ctx.globalAlpha = 1;

  // download PNG
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Erin_E_McCabe_Cover_Letter.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

// expose to onclick=""
window.downloadCoverLetter = downloadCoverLetter;
