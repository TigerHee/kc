/**
 * Owner: jesse.shao@kupotech.com
 */
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
    img.onerror = () => {
      reject('picture loading failed');
    };
    img.src = `${url}?t=${+new Date()}`;
    if (img.complete) {
      img.onload = null;
      resolve(img);
    }
  });
};

export async function preloadImageAndClip(url, clip = 240) {
  const clipImage = (img) => {
    const width = img.width;
    const height = img.height;
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height - clip;
    ctx.drawImage(img, 0, 0, width, height - clip, 0, 0, width, height - clip);
    const ret = canvas.toDataURL('image/png');
    canvas = null;
    return ret;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      img.onload = null;
      resolve(
        clipImage(img)
      );
    };
    img.onerror = () => {
      reject('picture loading failed');
    };
    img.src = `${url}?t=${+new Date()}`;
    if (img.complete) {
      img.onload = null;
      resolve(
        clipImage(img)
      );
    }
  });
}

export default preloadImg;
