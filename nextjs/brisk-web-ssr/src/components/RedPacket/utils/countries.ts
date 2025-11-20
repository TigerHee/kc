/*
 * @Owner: willen@kupotech.com
 * @Author: willen Melon@kupotech.com
 * @Date: 2025-08-23 21:47:02
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-09-23 23:01:55
 * @FilePath: /brisk-web-ssr/src/components/RedPacket/utils/countries.ts
 * @Description:
 *
 *
 */

import { find } from 'lodash-es';
import { getTenantConfig } from '@/tenant';

const tenantConfig = getTenantConfig();

/**
 * 屏蔽国家的数组
 * 已确认和g-biz packages/entrance/src/CommonComponents/constants.js 一致
 */
export const FORBIDDEN_COUNTRIES_FOR_USE = [
  {
    code: 'CN',
    mobileCode: '86',
    aliasName: '其他', // 被屏蔽的国家，界面显示的别名
    aliasNameEN: 'Other',
  },
];

/** 是否是屏蔽国家
 *  已确认和g-biz packages/entrance/src/CommonComponents/tools.js 的逻辑是一致的
 */
export const isForbiddenCountry = (mobileCode, field = 'mobileCode') => {
  return find(tenantConfig.common.forbiddenCountriesForUse(), (forbiddenItem) => {
    return forbiddenItem[field] === mobileCode;
  });
};
