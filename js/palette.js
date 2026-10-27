window.Grad = window.Grad || {};

// Sprite palette — gown, stole and cap colors taken from the ceremony photo.
Grad.PALETTE = Object.freeze({
  K: '#0d0d14', // cap / hem black
  k: '#2c2c3c', // cap board highlight
  T: '#e3261f', // tassel red
  t: '#ffd23f', // tassel gold charm
  H: '#2a1810', // hair
  h: '#4b2c1c', // hair highlight
  S: '#d39a6f', // skin
  s: '#ad7550', // skin shade
  p: '#e8837f', // blush
  E: '#1a0d08', // eyes
  L: '#b83a48', // lips
  G: '#1a1a26', // gown navy-black
  g: '#36364e', // gown fold highlight
  R: '#dc1f26', // stole red
  r: '#9a1218', // stole shade
  W: '#f6f6f6', // white crest patch
  D: '#f5ecd2', // diploma
  B: '#e3261f', // diploma ribbon
  F: '#06060a'  // shoes
});

Grad.FIREWORK_COLORS = Object.freeze([
  '#ff2a2a', '#ffd23f', '#ffffff', '#ff7ab8', '#ff9f1c', '#ff4d4d'
]);

Grad.SKY_BANDS = Object.freeze([
  '#07041a', '#120630', '#230a40', '#3d0c3f', '#5e0f33', '#7c1428'
]);

Grad.STAGE = Object.freeze({
  trim: '#ffd23f',
  trimShade: '#b8860b',
  carpet: '#7a0e16',
  carpetDark: '#4d0710',
  spot: 'rgba(255, 214, 120, 0.10)'
});
