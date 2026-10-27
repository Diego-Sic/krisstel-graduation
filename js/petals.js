window.Grad = window.Grad || {};

// Drifting petals + soft glints. Every step returns a new state; nothing is mutated in place.
(function () {
  const MAX_PETALS = 140;
  const WIND = 3;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function empty() {
    return Object.freeze({ petals: [], glints: [] });
  }

  function makePetal(x, y, vx, vy) {
    return {
      x, y, vx, vy,
      phase: rand(0, Math.PI * 2),
      spin: rand(1.5, 3.5),
      color: pick(Grad.PETAL_COLORS)
    };
  }

  // spreadH: when given, petals start anywhere above that height (used to pre-fill the sky).
  function drift(state, W, count, spreadH) {
    const room = Math.max(0, MAX_PETALS - state.petals.length);
    const startY = () => (spreadH ? rand(0, spreadH) : rand(-30, -2));
    const fresh = Array.from({ length: Math.min(count, room) }, () =>
      makePetal(rand(-10, W), startY(), rand(1, 4), rand(5, 10)));
    return { ...state, petals: [...state.petals, ...fresh] };
  }

  function scatter(state, x, y) {
    const COUNT = 16;
    const burst = Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2;
      const speed = rand(6, 14);
      return makePetal(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 4);
    });
    const glint = { x, y, age: 0, life: 1.2 };
    return { ...state, petals: [...state.petals, ...burst], glints: [...state.glints, glint] };
  }

  function addGlint(state, W, H) {
    const glint = { x: rand(4, W - 4), y: rand(4, H * 0.55), age: 0, life: rand(0.9, 1.6) };
    return { ...state, glints: [...state.glints, glint] };
  }

  function stepPetal(p, dt) {
    const settle = Math.pow(0.97, dt * 60);
    return {
      ...p,
      x: p.x + (p.vx + Math.sin(p.phase) * WIND) * dt,
      y: p.y + p.vy * dt,
      vx: p.vx * settle + (1 - settle) * 2,
      vy: p.vy * settle + (1 - settle) * 8,
      phase: p.phase + p.spin * dt
    };
  }

  function step(state, dt, W, H) {
    return Object.freeze({
      petals: state.petals.map((p) => stepPetal(p, dt)).filter((p) => p.y < H + 2 && p.x < W + 4),
      glints: state.glints.map((g) => ({ ...g, age: g.age + dt })).filter((g) => g.age < g.life)
    });
  }

  function drawGlint(ctx, g) {
    const t = g.age / g.life;
    const reach = t < 0.5 ? Math.round(t * 6) : Math.round((1 - t) * 6);
    const x = Math.round(g.x);
    const y = Math.round(g.y);
    ctx.fillStyle = '#fff8f0';
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = 'rgba(255, 220, 230, 0.7)';
    for (let i = 1; i <= reach; i++) {
      ctx.fillRect(x - i, y, 1, 1);
      ctx.fillRect(x + i, y, 1, 1);
      ctx.fillRect(x, y - i, 1, 1);
      ctx.fillRect(x, y + i, 1, 1);
    }
  }

  function draw(ctx, state) {
    state.petals.forEach((p) => {
      const turn = Math.sin(p.phase);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.abs(turn) > 0.4 ? 2 : 1, 1);
      if (turn > 0.7) ctx.fillRect(Math.round(p.x) + 1, Math.round(p.y) + 1, 1, 1);
    });
    state.glints.forEach((g) => drawGlint(ctx, g));
  }

  Grad.Petals = Object.freeze({ empty, drift, scatter, addGlint, step, draw });
})();
