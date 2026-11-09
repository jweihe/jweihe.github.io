document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-topic]').forEach(paper => {
      paper.hidden = filter === 'selected' ? paper.dataset.selected !== 'true' : filter !== 'all' && !paper.dataset.topic.split(' ').includes(filter);
    });
  });
});

// Track the section nearest the sticky header, including long publication lists.
(() => {
  const links = [...document.querySelectorAll('.section-nav a')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  if (!sections.length) return;
  let queued = false;
  function update() {
    queued = false;
    const offset = document.querySelector('.site-header').getBoundingClientRect().height + 65;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) current = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) current = sections[sections.length - 1];
    links.forEach(link => {
      const active = link.hash === '#' + current.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Static SVG fallback remains available before scripts load and with reduced motion.
(() => {
  const icon = document.querySelector('link[rel="icon"]');
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!icon || !ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let phase = 0, timer;
  function draw() {
    ctx.clearRect(0, 0, 64, 64);
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const x of [15, 49]) {
      ctx.strokeStyle = '#47627a'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(x, 44, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#a8742a'; ctx.lineWidth = 1.5;
      for (let k = 0; k < 6; k++) {
        const a = phase + k * Math.PI / 3;
        ctx.beginPath(); ctx.moveTo(x, 44); ctx.lineTo(x + Math.cos(a) * 10, 44 + Math.sin(a) * 10); ctx.stroke();
      }
    }
    ctx.strokeStyle = '#2f5d8a'; ctx.lineWidth = 3;
    const line = points => {ctx.beginPath(); points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
    line([[15,44],[25,24],[32,44],[15,44],[40,24],[49,44]]);
    line([[25,24],[40,24]]); line([[21,21],[30,21]]); line([[32,44],[36,48]]);
    ctx.beginPath();ctx.moveTo(39,20);ctx.lineTo(49,20);ctx.bezierCurveTo(59,20,58,30,51,30);ctx.stroke();
    icon.type = 'image/png'; icon.href = canvas.toDataURL('image/png');
  }
  function schedule() {
    clearTimeout(timer); draw();
    if (!motion.matches) timer = setTimeout(() => {phase += Math.PI / 12; schedule();}, document.hidden ? 1000 : 180);
  }
  motion.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
})();
