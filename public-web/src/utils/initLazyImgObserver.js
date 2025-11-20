/**
 * Owner: willen@kupotech.com
 */
let lazyImageObserver = null;
if ('IntersectionObserver' in window) {
  let _lazyImageObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        let lazyImage = entry.target;
        let classList = [].slice.call(lazyImage.classList);
        if (classList.includes('lazy-background')) {
          lazyImage.classList.add('visible');
          lazyImageObserver.unobserve(lazyImage);
        }
        if (lazyImage.dataset.src) {
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      }
    });
  });
  lazyImageObserver = _lazyImageObserver;
}
export { lazyImageObserver };
