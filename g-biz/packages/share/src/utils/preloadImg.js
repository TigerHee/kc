const preloadImg = (url, id) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.alt = id;
    img.id = id;
    img.onload = () => {
      img.onload = null;
      resolve(img);
    };
    img.error = () => {
      // eslint-disable-next-line
      reject('picture loading failed');
    };
    img.src = url;
    if (img.complete) {
      img.onload = null;
      resolve(img);
    }
  });
};

export default preloadImg;
