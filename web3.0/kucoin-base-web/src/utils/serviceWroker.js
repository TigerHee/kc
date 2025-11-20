export const registerServiceWroker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // 注册 Service Worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // 注册成功
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          // registration.
          console.log(registration);
        })
        .catch((err) => {
          // 注册失败 :(
          console.warn('ServiceWorker registration failed: ', err);
        });
      // navigator.serviceWorker.ready.then((reg) => {
      //   // if (_DEV_) {
      //   //   console.log('ServiceWorker success reg ', reg);
      //   // }
      // });
    });
  }
};

export const unRegisterServiceWroker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(r => {
          r.unregister();
        })
      });
    });
  }
};
