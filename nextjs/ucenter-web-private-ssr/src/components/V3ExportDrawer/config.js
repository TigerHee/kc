/**
 * Owner: tiger@kupotech.com
 */
import { tenantConfig } from 'config/tenant';
import { _t } from 'tools/i18n';

export const options = tenantConfig.download.billExportOptions(_t);

// label文案映射
export const ALL_TOP_CODES_MAP = {};
export const ALL_TOP_CODES = [];

options.forEach((item1) => {
  if (item1.children) {
    item1.children.forEach((item2) => {
      if (item2.children) {
        item2.children.forEach((item3) => {
          ALL_TOP_CODES_MAP[item3.code] = `${item1.label}/${item2.label}/${item3.label}`;
          ALL_TOP_CODES.push(item3.code);
        });
      } else {
        ALL_TOP_CODES_MAP[item2.code] = `${item1.label}/${item2.label}`;
        ALL_TOP_CODES.push(item2.code);
      }
    });
  }
});

export const getTopCodes = (treeData) => {
  let arr = [];
  treeData.forEach((item1) => {
    if (item1.children) {
      item1.children.forEach((item2) => {
        if (item2.children) {
          item2.children.forEach((item3) => {
            arr.push(item3.code);
          });
        } else {
          arr.push(item2.code);
        }
      });
    }
  });
  return arr;
};
