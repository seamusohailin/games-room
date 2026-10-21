/* The Games Room catalogue.
   This is the only file to edit when a game is added: add one entry to GAMES.

   Fields
     id       short name, letters and hyphens only (also the folder name under games/)
     title    as the girls will see it
     blurb    one short line, written for the child
     players  who sees it: "maggie", "maeve", or both
     subject  Geography, History, Science, Maths, English, Music, Art, Languages, Health and PE, Technology
     source   the curriculum lesson it supports (shown to grown-ups only)
     added    YYYY-MM-DD (a game shows a "New" ribbon for 14 days, until that girl opens it)
     colour   the tile colour
     href     games/<id>/index.html for games kept in this site, or a full https:// address for games hosted elsewhere
*/
window.PLAYERS = [
  { id: "maggie", name: "Maggie", colour: "#E2557A" },
  { id: "maeve",  name: "Maeve",  colour: "#16A08F" }
];

window.GAMES = [
  {
    id: "lyrebird-course",
    title: "Nell's Treasure Map",
    blurb: "Learn to read a map and use a compass, then find Nell's treasure.",
    players: ["maggie", "maeve"],
    subject: "Health and PE",
    source: "Friday special activity: first steps in navigation with a map and compass, before a map walk on the Rokeby to Crossover Rail Trail",
    added: "2026-10-21",
    colour: "#B5179E",
    href: "games/lyrebird-course/index.html"
  },
  {
    id: "globe-makers-apprentice",
    title: "The Globe-Maker's Apprentice",
    blurb: "Help Mistress Wren make a globe for Captain Hale.",
    players: ["maeve"],
    subject: "Geography",
    source: "Earth is Our Home, Lessons 4 and 5: day and night; the Northern and Southern Hemispheres",
    added: "2026-10-20",
    colour: "#16A08F",
    href: "games/globe-makers-apprentice/index.html"
  },
  {
    id: "sofias-map-of-mexico",
    title: "Sofia's Map of Mexico",
    blurb: "Travel across Mexico with Sofia and finish her map.",
    players: ["maggie"],
    subject: "Geography",
    source: "Exploring North America (Pleasant Talk of Places), Lesson 6",
    added: "2026-10-20",
    colour: "#D6246E",
    href: "games/sofias-map-of-mexico/index.html"
  },
  {
    id: "gods-of-ancient-egypt",
    title: "Gods of Ancient Egypt",
    blurb: "Meet the gods, guess who's who, and tell the story of Osiris.",
    players: ["maggie", "maeve"],
    subject: "History",
    source: "Story of the World, Vol. 1: the gods of ancient Egypt",
    added: "2026-10-18",
    colour: "#2453A3",
    href: "games/gods-of-ancient-egypt/index.html"
  },
  {
    id: "purrrrrfect-piano",
    title: "Purrrrrfect Piano",
    blurb: "Tap the falling tiles in time and earn Pusheens.",
    players: ["maggie", "maeve"],
    subject: "Music",
    source: "Rhythm and keyboard practice",
    added: "2026-10-10",
    colour: "#7A4FB5",
    href: "games/purrrrrfect-piano/index.html"
  },
  {
    id: "whisker-and-pearl",
    title: "Whisker & Pearl",
    blurb: "Serve the cats at the café and climb the times tables.",
    players: ["maggie", "maeve"],
    subject: "Maths",
    source: "Times tables fluency",
    added: "2026-09-14",
    colour: "#E08A1E",
    href: "games/whisker-and-pearl/index.html"
  },
  {
    id: "shadow-keeper",
    title: "The Shadow Keeper of Misselthwaite",
    blurb: "Check Colin's shadow record and decide who is right.",
    players: ["maggie"],
    subject: "Science",
    source: "Light and shadow, set in The Secret Garden",
    added: "2026-09-13",
    colour: "#4C4677",
    href: "games/shadow-keeper/index.html"
  }
];
