import { produce } from 'immer';

/**
 * 合并 pageProps 中以双下划线开头的属性到对应的 Store 对象中
 * @param {Object} pageProps - 原始的 pageProps 对象
 * @returns {Object} - 合并后的 pageProps 对象
 */
function mergePageProps(pageProps: any) {
  return produce(pageProps, (draft) => {
    const stores = {}; // 用于临时存储合并后的 Store 数据

    Object.keys(draft).forEach((key) => {
      if (key.startsWith('__')) {
        const match = key.match(/^__(\w+)_(\w+)$/);
        if (match) {
          const [, storeName, propName] = match;

          // 初始化 Store 对象（如果尚未存在）
          if (!stores[storeName]) {
            stores[storeName] = {};
          }

          // 将属性值赋给对应的 Store 对象
          stores[storeName][propName] = draft[key];

          // 删除原始的双下划线属性
          delete draft[key];
        }
      }
    });

    // 将合并后的 Stores 合并到 pageProps 中
    Object.assign(draft, stores);
  });
}

export default mergePageProps;