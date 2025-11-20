/**
 * Owner: willen@kupotech.com
 */

let lazyImageObserver: IntersectionObserver | null = null;

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  const _lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target as HTMLImageElement;

        // Handle lazy background images
        if (lazyImage.classList.contains('lazy-background')) {
          lazyImage.classList.add('visible');
          _lazyImageObserver.unobserve(lazyImage);
          return;
        }

        // Handle lazy images with data-src
        if (lazyImage.dataset.src) {
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          _lazyImageObserver.unobserve(lazyImage);
        }
      }
    });
  });

  lazyImageObserver = _lazyImageObserver;
}

export { lazyImageObserver };
