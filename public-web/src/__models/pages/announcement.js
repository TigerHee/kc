/**
 * Owner: mage.tai@kupotech.com
 */
import base from 'common/models/base';
import paginate from 'common/models/paginate';
import extend from 'dva-model-extend';
import * as newsService from 'services/news';
import throw404 from 'utils/next/throw404';

// 获取cdn 资源
async function fetchCDN(key) {
  // cdn host， 测试环境与线上环境不一样
  const cdnHost = window.location.host.match(/(net|localhost)/)
    ? 'asset-v2.kucoin.net'
    : 'assets.staticimg.com';

  return new Promise((resolve) => {
    const t = Math.floor(Date.now() / 180000);
    return (
      fetch(`https://${cdnHost}/cms/articles/${key}.json?t=${t}`)
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            return res;
          }
          const error = {
            msg: res.statusText || res.status,
            res,
          };
          throw error;
        })
        // .then((res) => {
        //   if (typeof res.success === 'undefined' || res.success === false) {
        //     throw res;
        //   }
        //   return res;
        // })
        .then((res) => {
          return res.json();
        })
        .then(
          (res) => {
            resolve({
              data: res,
              error: null,
            });
          },
          (error) => {
            resolve({
              error,
              data: {},
            });
          },
        )
        .catch((e) => {
          console.log('catch error', e);
        })
    );
  });
}

export default extend(base, paginate, {
  namespace: 'announcement',
  state: {
    articleDetail: {},
    currentLang: '',
    breadPrePath: '/announcement',
    pageType: '', // 列表还是详情 list detail
    selectedKey: '', // 主页title，与menu选中的相同
  },
  reducers: {
    updateLang(state, { payload }) {
      return {
        ...state,
        lang: payload,
      };
    },
    updateBreadPrePath(state, { payload }) {
      return {
        ...state,
        breadPrePath: payload,
      };
    },
  },
  effects: {
    *pullArticlesList({ payload: { page, category, keyword, withContent } }, { put, call }) {
      // 文章列表
      try {
        /* 注意！pageSize如果变更，scripts/build.routes.js 中需要同步修改 specialRouteEnum */
        const pageSize = 10;
        const param = {
          page,
          pageSize,
          category,
          keyword,
        };
        if (typeof withContent !== 'undefined') {
          param.withContent = withContent;
        }
        const { items, totalNum } = yield call(newsService.pullArticles, param);
        yield put({
          type: 'savePage',
          payload: {
            items,
            page,
            pageSize,
            totalNum,
          },
        });
      } catch (e) {
        console.log('announcement pullArticlesList error');
        // Raven.captureException(e);
      }
    },
    // 从接口获取
    *pullArticleDetail({ payload: { key, currentLang } }, { put, call }) {
      // 文章详情
      if (!key) {
        yield put({
          type: 'update',
          payload: {
            articleDetail: {},
          },
        });
        return;
      }

      const isZH = currentLang === 'zh_CN';

      try {
        const { data } = yield call(newsService.pullArticleDetail, key);
        const paths = data.paths || {};
        const pathKey = paths[currentLang] || paths.default;
        const newKey = pathKey ? pathKey.substr(1) : '';
        const searchUrl = window.location.search;
        // 判断是否是预览链接，预览链接不需要切换语言
        const isPreview =
          searchUrl.indexOf('_cms_ts') !== -1 && searchUrl.indexOf('_cms_hash') !== -1;
        if (newKey === key || isPreview) {
          yield put({
            type: 'update',
            payload: {
              articleDetail: data,
            },
          });
        } else {
          const res = yield call(newsService.pullArticleDetail, newKey || key);
          yield put({
            type: 'update',
            payload: {
              articleDetail: res.data,
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            articleDetail: {},
          },
        });
        // 提示错误，让用户感知以便其主动刷新
        yield put({
          type: 'app/setToast',
          payload: {
            message:
              e.message || !isZH
                ? 'Oops! We cannot reach this page'
                : '很抱歉，您访问的页面找不到了。',
            type: 'error',
          },
        });
        console.log('announcement pullArticleDetail error');
        if (e.code === '404') {
          throw404();
        } else {
          // Raven.captureException(e);
        }
      }
    },
    // 先从CDN获取
    *pullDetail({ payload: { key, currentLang } }, { put, call }) {
      // 文章详情
      if (!key) {
        yield put({
          type: 'update',
          payload: {
            articleDetail: {},
          },
        });
        return;
      }

      let isZH = false;
      let articalDetail = {};
      try {
        const searchUrl = window.location.search;
        // 判断是否是预览链接，预览链接不需要切换语言
        const isPreview =
          searchUrl.indexOf('_cms_ts') !== -1 && searchUrl.indexOf('_cms_hash') !== -1;

        const { data, error } = yield call(fetchCDN, key);
        // 当文章json 404 后尝试接口
        if (error && (error.msg === 404 || error.msg === 403)) {
          yield put({
            type: 'pullArticleDetail',
            payload: {
              key,
            },
          });
          return;
        }
        // const { currentLang } = yield select((state) => state.app);
        isZH = currentLang === 'zh_CN';
        const paths = data.paths || {};
        const pathKey = paths[currentLang] || paths.default;
        const newKey = pathKey ? pathKey.substr(1) : '';
        let needFetchFromApi = false;

        if (isPreview) {
          // 预览状态走接口
          const res = yield call(newsService.pullArticleDetail, newKey || key);
          articalDetail = res.data;
        } else if (newKey === key) {
          // 正常访问
          articalDetail = data;
          // 需要判断 compliance_block
          needFetchFromApi = true;
        } else if (newKey !== key) {
          // 当前语言与文件链接的语言不一致时
          const res = yield call(fetchCDN, newKey || key);
          if (res.error && (res.error.msg === 404 || error.msg === 403)) {
            yield put({
              type: 'pullArticleDetail',
              payload: {
                key: newKey || key,
              },
            });
            return;
          }
          articalDetail = res.data;
          // 需要判断 compliance_block
          needFetchFromApi = true;
        }
        if (navigator.userAgent.indexOf('SSG_ENV') === -1) {
          // 非SSG生成状态时
          if (needFetchFromApi && articalDetail.compliance_block === 1) {
            // 澳大利亚合规 从cdn获取的文章数据中compliance_block===1的时候需要请求接口获取文章数据
            yield put({
              type: 'pullArticleDetail',
              payload: {
                key: newKey || key,
              },
            });
            return;
          }
        }
        yield put({
          type: 'update',
          payload: {
            articleDetail: articalDetail,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            articleDetail: {},
          },
        });
        // 提示错误，让用户感知以便其主动刷新
        yield put({
          type: 'app/setToast',
          payload: {
            message:
              e.message || !isZH
                ? 'Oops! We cannot reach this page'
                : '很抱歉，您访问的页面找不到了。',
            type: 'error',
          },
        });
        console.log('announcement pullArticleDetail error');
        if (e.code === '404') {
          // throw404();
        } else {
          // Raven.captureException(e);
        }
      }
    },
  },
});
