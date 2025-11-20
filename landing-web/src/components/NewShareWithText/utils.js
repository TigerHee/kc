/**
 * Owner: melono@kupotech.com
 */
/**
 * 参考的 2022年年度账单
 *  2023年的年度账单也是用的这里的dom2base64；后面如果有修改dom2base64，请麻烦回归一下/land/annual-bill。 2023.12.23 Melon
 */
import { getBase64 } from 'utils/createImg';

// 深度优先遍历dom节点
const DFSDomTraversal = (root) => {
  if (!root) return;

  const arr = [],
    queue = [root];
  let node = queue.shift();

  while (node) {
    arr.push(node);
    if (node.children.length) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        queue.unshift(node.children[i]);
      }
    }

    node = queue.shift();
  }

  return arr;
};

// 要复制的样式
export const CSS_RULES = [
  "width",
  "height",
  "max-height",
  "max-width",
  "margin",
  "margin-top",
  "margin-left",
  "margin-right",
  "margin-bottom",
  "padding",
  "padding-top",
  "padding-left",
  "padding-right",
  "padding-bottom",
  "text-align",
  "font-family",
  "font-weight",
  "font-size",
  "line-height",
  "word-break",
  "word-wrap",
  "white-space",
  "color",
  "position",
  "left",
  "right",
  "bottom",
  "top",
  "display",
  "flex-direction",
  "align-items",
  "justify-content",
  "box-sizing",
  "transform",
  "background",
  "background-color",
  "background-image",
  "background-repeat",
  "background-size",
  "background-position",
  "flex",

];

export const copyStyle = (element) => {
  const styles = getComputedStyle(element);

  CSS_RULES.forEach((rule) => {
    element.style.setProperty(rule, styles.getPropertyValue(rule));
  });
  element.style.setProperty('font-family', 'Roboto');
};

export const img2base64 = (element) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // 处理 canvas 加载img跨域问题
    img.crossOrigin = 'anonymous';

    img.onerror = reject;
    img.onload = function () {
      let canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);

      const res = getBase64({ canvas });
      canvas = null; // 释放
      resolve(res);
    };

    img.src = element.src;
  });
};


export const dom2base64 = async (root) => {
  DFSDomTraversal(root).forEach(copyStyle);

  const imgElements = [...root.querySelectorAll('img')];

  const base64Result = await Promise.all(imgElements.map(img2base64));

  const width = root.offsetWidth;
  const height = root.offsetHeight;
  let XHTML = new XMLSerializer().serializeToString(root);

  imgElements.forEach((element, index) => {
    XHTML = XHTML.replace(element.getAttribute('src'), base64Result[index]);
  });

  const {
    ROBOTO_400_BASE64_WOFF2,
    ROBOTO_500_BASE64_WOFF2,
    ROBOTO_600_BASE64_WOFF2,
    ROBOTO_700_BASE64_WOFF2
  } = await import(
    /* webpackChunkName: "p__KuRewards___share__fonts" */ './fonts'
  );
  const SVGDomElement = `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="${width}">
                            <defs>
                              <style type="text/css">
                              @font-face {
                                font-family: 'Roboto';
                                font-display: swap;
                                font-weight: 400;
                                src: ${ROBOTO_400_BASE64_WOFF2};
                              }
                              @font-face {
                                font-family: 'Roboto';
                                font-display: swap;
                                font-weight: 500;
                                src: ${ROBOTO_500_BASE64_WOFF2};
                              }
                              @font-face {
                                font-family: 'Roboto';
                                font-display: swap;
                                font-weight: 600;
                                src: ${ROBOTO_600_BASE64_WOFF2};
                              }
                              @font-face {
                                font-family: 'Roboto';
                                font-display: swap;
                                font-weight: 700;
                                src: ${ROBOTO_700_BASE64_WOFF2};
                              }
                              </style>
                            </defs>
                            <foreignObject height="100%" width="100%">${XHTML}</foreignObject>
                        </svg>`;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = `data:image/svg+xml,${SVGDomElement}`;

  return img;
};
export const createDom2Base64 = (id = 'KuShare_diy_text_wrapper') => {
  return dom2base64(document.getElementById(id))
    .then((res) => {
      const imgs = [
        {
          img: res,
          x: 0,
          y: 0,
          width: 375,
          height: 585,
        },
      ];
      return {
        imgs,
        res,
      };
    })
    .catch((res) => {
      return {
        imgs: [],
        res,
      };
    });
};
