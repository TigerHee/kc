import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

// number，支持解析 100 或 "100px"
// appendUnit，转化后添加px单位，默认添加
// uxWidth，设计图基准宽度，默认375
global._px = (number, appendUnit = true, uxWidth = 375) => {
  if (!number) return number;
  const i = parseFloat(number);
  if (isNaN(i)) return number;
  if (appendUnit) {
    return (windowWidth * i) / uxWidth + 'px';
  } else {
    return (windowWidth * i) / uxWidth;
  }
};

export const convertPxToReal = global._px;
