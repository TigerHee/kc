/*
 * owner: Borden@kupotech.com
 */
import { memoize, includes } from 'lodash';
import { searchToJson } from 'src/helper';
import { MODULES_MAP } from './moduleConfig';

/**
 * 获取单开页面的模块信息
 */
export const getSingleModule = memoize(() => {
  const query = searchToJson();
  const { module } = query || {};
  // 校验模块是否支持单开
  const isSingle = includes(MODULES_MAP[module]?.actions, 'popout');
  return {
    isSingle,
    moduleId: module,
  };
});
