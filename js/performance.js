// performance.js — Optimisations de performance pour pazent.fr

// Lazy loading des images
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer pour lazy load
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          io.unobserve(e.target);
        }
      });
    });
    lazyImages.forEach(img => io.observe(img));
  }

  // Preconnect hints dynamiques
  const domains = ['fonts.googleapis.com', 'fonts.gstatic.com', 'api.github.com'];
  domains.forEach(d => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `https://${d}`;
    document.head.appendChild(link);
  });
});
