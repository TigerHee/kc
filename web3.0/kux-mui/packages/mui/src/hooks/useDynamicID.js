/**
 * Owner: ella.wang@kupotech.com
 */
import React from 'react';

function generateRandomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'; // 字符集：小写字母和数字
  let result = '';

  for (let i = 0; i < length; i++) {
    // 使用 Math.random() 获取一个 0 到 1 之间的随机数，然后映射到 charset 中
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }

  return result;
}

const getDynamicId = () => {
  // 获取当前时间戳（毫秒）
  const timestamp = Date.now();

  // 生成一个 12 位的随机字符串（包含字母和数字）
  const randomStr = generateRandomString(12);

  // 拼接时间戳和随机字符串
  return `kux_mui_aria_${timestamp}-${randomStr}`;
};

export default function useDynamicID() {
  // 初始化 动态生成一个不会再改变的id
  const [id, setId] = React.useState(getDynamicId());
  return id;
}
