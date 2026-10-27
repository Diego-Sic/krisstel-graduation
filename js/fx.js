window.Grad = window.Grad || {};

// Fireworks + confetti. Every step returns a new state; nothing is mutated in place.
(function () {
  const GRAVITY = 34;
  const DRAG = 0.982;
  const ROCKET_SPEED = 110;
  const CONFETTI_COLORS = ['#dc1f26', '#ffd23f', '#ffffff', '#ff7ab8'];

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function empty() {
    return Object.freeze({ rockets: [], sparks: [], confetti: [], flash: 0, shake: 0 });
  }

  function launch(state, W, H, target) {
    const tx = target ? target.x : rand(W * 0.08, W * 0.92);
    const ty = target ? target.y : rand(H * 0.08, H * 0.42);
    const rocket = { x: tx + rand(-6, 6), y: H, tx, ty, color: pick(Grad.FIREWORK_COLORS) };
    return { ...state, rockets: [...state.rockets, rocket] };
  }

  function makeBurst(x, y, color, big) {
    const count = big ? 90 : 56;
    const alt = pick(Grad.FIREWORK_COLORS);
    const ring = Math.random() < 0.35;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rand(-0.08, 0.08);
      const speed = ring ? (big ? 52 : 40) : rand(big ? 18 : 12, big ? 62 : 46);
      return {
        x, y, px: x, py: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: rand(0.9, big ? 2.0 : 1.5),
        color: i % 3 === 0 ? alt : color,
        glitter: Math.random() < 0.25
      };
    });
  }

  function makeConfetti(W, count, fromTop) {
    return Array.from({ length: count }, () => ({
      x: rand(0, W),
      y: fromTop ? rand(-40, -2) : rand(-10, 0),
      vy: rand(9, 20),
      phase: rand(0, Math.PI * 2),
      color: pick(CONFETTI_COLORS),
      tall: Math.random() < 0.5
    }));
  }

  function stepRockets(rockets, dt) {
    const moved = rockets.map((r) => ({ ...r, y: r.y - ROCKET_SPEED * dt }));
    return {
      flying: moved.filter((r) => r.y > r.ty),
      exploded: moved.filter((r) => r.y <= r.ty)
    };
  }

  function stepSpark(p, dt) {
    const drag = Math.pow(DRAG, dt * 60);
    return {
      ...p,
      px: p.x, py: p.y,
      x: p.x + p.vx * dt,
      y: p.y + p.vy * dt,
      vx: p.vx * drag,
      vy: p.vy * drag + GRAVITY * dt,
      age: p.age + dt
    };
  }

  function step(state, dt, W, H, opts) {
    const { flying, exploded } = stepRockets(state.rockets, dt);
    const big = opts && opts.big;
    const newSparks = exploded.flatMap((r) => makeBurst(r.tx, r.ty, r.color, big));
    const sparks = [...state.sparks.map((p) => stepSpark(p, dt)), ...newSparks]
      .filter((p) => p.age < p.life && p.y < H + 2);
    const confetti = state.confetti
      .map((c) => ({ ...c, y: c.y + c.vy * dt, phase: c.phase + dt * 3 }))
      .filter((c) => c.y < H + 2);
    const boom = exploded.length > 0 && !(opts && opts.calm);
    return Object.freeze({
      rockets: flying,
      sparks,
      confetti,
      flash: boom ? Math.min(0.35, state.flash + 0.18 * exploded.length) : Math.max(0, state.flash - dt * 1.6),
      shake: boom ? Math.min(6, state.shake + 2.5 * exploded.length) : Math.max(0, state.shake - dt * 14)
    });
  }

  function addConfetti(state, W, count) {
    return { ...state, confetti: [...state.confetti, ...makeConfetti(W, count, true)] };
  }

  function draw(ctx, state, time) {
    state.rockets.forEach((r) => {
      ctx.fillStyle = '#fff4c2';
      ctx.fillRect(Math.round(r.x), Math.round(r.y), 1, 1);
      ctx.fillStyle = r.color;
      ctx.fillRect(Math.round(r.x), Math.round(r.y) + 1, 1, 2);
    });
    state.sparks.forEach((p) => {
      const fade = 1 - p.age / p.life;
      if (p.glitter && Math.sin(time * 40 + p.x) < 0) return;
      ctx.globalAlpha = fade * 0.45;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.px), Math.round(p.py), 1, 1);
      ctx.globalAlpha = Math.min(1, fade * 1.4);
      ctx.fillStyle = p.age < 0.08 ? '#ffffff' : p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
    });
    ctx.globalAlpha = 1;
    state.confetti.forEach((c) => {
      const flip = Math.sin(c.phase) > 0;
      ctx.fillStyle = c.color;
      ctx.fillRect(Math.round(c.x + Math.sin(c.phase) * 2), Math.round(c.y), flip ? 1 : 2, c.tall && flip ? 2 : 1);
    });
  }

  Grad.Fx = Object.freeze({ empty, launch, step, addConfetti, draw });
})();
