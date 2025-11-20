/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 计算渲染文字，换行
 * @param {*} context 绘制上下文环境
 * @param {*} text 字符串
 * @param {*} firstWidth 第一行最大渲染宽度
 * @param {*} maxWidth 最大渲染宽度
 * @param {*} isZh 是否中文
 * @param {*} scale 缩放比例
 */
const strCompute = params => {
  const { context, text, firstWidth = 346, maxWidth = 346, isZh = false, scale = 2 } = params || {};
  if (!context) {
    throw Error('need context!');
  }
  if (!text || text === 0) {
    throw Error('need string!');
  }

  const lineArr = [];
  const splitChar = isZh ? '' : ' ';
  const arrText = text.toString().split(splitChar);
  let line = '';
  let nowCheckWidth = firstWidth * scale;
  for (let n = 0; n < arrText.length; n++) {
    const testLine = line + arrText[n] + splitChar;
    const testWidth = context.measureText(testLine).width;
    if (testWidth > nowCheckWidth) {
      // 需要换行了
      nowCheckWidth = maxWidth * scale;
      lineArr.push(line);
      line = arrText[n] + splitChar;
    } else {
      // 一行还有增加空间
      line = testLine;
    }
  }
  if (line && line.length) {
    // 还有一行
    lineArr.push(line);
  }
  return lineArr;
};

/**
 * 生成结果base64
 * @param {*} canvas 画布
 * @param {*} format 格式：png、jpg/jpeg
 * @param {*} hidePre 是否去除前缀
 * @param {*} quality 质量
 */
export const getBase64 = ({ canvas, format = 'png', hidePre = false, quality = 1.0 }) => {
  if (!canvas) {
    return '';
  }
  if (format === 'png') {
    return hidePre
      ? canvas.toDataURL('image/png', quality).slice('data:image/png;base64,'.length)
      : canvas.toDataURL('image/png', quality);
  } else if (['jpg', 'jpeg'].includes(format)) {
    return hidePre
      ? canvas.toDataURL('image/jpeg', quality).slice('data:image/jpeg;base64,'.length)
      : canvas.toDataURL('image/jpeg', quality);
  } else {
    throw Error('No support at the moment!');
  }
};

/**
 * 文字渲染
 * @param {*} texts 文字列表
 * @param {*} context 绘制上下文环境
 * @param {*} scale 缩放比例
 * @param {*} isZh 是否中文
 * @param {*} paddingLeft 固定左边距
 * @param {*} isRender 是否进行渲染
 * @param {*} padding 额外的边距
 */
const textRender = ({
  texts,
  context,
  scale,
  isZh,
  paddingLeft = 24,
  isRender = true,
  padding = 0,
}) => {
  let dynamicX = 0;
  let dynamicY = 0;
  let realMaxWidth = 0; // 实际最长的行长度
  let topY = 0; // 最顶行文字的y
  let fontHeight = 0; // 文字行高
  texts.forEach(item => {
    const {
      color = '#E0E1DF',
      fontSize = 14,
      fontWeight = 'normal',
      fontFamily = 'Roboto',
      text: _text = '',
      y,
      x = 24,
      textAlign = 'start',
      needCompute = false, // 是否是动态大小，若是，后面文字的坐标将在此基础上增加
      firstWidth = 346,
      maxWidth = 346,
      lineHeight = 18, // 行高
      lineSpace = 8, // 行间距
      wordSpace = 3, // 词间距
      newLine = false, // 是否是新的一行
      independent = false, // 独立定位，一般放到最后
      isUnit = false,
      isDynamic = false, // 是否需要完全动态计算x、y
      textList,
    } = item || {};
    if (newLine) {
      dynamicX = 0;
    }
    if (independent) {
      dynamicY = 0;
    }
    const text = _text === 0 ? '0' : _text;
    if (text) {
      context.textAlign = textAlign;
      context.fillStyle = color;
      context.font = `${fontWeight || 'normal'} ${fontSize * scale}px ${fontFamily}`;
      if (!needCompute && !dynamicX && !dynamicY) {
        const { width = 0, fontBoundingBoxAscent = 0 } = context.measureText(text) || {};
        if (!topY) {
          topY = y;
          fontHeight = fontBoundingBoxAscent / scale;
        }
        realMaxWidth = width / scale;
        if (isRender) {
          context.fillText(text, x * scale, y * scale);
        }
      } else {
        const lineArr = strCompute({
          context,
          text,
          firstWidth: firstWidth - dynamicX,
          maxWidth,
          isZh,
          scale,
        });
        lineArr.forEach((itemUse, index) => {
          if (index) {
            // 非首行
            const _x = x + padding;
            // eslint-disable-next-line no-mixed-operators
            const _y = y + dynamicY + (lineHeight + lineSpace) * index;
            if (isRender) {
              context.fillText(itemUse, _x * scale, _y * scale);
            }
          } else {
            // 首行
            const needDel = isUnit ? (isZh ? wordSpace : wordSpace * 2) : 0;
            // eslint-disable-next-line no-mixed-operators
            const _x = x + padding + dynamicX - (needDel || 0);
            const _y = y + dynamicY;
            if (!topY) {
              topY = _y;
              fontHeight = context.measureText(itemUse).fontBoundingBoxAscent / scale;
            }
            if (isRender) {
              context.fillText(itemUse, _x * scale, _y * scale);
            }
          }
          const nowWidth = context.measureText(itemUse).width / scale;
          if (nowWidth > realMaxWidth) {
            realMaxWidth = nowWidth;
          }
          if (index === lineArr.length - 1) {
            // 最后一行，计算 dynamicX dynamicY
            dynamicY += (lineHeight + lineSpace) * index;
            dynamicX = index ? nowWidth + wordSpace : nowWidth + wordSpace + dynamicX;
          }
        });
      }
    }
    if (isDynamic && textList) {
      let _dynamicX = dynamicX;
      let nowLine = 0; // 当前行
      const computeArr = []; // 计算后的每行内容
      const computeArrWidth = []; // 计算后的每行宽度
      context.textAlign = 'start';
      textList.forEach(item2 => {
        const {
          fontFamily: fontFamily2 = 'Roboto',
          fontWeight: fontWeight2 = 'normal',
          color: color2 = '',
          fontSize: fontSize2 = 14,
          text: text2 = '',
          lineHeight: lineHeight2 = 18,
          lineSpace: lineSpace2 = 8,
        } = item2 || {};
        context.fillStyle = color2;
        context.font = `${fontWeight2 || 'normal'} ${fontSize2 * scale}px ${fontFamily2}`;
        const lineArr = strCompute({
          context,
          text: text2,
          firstWidth: firstWidth - _dynamicX,
          maxWidth,
          isZh,
          scale,
        });
        lineArr.forEach((itemUse, index) => {
          const nowWidth = context.measureText(itemUse).width / scale;
          if (index === lineArr.length - 1) {
            // 最后一行，计算 _dynamicX
            _dynamicX = index ? nowWidth + wordSpace : nowWidth + wordSpace + _dynamicX;
          }
          if (index) {
            // 非首行
            computeArrWidth[nowLine] += wordSpace * (computeArr[nowLine].length - 1);
            nowLine += 1;
          }
          computeArr[nowLine] = (computeArr[nowLine] || []).concat([{ ...item2, text: itemUse }]);
          computeArrWidth[nowLine] = (computeArrWidth[nowLine] || 0) + nowWidth;
        });
      });
      // 完善最后一行列表内容宽度
      computeArrWidth[nowLine] += wordSpace * (computeArr[nowLine].length - 1);
      // 开始绘制，使用dynamicX、dynamicY
      computeArr.forEach((row, index) => {
        // 每一个row是一行，默认渲染start模式
        dynamicX = 0;
        if (textAlign === 'center') {
          dynamicX = x - paddingLeft - computeArrWidth[index] / 2;
        }
        (row || []).forEach((itemMap, index2) => {
          // 分别绘制每一个元素
          const {
            fontFamily: fontFamily2 = 'Roboto',
            fontWeight: fontWeight2 = 'normal',
            color: color2 = '',
            fontSize: fontSize2 = 14,
            text: text2 = '',
            lineHeight: lineHeight2 = 18,
            lineSpace: lineSpace2 = 8,
          } = itemMap || {};
          context.fillStyle = color2;
          context.font = `${fontWeight2 || 'normal'} ${fontSize2 * scale}px ${fontFamily2}`;
          const _x = paddingLeft + padding + dynamicX;
          const _y = y + dynamicY;
          context.fillText(text2, _x * scale, _y * scale);
          const nowWidth = context.measureText(text2).width / scale;
          dynamicX += nowWidth + wordSpace;
          if (index2 === row.length - 1) {
            dynamicY += lineHeight2 + lineSpace2;
          }
        });
      });
    }
  });
  return { dynamicX, dynamicY, realMaxWidth, topY, fontHeight: fontHeight || 12 };
};

/**
 * 绘制带有背景图的文字
 * @param {*} hasBgText 配置
 * @param {*} context 绘制上下文环境
 * @param {*} scale 缩放比例
 * @param {*} isZh
 * @param {*} paddingLeft
 */
const bgTextsRender = ({ hasBgText, context, scale = 2, isZh = false, paddingLeft = 24 }) => {
  const { padding = 8, fontSize = 12, color = '#fff', lineHeight = 16, lineSpace = 8, bg, texts } =
    hasBgText || {};
  if (texts && texts.length) {
    let lines = 1;
    const _texts = texts.map(item => {
      if (item.newLine) {
        lines += 1;
      }
      return {
        color,
        fontSize,
        lineHeight,
        lineSpace,
        needCompute: true,
        ...item,
      };
    });
    const { dynamicY, realMaxWidth, topY, fontHeight } = textRender({
      texts: _texts,
      context,
      scale,
      isZh,
      isRender: false,
    });
    const _x = paddingLeft;
    const _y = topY - padding - fontHeight;
    // eslint-disable-next-line no-mixed-operators
    const _width = realMaxWidth + padding * 2;
    // eslint-disable-next-line no-mixed-operators
    const _height = dynamicY + lineHeight * lines + lineSpace * (lines - 1) + padding * 2;
    context.drawImage(bg, _x * scale, _y * scale, _width * scale, _height * scale);
    textRender({
      texts: _texts,
      context,
      scale,
      isZh,
      paddingLeft,
      padding,
    });
  }
};

/**
 * 创建图片
 * @param {*} params
 */
export const create = params => {
  // 标准模板 375*667，默认缩放 2
  const {
    width = 375,
    height = 667,
    scale = Math.ceil(Number(window.devicePixelRatio)) || 2,
    isZh = false,
    paddingLeft = 24,
    bg = '', // 背景图
    imgs = [], // 渲染图片
    shapes = [], // 形状渲染
    texts = [], // 文字
    chartText = [], // 图表文字
    imgsCommon = [],
    textsCommon = [],
    hasBgText = {}, // 有背景的文字
    ...others
  } = params || {};

  return new Promise((resolve, reject) => {
    try {
      const useWidth = width * scale;
      const useHeight = height * scale;
      let canvas = document.createElement('canvas');
      canvas.width = useWidth;
      canvas.height = useHeight;
      canvas.style.width = '100%';
      const ctx = canvas.getContext('2d');
      if (bg) {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      }
      if (imgs && imgs.length) {
        imgs.forEach(item => {
          const { img, x, y, width: _width, height: _height } = item || {};
          if (img) {
            ctx.drawImage(img, x * scale, y * scale, _width * scale, _height * scale);
          }
        });
      }
      if (shapes && shapes.length) {
        shapes.forEach(item => {
          const { color, x, y, width: _width, height: _height } = item || {};
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * scale, y * scale, _width * scale, _height * scale);
          }
        });
      }
      if (texts && texts.length) {
        textRender({ texts, context: ctx, scale, isZh, paddingLeft });
      }
      if (chartText && chartText.length) {
        textRender({ texts: chartText, context: ctx, scale, isZh, paddingLeft });
      }
      if (imgsCommon && imgsCommon.length) {
        imgsCommon.forEach(item => {
          const { img, x, y, width: _width, height: _height } = item || {};
          if (img) {
            try {
              ctx.drawImage(img, x * scale, y * scale, _width * scale, _height * scale);
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
      if (textsCommon && textsCommon.length) {
        textRender({ texts: textsCommon, context: ctx, scale, isZh, paddingLeft });
      }
      if (hasBgText) {
        bgTextsRender({ hasBgText, context: ctx, scale, isZh, paddingLeft });
      }
      const res = getBase64({ canvas, ...others });
      canvas = null; // 释放
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};
