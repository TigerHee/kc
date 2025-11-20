/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { filter, find, isUndefined, flow, uniqWith } from 'lodash';

export function convertPlatformConfig(config) {
  const _config = config ?? [];

  if (_config.length === 0) {
    return [];
  }

  /**
   * @type {{ record: Record<string, number>, result: Array<{ platform: string, data: Array<any> }> }}
   */
  const store = {
    record: {},
    result: [],
  };
  let recordIndex = 0;

  _config.forEach((configItem) => {
    const platforms = configItem.communityPlatforms || [];

    platforms.forEach((platformItem) => {
      const { platform } = platformItem;

      const dataItem = {
        ...platformItem,
      };

      if (isUndefined(store.record[platform])) {
        // 记录下上次的 index
        store.record[platform] = recordIndex++;
        store.result.push({
          ...platformItem,
          data: [dataItem],
        });
      } else {
        const pos = store.record[platform];

        if (store.result[pos]) {
          store.result[pos].data.push(dataItem);
        }
      }
    });
  });

  return filterConfigInvalidData(store.result);
}

export function filterConfigInvalidData(config) {
  config.forEach((item) => {
    item.data = filterItemData(item.data);
  });

  function filterItemData(data) {
    const fn = flow(
      [
        (r) => r.filter((item) => !!item.accountId),
        (r) => {
          return uniqWith(r, (prev, cur) => {
            return prev.accountId === cur.accountId;
          });
        }
      ]
    );

    return fn(data);
  }

  // 去除运营渠道所有 accountId 都没填写的情况
  return config.filter((item) => item.data.length > 0);
}

// 把当前的语言设置到顶部
export function getConfigByLang(config, lang) {
  const _config = config ?? [];

  if (!lang || _config.length === 0) {
    return convertPlatformConfig(_config);
  }

  const topItem = find(_config, (item) => item.language === lang);

  // 如果没有找到对应的语言，则直接返回
  if (!topItem) {
    return convertPlatformConfig(_config);
  }

  const extra = filter(_config, (item) => item.language !== lang);

  return convertPlatformConfig([topItem, ...extra]);
}
