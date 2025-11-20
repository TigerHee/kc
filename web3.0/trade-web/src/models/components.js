/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import * as cmsService from 'services/cms';
import { CmsComponents, DEFAULT_LANG, siteCfg } from 'config';
import base from 'common/models/base';

const { MAINSITE_HOST, KUMEX_HOST, DOCS_HOST, SANDBOX_HOST } = siteCfg;

const replaceSelfHost = (html, currentLang) => {
  const str = html || '';
  return str
    .replace(/((href|src)=('|")\/)(.*?)('|")/g, (match, p1, p2, p3, p4) => {
      return `${p2}=${p3}${MAINSITE_HOST}/${p4}${currentLang ? `?lang=${currentLang}` : ''}${p3}`;
    });
};
const replaceHost = (html, lang) => {
  const str = html || '';
  return str
    // 交易地址
    .replace(/https:\/\/trade.kucoin.io/g, '')
    // kemex地址
    .replace(/(https:\/\/www.kumex.com)(.*?)(('|"))/g, (match, p1, p2, p3) => {
      return `${KUMEX_HOST}${p2}?lang=${lang}${p3}`;
    })
    // 文档地址
    .replace(/(https:\/\/docs.kucoin.io)(.*?)(('|"))/g, (match, p1, p2, p3) => {
      return `${DOCS_HOST}${p2}?lang=${lang}${p3}`;
    })
    // 沙盒地址
    .replace(/(https:\/\/sandbox.kucoin.io)(.*?)(('|"))/g, (match, p1, p2, p3) => {
      return `${SANDBOX_HOST}${p2}?lang=${lang}${p3}`;
    })
    // pool-x地址
    .replace(/(https:\/\/pool-x.io)(.*?)(('|"))/g, (match, p1, p2, p3) => {
      return `https://pool-x.io${p2}?lang=${lang}${p3}`;
    });
};
// 需要将二级域名(如: trade.kucoin.com)替换成siteConfig中配置域名的组件key
const replaceHostKeys = ['com.newFooter.links'];

function fetchComponet(cmptname, lang = 'en_US') {
  return new Promise((resolve) => {
    return cmsService.pullCmsCDN(cmptname, lang)
      .then(res => res.json())
      .then((res) => {
        resolve(res);
      }, () => {
        // 如果请求失败，那么返回一个错误信息
        resolve({ err: true });
      })
      .catch((e) => {
        console.log('err', e);
      })
    ;
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
      const currentLang = yield select(state => state.app.currentLang);
      const { componentsToload } = payload;
      const [cur, ...rest] = componentsToload;
      try {
        const data = yield call(fetchComponet, cur, currentLang);
        const cmpts = yield select(state => state.components.body);
        if (!data.err) {
          const fetchedCpmt = Object.keys(data).reduce((rslt, curCmpt) => {
            const [cmptName] = curCmpt.split('@');
            const ifSpecial = replaceHostKeys.indexOf(cmptName) > -1;
            const _content = data[cmptName] || data[`${cmptName}@en_US`] || '';
            return {
              ...rslt,
              [`${cmptName}`]: ifSpecial ? replaceHost(
                replaceSelfHost(_content, currentLang),
                currentLang,
              ) : replaceSelfHost(_content, currentLang),
            };
          }, {});

          yield put({
            type: 'update',
            payload: {
              body: { ...cmpts, ...fetchedCpmt },
            },
          });
        }

      } catch (e) {
        console.log('components fetch error', e);
      }
      if (rest.length && rest[0]) {
        yield put({
          type: 'fetch',
          payload: {
            componentsToload: [...rest],
          },
        });
      }
    },
    *fetchAlone({ payload }, { put, select }) {
      const currentLang = yield select(state => state.app.currentLang);
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
        pageCmpt[_prefixKey] = replaceSelfHost(compiled_html, currentLang);
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
  subscriptions: {
    // syncComponents({ history, dispatch }) {
    //   history.listen(({ pathname }) => {
    //     dispatch({
    //       type: 'fetch',
    //       payload: { pathname },
    //     });
    //   });
    // },
  },
});
