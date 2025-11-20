/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import * as cmsService from 'services/cms';
import base from 'utils/common_models/base';
import { CmsComponents, DEFAULT_LANG } from 'config';
import siteCfg from 'utils/siteConfig';
import { getCmsCdnHost, getTimeStampByLen } from 'helper';
import { kucoinStorage } from 'utils/storage';
import { getCurrentLangFromPath } from 'utils/langTools';


const {KUCOIN_HOST } = siteCfg;

const replaceSelfHost = (html, currentLang) => {
  const str = html || '';
  return str
    .replace(/((href|src)=('|")\/)(.*?)('|")/g, (match, p1, p2, p3, p4) => {
      return `${p2}=${p3}${KUCOIN_HOST}/${p4}?lang=${currentLang}${p3}`;
    });
};

function fetchComponet(cmptname, lang = window._DEFAULT_LANG_) {
  const t = getTimeStampByLen(-6);
  const cdnhost = getCmsCdnHost();
  return new Promise((resolve) => {
    return fetch(
      `${cdnhost}/h_${cmptname}_${lang}.json?t=${t}`,
    )
      .then(res => res.json())
      .then(
        (res) => {
          resolve(res);
        },
        (err) => {
          console.log(err);
          resolve({});
        },
      );
  });
}

export default extend(base, {
  namespace: 'components',
  state: {
    head: {},
    body: {},
    pageCmpt: {},
  },
  effects: {
    *fetch({ payload }, { put, call, select }) {
      const langByPath = getCurrentLangFromPath();
      const currentLang = yield select(state => state.app.currentLang);
      const { componentsToload: _componentsToload, pathname } = payload;
      let componentsToload = [];
      if(pathname && !_componentsToload) {
        componentsToload = CmsComponents[pathname];
      } else {
        componentsToload = [..._componentsToload || []];
      }
      if(!componentsToload?.length ){
        return;
      }
      const [cur, ...rest] = componentsToload;

      // 入股是组合组件，则不单独加载
      if(CmsComponents.combine.indexOf(cur) > -1) {
        return;
      }
      try {
        const data = yield call(fetchComponet, cur, currentLang || langByPath || kucoinStorage.getItem('lang'));
        const { replaceHost } = yield call(() => System.import('@remote/footer'));
        const cmpts = yield select(state => state.components.body);
        const fetchedCpmt = Object.keys(data).reduce((rslt, curCmpt) => {
          const [cmptName] = curCmpt.split('@');
          return {
            ...rslt,
            [`${cmptName}`]: replaceSelfHost(replaceHost(
              data[cmptName] || data[`${cmptName}@en_US`] || '',
              {
                ...(siteCfg || {})
              },
            ), currentLang),
          };
        }, {});

        yield put({
          type: 'update',
          payload: {
            body: { ...cmpts, ...fetchedCpmt },
          },
        });
      } catch (e) {
        console.log('components fetch error', e);
      }
      if (rest.length && rest[0]) {
        yield put({
          type: 'fetch',
          payload: {
            componentsToload: [...rest],
            currentLang,
          },
        });
      }
    },
    *fetchAlone({ payload }, { put }) {
      const { componentToload } = payload;

      const keys = [componentToload];

      const components = yield yield put({
        type: 'fetchComponents',
        payload: {
          componentsToload: keys,
        },
      });
      const pageCmpt = {};
      _.each(components, (item) => {
        const { key, compiled_html } = item;
        const _prefixKey = (`${key}`).replace(/@[a-zA-Z_]+$/, '');
        pageCmpt[_prefixKey] = compiled_html;
      });
      yield put({
        type: 'update',
        payload: {
          pageCmpt,
        },
      });

    },
    // 通用的获取components, 具体处理由各自的业务处理
    *fetchComponents({ payload }, { put, call, select }) {
      const currentLang = yield select(state => state.app.currentLang);
      const { componentsToload, extra } = payload;

      const keys = [...componentsToload];
      /** 前缀添加语言 */
      let paramKeys = _.map(keys, k => `${k}@${currentLang}`);
      if (currentLang !== DEFAULT_LANG) {
        const enKeys = _.map(keys, k => `${k}@${DEFAULT_LANG}`);
        paramKeys = enKeys.concat(paramKeys);
      }
      if (extra) {
        paramKeys = paramKeys.concat(extra);
      }

      try {
        const { data } = yield call(cmsService.pullComponents, paramKeys);
        return data;

      } catch (e) {
        console.log('components fetch error');
        return [];
      }
    },
  },
});
