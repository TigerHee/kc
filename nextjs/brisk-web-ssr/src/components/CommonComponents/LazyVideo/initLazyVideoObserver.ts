/**
 * Video懒加载观察器
 * 基于IntersectionObserver实现video元素的懒加载
 */

let lazyVideoObserver: IntersectionObserver | null = null;

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  const _lazyVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyVideo = entry.target as HTMLVideoElement;

        // 处理带有data-src的懒加载视频
        if (lazyVideo.dataset.src) {
          lazyVideo.src = lazyVideo.dataset.src;
          lazyVideo.classList.remove('lazy-video');
          lazyVideo.load(); // 手动触发加载
          _lazyVideoObserver.unobserve(lazyVideo);
        }
      }
    });
  }, {
    // 提前一些开始加载视频，因为视频文件通常比图片大
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  lazyVideoObserver = _lazyVideoObserver;
}

export { lazyVideoObserver };
