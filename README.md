# Congratulations Krisstel

A pixel-art graduation celebration for Krisstel (Perito Contador Bilingüe, Class of 2026).

The graduate sprite matches the ceremony outfit, holding a bouquet: a navy-black gown, a red stole with a white crest, a black mortarboard with a red tassel, and long dark hair.

## Run

Open `index.html` in a browser. No build step is needed.

Click or tap anywhere to scatter petals.

## Structure

- `js/palette.js`: outfit, sky and stage colors
- `js/sprite.js`: graduate sprite map and swinging tassel
- `js/scene.js`: dithered dusk sky, moon, stars, glow, swaying flower garden
- `js/petals.js`: drifting petals and soft glints (immutable state steps)
- `js/main.js`: render loop, scheduling, input
