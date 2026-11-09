document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-topic]').forEach(paper => {
      paper.hidden = filter === 'selected' ? paper.dataset.selected !== 'true' : filter !== 'all' && !paper.dataset.topic.split(' ').includes(filter);
    });
  });
});
