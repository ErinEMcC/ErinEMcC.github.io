function createGrammar(RiTa, context) {
  // Create the grammar rules
  const rules = {
    // The starting rule - this is what gets expanded first
    // The pipe symbol | provides alternatives
    start: "<h2>My name is Erin</h2>$line1<br>$line2<br>$line3<br>$line4<br>$line5<br>$line6<br>,
    
    line1: "My name is Erin",
    line2: "I'm a $librarian",
    line3: "$verbGerund my $.oneSyllableNoun and $.oneSyllableNoun",
    line4: "There can a big $spider",
    line5: "That sat down $beside her",
    line6: "And frightened Miss Muffet away.",
    
    // Set up some repeatable words
    
    "#librarian = myJobs[randomIndex]",
    
    
  };

  // Important: Return both the rules and the context
  return rules;
}

// Export the function so it can be imported in other files
export default createGrammar;

//Little Miss Muffet
//Sat on a tuffet,
//Eating her curds and whey;
//There came a big spider,
//Who sat down beside her
//And frightened Miss Muffet away.
