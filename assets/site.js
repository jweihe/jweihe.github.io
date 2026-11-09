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

// Font Awesome Bicycle; animate only the spokes behind its original silhouette.
(() => {
  const icon = document.querySelector('link[data-bike-icon]');
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!icon || !ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const image = new Image();
  let phase = 0, timer;
  function draw() {
    ctx.clearRect(0, 0, 64, 64);
    ctx.strokeStyle = '#547996'; ctx.lineWidth = .9;
    for (const x of [14.6, 49.4]) {
      for (let k = 0; k < 4; k++) {
        const a = phase + k * Math.PI / 2;
        ctx.beginPath();ctx.moveTo(x,41);ctx.lineTo(x+Math.cos(a)*6.3,41+Math.sin(a)*6.3);ctx.stroke();
      }
    }
    ctx.drawImage(image,0,0,64,64);
    icon.type = 'image/png';icon.href=canvas.toDataURL('image/png');
  }
  function schedule() {
    clearTimeout(timer);draw();
    if (!motion.matches) timer=setTimeout(()=>{phase+=Math.PI/12;schedule();},document.hidden?1000:180);
  }
  image.onload=schedule;
  image.src='assets/favicon-bike-64.png?v=3';
  motion.addEventListener('change',()=>{if(image.complete&&image.naturalWidth)schedule();});
  document.addEventListener('visibilitychange',()=>{if(image.complete&&image.naturalWidth)schedule();});
})();
