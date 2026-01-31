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

  const slantBobs = ["and now we're all working gig-jobs.", "in the style of Calvin & Hobbes", "he's making more money than god.", "together we slacked, lazy blobs."];
  const slantEnds = ["plus a syrah-grenache blend.", "preaching about AI trends.", "saying we're more of 'work friends'.", "asking to borrow my pen."];
  const slantBrac = ["asking if I go full-stack.", "saying the team has lost track.", "saying we should circle back.", "asking if I saw his message on Slack"];
  const slantThings = ["asking if I've blocked his pings.", "to take me under her wing.", "buying my art made from strings.", "calling me to the 3 Rings.", "asking what data to bring."];

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
}

// make it callable from your onclick=""
window.generatePrompt = generatePrompt;
