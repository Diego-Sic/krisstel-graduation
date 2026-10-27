window.Grad = window.Grad || {};

// 24x31 graduate: long dark hair, navy gown, red stole with white crest,
// mortarboard, bouquet of roses tied with a red ribbon. Tassel is drawn separately so it can swing.
Grad.GRADUATE = Object.freeze([
  '....kkkkkkkkkkkkkkkk....',
  '..KKKKKKKKKKKKKKKKKKKK..',
  '....KKKKKKKKKKKKKKKK....',
  '......KKKKKKKKKKKK......',
  '.....HHHHHHHHHHHHHH.....',
  '.....HHHHHHSSSSSSHH.....',
  '.....HHSEESSSSEESHH.....',
  '.....HHSpSSSSSSpSHH.....',
  '.....HHSSSSLLSSSSHH.....',
  '.....HHHsSSSSSSsHHH.....',
  '....HHHHHsSSSSsHHHHH....',
  '...HHHGGRRsSSsRRGGHHH...',
  '..HHGGGRRRRssRWWRGGGHH..',
  '..HHGGGRRRRGGRWWRGGGHH..',
  '..HGGGGRVPPYYPPVRGGGGH..',
  '..HGGGGVPOoYYoOPVGGGGH..',
  '..GGGGGPYOoOOoOYPGGGGG..',
  '..GgGGGVPPYVVYPPVGGGgG..',
  '..GgGGGSVNNBBNNVSGGGgG..',
  '..GgGGGRRRNNNnRRRGGGgG..',
  '..GgGGGrRRRNnRRRrGGGgG..',
  '..GgGGGrrrrvvrrrrGGGgG..',
  '..GgGGGGGGGGGGGGGGGGgG..',
  '..GgGGGGGGGgGGGGGGGGgG..',
  '.GGgGGGGGGGgGGGGGGGGgGG.',
  '.GGgGGGGGGGgGGGGGGGGgGG.',
  '.GGgGGGGGGGgGGGGGGGGgGG.',
  '.KKKKKKKKKKKKKKKKKKKKKK.',
  '........SS....SS........',
  '........SS....SS........',
  '.......FFF....FFF.......'
]);

Grad.GRADUATE_SIZE = Object.freeze({ w: 24, h: 31 });
Grad.TASSEL_ANCHOR = Object.freeze({ x: 20, y: 2 });

Grad.drawSprite = function drawSprite(ctx, rows, ox, oy, palette, swap) {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = (swap && swap[row[x]]) || row[x];
      const color = palette[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  });
};

Grad.drawTassel = function drawTassel(ctx, ox, oy, time, palette) {
  const LENGTH = 6;
  const swing = Math.sin(time * 2.4) * 1.8;
  for (let i = 0; i < LENGTH; i++) {
    const dx = Math.round(swing * (i / LENGTH));
    ctx.fillStyle = i === 2 ? palette.t : palette.T;
    ctx.fillRect(ox + Grad.TASSEL_ANCHOR.x + dx, oy + Grad.TASSEL_ANCHOR.y + i, 1, 1);
  }
  const tipX = ox + Grad.TASSEL_ANCHOR.x + Math.round(swing);
  ctx.fillStyle = palette.T;
  ctx.fillRect(tipX - 1, oy + Grad.TASSEL_ANCHOR.y + LENGTH, 3, 1);
};
