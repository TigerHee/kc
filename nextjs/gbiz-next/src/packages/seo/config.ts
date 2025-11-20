export const xssOptions = {
  whiteList: {}, // 不允许任何标签
  stripIgnoreTag: true, // 去掉不在白名单的标签
  stripIgnoreTagBody: ['script'], // 去掉 script 标签的内容
};