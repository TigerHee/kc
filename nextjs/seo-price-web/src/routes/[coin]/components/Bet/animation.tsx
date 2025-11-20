/**
 * Owner: mcqueen@kupotech.com
 */
import floatIcon1 from '@/assets/price/floatIcon1.svg';
import floatIcon10 from '@/assets/price/floatIcon10.svg';
import floatIcon2 from '@/assets/price/floatIcon2.svg';
import floatIcon3 from '@/assets/price/floatIcon3.svg';
import floatIcon4 from '@/assets/price/floatIcon4.svg';
import floatIcon5 from '@/assets/price/floatIcon5.svg';
import floatIcon6 from '@/assets/price/floatIcon6.svg';
import floatIcon7 from '@/assets/price/floatIcon7.svg';
import floatIcon8 from '@/assets/price/floatIcon8.svg';
import floatIcon9 from '@/assets/price/floatIcon9.svg';

function getRandom(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const ICON_LIST = [
  floatIcon1,
  floatIcon2,
  floatIcon3,
  floatIcon4,
  floatIcon5,
  floatIcon6,
  floatIcon7,
  floatIcon8,
  floatIcon9,
  floatIcon10,
];

export class ThumbsUpAni {
  imgsList: any[] = [];
  context;
  width = 0;
  height = 0;
  scanning = false;
  renderList: any[] = [];
  scaleTime = 0.1; // 百分比

  constructor() {
    this.loadImages();
    const canvas = document.getElementById('thumsCanvas') as HTMLCanvasElement;
    if (canvas && canvas.getContext) {
      this.context = canvas.getContext('2d');
    }
    this.width = canvas.width;
    this.height = canvas.height;
  }

  loadImages() {
    const promiseAll: Promise<any>[] = [];

    ICON_LIST.forEach((src) => {
      const p = new Promise(function (resolve) {
        const img = new Image();
        img.onerror = img.onload = resolve.bind(null, img);
        img.src = src;
      });
      promiseAll.push(p);
    });

    Promise.all(promiseAll).then((imgsList) => {
      this.imgsList = imgsList.filter((d) => {
        if (d && d.width > 0) return true;
        return false;
      });
      if (this.imgsList.length == 0) {
        console.log('error', 'imgsList load all error');
        return;
      }
    });
  }
  createRender() {
    if (this.imgsList.length == 0) return null;
    const basicScale = [0.9, 1, 1.2][getRandom(0, 2)];

    const getScale = (diffTime) => {
      if (diffTime < this.scaleTime) {
        return +(diffTime / this.scaleTime).toFixed(2) * basicScale;
      } else {
        return basicScale;
      }
    };
    const context = this.context;
    // 随机读取一个图片来渲染
    const image = this.imgsList[getRandom(0, this.imgsList.length - 1)];
    const image2 = this.imgsList[getRandom(0, this.imgsList.length - 1)];

    const offset = 20;
    const basicX = this.width / 2 + getRandom(-offset, offset);
    const angle = getRandom(2, 10);
    let ratio = getRandom(10, 30) * (getRandom(0, 1) ? 1 : -1);
    const getTranslateX = (diffTime) => {
      if (diffTime < this.scaleTime) {
        // 放大期间，不进行摇摆位移
        return basicX;
      } else {
        return basicX + ratio * Math.sin(angle * (diffTime - this.scaleTime));
      }
    };

    const getTranslateY = (diffTime, image) => {
      return image.height / 2 + (this.height - image.height / 2) * (1 - diffTime);
    };

    const fadeOutStage = getRandom(50, 100) / 100;
    const getAlpha = (diffTime) => {
      let left = 1 - +diffTime;
      if (left > fadeOutStage) {
        return 1;
      } else {
        return 1 - +((fadeOutStage - left) / fadeOutStage).toFixed(2);
      }
    };

    const diffRandom = getRandom(1, 10) / 10;

    const renderImage = (diffTime, image) => {
      if (context) {
        context.save();
        const scale = getScale(diffTime);
        const translateX = getTranslateX(diffTime);
        const translateY = getTranslateY(diffTime, image);
        context.translate(translateX, translateY);
        context.scale(scale, scale);
        const alpha = getAlpha(diffTime);
        context.globalAlpha = alpha;
        context.drawImage(image, -image.width / 2, -image.height / 2, 40 * alpha, 40 * alpha);
        context.restore();
      }
    };

    return (diffTime) => {
      // 差值满了，即结束了 0 ---》 1
      if (diffTime >= 1) return true;
      renderImage(diffTime, image);
      // 第二张
      renderImage(diffRandom * diffTime, image2);
    };
  }

  scan() {
    if (this.context) {
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.fillRect(0, 0, 200, 400);
    }
    let index = 0;
    let length = this.renderList.length;
    if (length > 0) {
      requestFrame(this.scan.bind(this));
      this.scanning = true;
    } else {
      this.scanning = false;
    }
    while (index < length) {
      const child = this.renderList[index];
      if (
        !child ||
        !child.render ||
        child.render.call(null, (Date.now() - child.timestamp) / child.duration)
      ) {
        // 结束了，删除该动画
        this.renderList.splice(index, 1);
        length--;
      } else {
        // continue
        index++;
      }
    }
  }
  start() {
    const render = this.createRender();
    const duration = getRandom(1500, 3000);
    this.renderList.push({
      render,
      duration,
      timestamp: Date.now(),
    });
    if (!this.scanning) {
      this.scanning = true;
      requestFrame(this.scan.bind(this));
    }
    return this;
  }
}

function requestFrame(cb) {
  if (typeof window === 'undefined') return;
  
  return (
    window.requestAnimationFrame ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  )(cb);
}
