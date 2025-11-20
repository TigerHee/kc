/**
 * Owner: willen@kupotech.com
 */
/**
 * ImageCompressor
 * runtime: browser
 */
import ImageCompressor from 'compressorjs';

/**
 * 图片压缩
 * @param picture
 * @returns {Promise}
 */
const compress = (picture, quality = 0.4) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const ImageCompress = new ImageCompressor(picture, {
      quality,
      success(result) {
        if (result instanceof Blob) {
          resolve(new File([result], result.name, { type: result.type }));
        } else {
          resolve(result);
        }
      },
      error(e) {
        console.log(e.message);
        reject(e.message);
      },
    });
  });
};

export default compress;
