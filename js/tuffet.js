async function createGrammar(RiTa, context) {
  // Fetch JSON from your published GitHub Pages URL
  const response = await fetch("./data/animals.json");
  const animals = await response.json(); // the array directly

  const rules = {
    "start": "<h2>My name is Erin</h2><br>$line2<br>$line3<br>$line4<br>$line5<br>$line6<br>",
   
    "line2": "I'm a $librarian",
    "line3": "$gerund my $gizmo",
    "line4": "There came a $adjective $animal",
    "line5": "with a secret $noun",
    "line6": "And frightened Miss Muffet away.",
    
    "animal": animals,
    "adjective": ["big", "small", "fierce", "cuddly", "striped"],
    "noun": ["plan", "letter", "story", "document", "recipe"]
  };

  return rules;
}

export default createGrammar;
