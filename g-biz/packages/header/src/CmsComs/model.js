/**
 * Owner: iron@kupotech.com
 */
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { CmsComponents, getCmsCdnHost } from './config';
import { PREFIX } from '../common/constants';

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

const replaceSelfHost = (html, currentLang, hostConfig) => {
  const { KUCOIN_HOST } = hostConfig;
  const str = html || '';
  return str.replace(/((href|src)=('|")\/)(.*?)('|")/g, (match, p1, p2, p3, p4) => {
    const url = queryPersistence.formatUrlWithStore(
      `${KUCOIN_HOST}/${p4}${currentLang ? `?lang=${currentLang}` : ''}`,
    );
    return `${p2}=${p3}${url}${p3}`;
  });
};

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
              [`${cmptName}`]: replaceSelfHost(
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
