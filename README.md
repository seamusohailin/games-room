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
| `manifest.webmanifest`, `icon-180.png`, `icon-512.png` | Make it look and open like an app from the iPad home screen |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

Games already on their own Netlify addresses (Whisker & Pearl, Purrrrrfect Piano) are linked from here, not copied in. Each game saves progress against its own web address, so moving them would wipe their saved data.

## Adding a game

1. Save the game as `games/<name>/index.html`, with `<script src="../../home.js"></script>` just before `</body>`.
2. Add its entry to `games.js` (players, subject, the lesson it supports, the date added, the tile colour).
3. Push to `main`.

A game hosted elsewhere can also go on a shelf: add an entry to `games.js` with its full `https://` address as `href`.

## On the iPads

Open the address in Safari, tap **Share → Add to Home Screen**. It then opens full screen from its own icon. New games appear the next time it's opened.

## Things to know

- The site is public but unlisted. Search engines are asked not to list it. It shows the girls' first names only, and parent notes are left out of the public copies.
- Progress (the "New" ribbons, ticks, and each game's own saves) lives on each iPad, not online.
- To change who sees a game, edit its `players` line in `games.js` (`"maggie"`, `"maeve"`, or both).
- Keep the GitHub account protected with two-factor sign-in: whoever controls it controls what the girls load.
