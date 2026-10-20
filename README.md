# The Games Room

One web address for all the girls' learning games: **https://seamusohailin.github.io/games-room/**

Maggie or Maeve opens it, taps her name and sees her own shelf of games. New games show a "New" ribbon for 14 days, until she has opened them. Each game kept in this site has a small house button in the bottom-left corner that takes her back to the room.

## How it's published

The site is published by GitHub Pages from the `main` branch of the `seamusohailin/games-room` repository. Any change pushed to `main` is live within a minute or two. Claude adds new games directly, so there is nothing to upload by hand.

A copy of the site is also kept in the Home Education folder (`Curricula/Supplementary materials/Education Games/Games Room/`). The repository is the version that counts.

## What's in it

| File or folder | What it is |
|---|---|
| `index.html` | The Games Room itself |
| `games.js` | The list of games. The only file that changes when a game is added |
| `games/<name>/index.html` | Each game kept in this site |
| `home.js` | The house button, loaded by each game in `games/` |
| `results.js` | Records who played, each answer and whether the game was finished, and sends it to the results sheet |
| `manifest.webmanifest`, `icon-180.png`, `icon-512.png` | Make it look and open like an app from the iPad home screen |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

Games already on their own Netlify addresses (Whisker & Pearl, Purrrrrfect Piano) are linked from here, not copied in. Each game saves progress against its own web address, so moving them would wipe their saved data.

## Adding a game

1. Save the game as `games/<name>/index.html`, with `<script src="../../results.js"></script>` in `<head>` and `<script src="../../home.js"></script>` just before `</body>`. Use `GR.key()` for saved progress so each girl has her own, and record each question with `GR.ask()` (see the notes at the top of `results.js`), tagging it with a concept and learning area.
2. Add its entry to `games.js` (players, subject, the lesson it supports, the date added, the tile colour).
3. Push to `main`.

A game hosted elsewhere can also go on a shelf: add an entry to `games.js` with its full `https://` address as `href`.

## Results

Each game records which girl is playing (from the name she taps), every question with whether she got it right first time, how many tries, any hint and how long it took, and whether she finished. Records are kept on the iPad and sent to the **Games Room results** Google Sheet when online. Anything she types (postcards, record entries, measurements) goes to a Writing tab, one row per girl, game, prompt and day, updated as she edits. The sheet also has a Summary tab (by girl and game, by girl and concept, and the questions most often missed), plus Sessions and Answers tabs.

The sheet's script (`results-sheet-script.gs` in the Home Education copy of this folder) only adds rows; it never sends anything back. Its web address goes in `ENDPOINT` at the top of `results.js`.

Only paired devices can send results. The pairing code is kept in the script's **Project Settings → Script Properties** as `PAIRING_CODE`, never in the public code. Pair a device from **For grown-ups → Pair this iPad** in the Games Room (on the iPad, from the home-screen icon, not Safari). Until a device is paired, its results wait on the device. To change the code, edit `PAIRING_CODE` and pair the iPad again.

## On the iPads

Open the address in Safari, tap **Share → Add to Home Screen**. It then opens full screen from its own icon. New games appear the next time it's opened.

## Things to know

- The site is public but unlisted. Search engines are asked not to list it. It shows the girls' first names only, and parent notes are left out of the public copies.
- Progress (the "New" ribbons, ticks, and each game's own saves) lives on the iPad. Results also go to the private results sheet; nothing about the girls' play appears on the public site.
- To change who sees a game, edit its `players` line in `games.js` (`"maggie"`, `"maeve"`, or both).
- Keep the GitHub account protected with two-factor sign-in: whoever controls it controls what the girls load.
