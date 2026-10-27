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
  O: '#e2455a', // rose
  o: '#a8243a', // rose shade
  P: '#f7a8c0', // pink bloom
  Y: '#fff4ee', // baby's breath
  V: '#5fa356', // leaf
  v: '#356e38', // stem
  N: '#f3e3d3', // bouquet wrap
  n: '#d4bba4', // wrap shade
  B: '#e3261f', // ribbon
  F: '#06060a'  // shoes
});

Grad.PETAL_COLORS = Object.freeze(['#f7a8c0', '#ffc9d6', '#fbe3ea', '#e2455a', '#ffffff']);

Grad.FLOWER_HEADS = Object.freeze(['#e2455a', '#f7a8c0', '#fff4ee', '#ffc9d6', '#c9406a']);

Grad.SKY_BANDS = Object.freeze([
  '#1f1533', '#33204d', '#4d2b60', '#6e3a6e', '#934c78', '#b9627e', '#d98386'
]);

Grad.GARDEN = Object.freeze({
  grassTop: '#8fcf7a',
  grass: '#4f9a4a',
  grassDark: '#2f6b34',
  stem: '#356e38',
  leaf: '#5fa356',
  center: '#ffd977',
  glow: 'rgba(255, 220, 200, 0.10)'
});
