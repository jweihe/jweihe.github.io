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
