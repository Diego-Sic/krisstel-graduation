(function () {
  const TARGET_ROWS = 96;
  const MIN_PIXEL = 3;
  const DRIFT_EVERY = 0.35;
  const GLINT_EVERY = { min: 1.2, max: 3 };
  const BLINK_EVERY = 4.2;
  const CLEARING = 16;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');

  let view = { W: 0, H: 0, P: 1 };
  let background = null;
  let stars = [];
  let flowers = [];
  let petals = Grad.Petals.empty();
  let time = 0;
  let nextDrift = 0;
  let nextGlint = 1;
  let last = performance.now();

  function resize() {
    const P = Math.max(MIN_PIXEL, Math.round(window.innerHeight / TARGET_ROWS));
    const W = Math.ceil(window.innerWidth / P);
    const H = Math.ceil(window.innerHeight / P);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = `${W * P}px`;
    canvas.style.height = `${H * P}px`;
    view = { W, H, P };
    background = Grad.Scene.renderBackground(W, H);
    stars = Grad.Scene.makeStars(W, H);
    flowers = Grad.Scene.makeFlowers(W, H, { from: W / 2 - CLEARING, to: W / 2 + CLEARING });
  }

  function schedule(dt) {
    nextDrift -= dt;
    nextGlint -= dt;
    if (nextDrift <= 0) {
      petals = Grad.Petals.drift(petals, view.W, reduceMotion ? 1 : 2);
      nextDrift = DRIFT_EVERY * (reduceMotion ? 3 : 1);
    }
    if (nextGlint <= 0) {
      petals = Grad.Petals.addGlint(petals, view.W, view.H);
      nextGlint = GLINT_EVERY.min + Math.random() * (GLINT_EVERY.max - GLINT_EVERY.min);
    }
  }

  function drawGraduate() {
    const { W, H } = view;
    const size = Grad.GRADUATE_SIZE;
    const sway = Math.sin(time * 1.1) > 0.8 ? -1 : 0;
    const x = Math.round(W / 2 - size.w / 2);
    const y = Grad.Scene.floorY(H) - size.h + sway;
    const blinking = time % BLINK_EVERY < 0.14;
    Grad.drawSprite(ctx, Grad.GRADUATE, x, y, Grad.PALETTE, blinking ? { E: 's' } : null);
    Grad.drawTassel(ctx, x, y, time * 0.6, Grad.PALETTE);
  }

  function render() {
    const { W, H } = view;
    ctx.drawImage(background, 0, 0);
    Grad.Scene.drawStars(ctx, stars, time);
    Grad.Scene.drawGlow(ctx, H, W / 2, time);
    drawGraduate();
    Grad.Scene.drawFlowers(ctx, flowers, time);
    Grad.Petals.draw(ctx, petals);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    schedule(dt);
    petals = Grad.Petals.step(petals, dt, view.W, view.H);
    render();
    requestAnimationFrame(frame);
  }

  function onPointer(event) {
    petals = Grad.Petals.scatter(petals, event.clientX / view.P, event.clientY / view.P);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointerdown', onPointer);
  resize();
  petals = Grad.Petals.drift(petals, view.W, 40, view.H * 0.8);
  requestAnimationFrame(frame);
})();
