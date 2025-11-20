/**
 * Owner: iron@kupotech.com
 */
// import { each, map } from 'lodash';
// import { CmsComponents, DEFAULT_LANG } from './config';
// import * as services from './service';
import { PREFIX } from '../common/constants';
// import { replaceHost } from '../common/tools';
import { replaceHost } from '../common/tools';
import { getCmsCdnHost, CmsComponents } from './config';

export const namespace = `${PREFIX}_components`;

function fetchComponet(cmptname, lang = 'en_US') {
  return new Promise((resolve) => {
    const t = Date.now()
      .toString()
      .slice(0, -6);
    return fetch(`${getCmsCdnHost()}/h_${cmptname}_${lang}.json?t=${t}`)
      .then((res) => res.json())
      .then(
        (res) => {
          resolve(res);
        },
        () => {
          resolve({});
        },
      );
  });
}
export default {
  namespace,
  state: {
    head: {},
    body: {},
    pageCmpt: {},
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 通用的获取components, 具体处理由各自的业务处理
    *fetch({ payload }, { put, call, select }) {
      // const currentLang = yield select((state) => state.app.currentLang);
      const { componentsToload, currentLang, hostConfig } = payload;
      const [cur, ...rest] = componentsToload;
      if (CmsComponents.combine.indexOf(cur) === -1) {
        try {
          const data = yield call(fetchComponet, cur, currentLang);
          const cmpts = yield select((state) => state[namespace].body);
          const fetchedCpmt = Object.keys(data).reduce((rslt, cur) => {
            const [cmptName] = cur.split('@');
            return {
              ...rslt,
              [`${cmptName}`]: replaceHost(
                data[cmptName] || data[`${cmptName}@en_US`] || '',
                currentLang,
                hostConfig || {},
              ),
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
  },
};
