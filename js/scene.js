window.Grad = window.Grad || {};

// Static backdrop (dithered dusk sky, grass) is pre-rendered once per resize;
// stars, glow and the swaying flower bed are drawn every frame.
(function () {
  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  const GROUND_HEIGHT = 9;
  const FLOWER_SPACING = 4;

  function floorY(H) {
    return H - GROUND_HEIGHT;
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
          ctx.fillStyle = x + y < -3 ? '#fffbe0' : '#f6e3b0';
          ctx.fillRect(cx + x, cy + y, 1, 1);
        }
      }
    }
  }

  function paintGround(ctx, W, H) {
    const top = floorY(H);
    const G = Grad.GARDEN;
    for (let y = top; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const edge = y === top || (y === top + 1 && (x * 7) % 5 === 0);
        ctx.fillStyle = edge ? G.grassTop : (x * 3 + y * 5) % 7 === 0 ? G.grassDark : G.grass;
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
    paintGround(ctx, W, H);
    return canvas;
  }

  function makeStars(W, H) {
    const count = Math.round((W * floorY(H)) / 160);
    return Array.from({ length: count }, () => ({
      x: Math.floor(Math.random() * W),
      y: Math.floor(Math.random() * floorY(H) * 0.45),
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4
    }));
  }

  // One flower per slot along the ground, leaving a clearing where she stands.
  function makeFlowers(W, H, clearing) {
    const base = floorY(H) + 1;
    const slots = Math.floor(W / FLOWER_SPACING);
    return Array.from({ length: slots }, (_, i) => i * FLOWER_SPACING + 2)
      .filter((x) => x < clearing.from || x > clearing.to)
      .map((x) => ({
        x: x + Math.floor(Math.random() * 2),
        base,
        height: 2 + Math.floor(Math.random() * 4),
        kind: Math.random() < 0.3 ? 'tulip' : 'daisy',
        color: Grad.FLOWER_HEADS[Math.floor(Math.random() * Grad.FLOWER_HEADS.length)],
        phase: Math.random() * Math.PI * 2
      }));
  }

  function drawStars(ctx, stars, time) {
    stars.forEach((s) => {
      const glow = Math.sin(time * s.speed + s.phase);
      if (glow < 0) return;
      ctx.fillStyle = glow > 0.75 ? '#fff6f0' : '#d8bfe6';
      ctx.fillRect(s.x, s.y, 1, 1);
    });
  }

  function drawFlower(ctx, f, time) {
    const G = Grad.GARDEN;
    const sway = Math.sin(time * 1.2 + f.phase) > 0.5 ? 1 : 0;
    const top = f.base - f.height;
    ctx.fillStyle = G.stem;
    ctx.fillRect(f.x, top + 1, 1, f.height);
    ctx.fillStyle = G.leaf;
    ctx.fillRect(f.x + 1, f.base - 1, 1, 1);
    const hx = f.x + sway;
    ctx.fillStyle = f.color;
    if (f.kind === 'tulip') {
      ctx.fillRect(hx - 1, top - 1, 3, 2);
      ctx.fillRect(hx - 1, top - 2, 1, 1);
      ctx.fillRect(hx + 1, top - 2, 1, 1);
      return;
    }
    ctx.fillRect(hx - 1, top, 3, 1);
    ctx.fillRect(hx, top - 1, 1, 3);
    ctx.fillStyle = G.center;
    ctx.fillRect(hx, top, 1, 1);
  }

  function drawFlowers(ctx, flowers, time) {
    flowers.forEach((f) => drawFlower(ctx, f, time));
  }

  function drawGlow(ctx, H, cx, time) {
    const top = floorY(H);
    const breathe = Math.sin(time * 0.8) > 0 ? 1 : 0;
    ctx.fillStyle = Grad.GARDEN.glow;
    [[22, 30], [17, 24], [12, 18]].forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(cx, top - 14, rx + breathe, ry + breathe, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  Grad.Scene = Object.freeze({
    floorY, renderBackground, makeStars, makeFlowers, drawStars, drawFlowers, drawGlow
  });
})();
