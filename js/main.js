(function () {
  const TARGET_ROWS = 96;
  const MIN_PIXEL = 3;
  const AUTO_FIRE = { min: 0.35, max: 1.1 };
  const FINALE_EVERY = 9;
  const BLINK_EVERY = 3.2;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');

  let view = { W: 0, H: 0, P: 1 };
  let background = null;
  let stars = [];
  let fx = Grad.Fx.empty();
  let time = 0;
  let nextAuto = 0.3;
  let nextFinale = 3;
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
  }

  function finale() {
    const { W, H } = view;
    const shots = reduceMotion ? 2 : 6;
    fx = Array.from({ length: shots }).reduce((s) => Grad.Fx.launch(s, W, H), fx);
    fx = Grad.Fx.addConfetti(fx, W, reduceMotion ? 20 : 70);
  }

  function schedule(dt) {
    nextAuto -= dt;
    nextFinale -= dt;
    if (nextAuto <= 0) {
      fx = Grad.Fx.launch(fx, view.W, view.H);
      const slow = reduceMotion ? 3 : 1;
      nextAuto = (AUTO_FIRE.min + Math.random() * (AUTO_FIRE.max - AUTO_FIRE.min)) * slow;
    }
    if (nextFinale <= 0) {
      finale();
      nextFinale = FINALE_EVERY;
    }
  }

  function drawGraduate() {
    const { W, H } = view;
    const size = Grad.GRADUATE_SIZE;
    const bob = Math.sin(time * 3) > 0.6 ? -1 : 0;
    const x = Math.round(W / 2 - size.w / 2);
    const y = Grad.Scene.floorY(H) - size.h + bob;
    const blinking = time % BLINK_EVERY < 0.12;
    Grad.drawSprite(ctx, Grad.GRADUATE, x, y, Grad.PALETTE, blinking ? { E: 's' } : null);
    Grad.drawTassel(ctx, x, y, time, Grad.PALETTE);
  }

  function render() {
    const { W, H } = view;
    ctx.drawImage(background, 0, 0);
    Grad.Scene.drawStars(ctx, stars, time);
    Grad.Scene.drawSpotlights(ctx, W, H, W / 2, time);
    Grad.Fx.draw(ctx, fx, time);
    drawGraduate();
    if (fx.flash > 0) {
      ctx.fillStyle = `rgba(255, 236, 200, ${fx.flash})`;
      ctx.fillRect(0, 0, W, H);
    }
    const shake = reduceMotion ? 0 : fx.shake;
    const sx = Math.round((Math.random() - 0.5) * shake);
    const sy = Math.round((Math.random() - 0.5) * shake);
    document.body.style.setProperty('--shake', `${sx}px, ${sy}px`);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    schedule(dt);
    fx = Grad.Fx.step(fx, dt, view.W, view.H, { calm: reduceMotion });
    render();
    requestAnimationFrame(frame);
  }

  function onPointer(event) {
    const target = { x: event.clientX / view.P, y: event.clientY / view.P };
    fx = Grad.Fx.launch(fx, view.W, view.H, target);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointerdown', onPointer);
  resize();
  fx = Grad.Fx.addConfetti(fx, view.W, 90);
  requestAnimationFrame(frame);
})();
