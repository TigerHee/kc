/**
 * Owner: victor.ren@kupotech.com
 */
import { startsWith, find, split, endsWith, toLower } from 'lodash-es';

import excelPreview from './img/excel';
import pdfPreview from './img/pdf';
import unknownPreview from './img/unknown';
import wordPreview from './img/word';

// base64判断是否为文档类型
const base64DocPrefix = {
  'data:application/pdf;base64,': pdfPreview, // pdf
  'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,': excelPreview, // xlsx
  'data:application/vnd.ms-excel;base64,': excelPreview, // xls
  'data:application/msword;base64,': wordPreview, // doc
  'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,': wordPreview, // docx
};

// 是否文档url后缀
const urlDocSuffix = {
  '.pdf': pdfPreview,
  '.doc': wordPreview,
  '.docx': wordPreview,
  '.xls': excelPreview,
  '.xlsx': excelPreview,
};

const imgSuffix = ['.jpg', '.jpeg', '.png', '.jfif', '.bmp', '.gif', '.tiff', '.svg'];

const isBase64Str = (url) => startsWith(url, 'data:');

const isUrlLink = (url) => {
  return startsWith(url, 'http://') || startsWith(url, 'https://');
};

/**
 * 判断url是否为文档类型，如果是，返回默认占位图片来进行预览
 * @param {*} url
 */
export const getUnSupportPreviewUrl = (url) => {
  try {
    const isBase64 = isBase64Str(url);
    const isUrl = isUrlLink(url);
    if (isBase64) {
      const previewIcon = find(base64DocPrefix, (_, key) => {
        return startsWith(url, key);
      });
      if (previewIcon) return previewIcon;
      if (!startsWith(url, 'data:image')) return unknownPreview;
    }
    const urlFirst = split('?')[0];
    if (isUrl && urlFirst) {
      const icon = find(urlDocSuffix, (_, key) => {
        return endsWith(toLower(urlFirst), key);
      });
      if (icon) return icon;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

function dataURLtoBlob(dataurl) {
  if (!dataurl) return;
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
}

function downloadFile(url, name = 'preview') {
  const ele = document.createElement('a');
  ele.setAttribute('href', url);
  ele.setAttribute('download', name);
  ele.setAttribute('target', '_blank');
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent('click', true, true);
  ele.dispatchEvent(clickEvent);
}

export const downloadPreviewFile = (url) => {
  try {
    if (!url) return;
    const isBase64 = isBase64Str(url);
    const isUrl = isUrlLink(url);
    if (isUrl) {
      const fileNameList = split(url, '/');
      const name = fileNameList[fileNameList.length - 1];
      downloadFile(url, name);
    } else if (isBase64) {
      const fileBlob = dataURLtoBlob(url);
      const objUrl = URL.createObjectURL(fileBlob);
      const fileName = startsWith(url, 'data:application/pdf;base64') ? 'upload.pdf' : 'document';
      downloadFile(objUrl, fileName);
    }
  } catch (e) {
    console.error(e);
  }
};
