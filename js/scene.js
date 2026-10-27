window.Grad = window.Grad || {};

// Static backdrop (dithered sky, stage) is pre-rendered once per resize.
(function () {
  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  const STAGE_HEIGHT = 9;

  function floorY(H) {
    return H - STAGE_HEIGHT;
  }

  function paintSky(ctx, W, H) {
    const bands = Grad.SKY_BANDS;
    const skyH = floorY(H);
    for (let y = 0; y < skyH; y++) {
      const pos = (y / skyH) * (bands.length - 1);
      const lo = Math.floor(pos);
      const frac = pos - lo;
      for (let x = 0; x < W; x++) {
        const useHi = frac * 16 > BAYER4[y % 4][x % 4];
        ctx.fillStyle = bands[Math.min(bands.length - 1, useHi ? lo + 1 : lo)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  function paintMoon(ctx, W) {
    const cx = Math.round(W * 0.84);
    const cy = 12;
    const R = 5;
    for (let y = -R; y <= R; y++) {
      for (let x = -R; x <= R; x++) {
        const inside = x * x + y * y <= R * R;
        const bite = (x + 2) * (x + 2) + (y - 1) * (y - 1) <= R * R;
        if (inside && !bite) {
          ctx.fillStyle = x + y < -3 ? '#fffbe0' : '#f3dc8e';
          ctx.fillRect(cx + x, cy + y, 1, 1);
        }
      }
    }
  }

  function paintStage(ctx, W, H) {
    const top = floorY(H);
    const S = Grad.STAGE;
    ctx.fillStyle = S.trim;
    ctx.fillRect(0, top, W, 1);
    ctx.fillStyle = S.trimShade;
    ctx.fillRect(0, top + 1, W, 1);
    for (let y = top + 2; y < H; y++) {
      for (let x = 0; x < W; x++) {
        ctx.fillStyle = (x + y) % 6 === 0 ? S.carpetDark : S.carpet;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  function renderBackground(W, H) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    paintSky(ctx, W, H);
    paintMoon(ctx, W);
    paintStage(ctx, W, H);
    return canvas;
  }

  function makeStars(W, H) {
    const count = Math.round((W * floorY(H)) / 70);
    return Array.from({ length: count }, () => ({
      x: Math.floor(Math.random() * W),
      y: Math.floor(Math.random() * floorY(H) * 0.75),
      phase: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 3,
      bright: Math.random() < 0.15
    }));
  }

  function drawStars(ctx, stars, time) {
    stars.forEach((s) => {
      const glow = Math.sin(time * s.speed + s.phase);
      if (glow < -0.3) return;
      ctx.fillStyle = glow > 0.7 ? '#ffffff' : '#b9a6e8';
      ctx.fillRect(s.x, s.y, 1, 1);
      if (s.bright && glow > 0.8) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(s.x - 1, s.y, 1, 1);
        ctx.fillRect(s.x + 1, s.y, 1, 1);
        ctx.fillRect(s.x, s.y - 1, 1, 1);
        ctx.fillRect(s.x, s.y + 1, 1, 1);
      }
    });
  }

  function drawSpotlights(ctx, W, H, cx, time) {
    const top = floorY(H);
    const sway = Math.sin(time * 0.7) * 4;
    ctx.fillStyle = Grad.STAGE.spot;
    [[-W * 0.05, cx - 16 + sway, cx + 6 + sway], [W * 1.05, cx - 6 - sway, cx + 16 - sway]]
      .forEach(([sx, l, r]) => {
        ctx.beginPath();
        ctx.moveTo(sx, -2);
        ctx.lineTo(sx + 3, -2);
        ctx.lineTo(r, top);
        ctx.lineTo(l, top);
        ctx.closePath();
        ctx.fill();
      });
    ctx.fillStyle = 'rgba(255, 214, 120, 0.22)';
    ctx.fillRect(Math.round(cx - 15), top - 1, 30, 1);
    ctx.fillRect(Math.round(cx - 11), top, 22, 1);
  }

  Grad.Scene = Object.freeze({ floorY, renderBackground, makeStars, drawStars, drawSpotlights });
})();
