/**
 * Owner: hanx.wei@kupotech.com
 */
async function resolveJSSStyles(
  browserPage,
  { isMobile = false, isApp = false, theme }
) {
  await browserPage.evaluate(
    ({ isMobile, isApp, theme }) => {
      function getSSGPlatform(isMobile, isApp) {
        return isApp ? 'APP' : isMobile ? 'MOBILE' : 'PC';
      }

      const platform = getSSGPlatform(isMobile, isApp);
      // head 插入注释
      const ssgTag = document.createComment(
        ` [SSG] ${platform} created at ${new Date().toUTCString()} `
      );
      document.head.insertBefore(ssgTag, document.head.children[0]);

      const style = document.createElement('style');
      style.id = 'ssg-jss-node';
      style.setAttribute('ssg-jss-node', 1);
      style.type = 'text/css';
      const headEle = document.querySelector('head');
      const jssSheets = headEle.querySelectorAll('style[data-jss]');

      // jss 注入节点
      let styleTargetNode = null;
      if (window._useSSG) {
        // ssg 产物下重复生成时复用节点
        styleTargetNode = document.querySelector('#jss-insertion-point');
      } else {
        styleTargetNode = document.createElement('style');
        styleTargetNode.id = 'jss-insertion-point';
      }

      const emotionSheets = headEle.querySelectorAll('style[data-emotion]');
      const styleSheets = [...jssSheets, ...emotionSheets];
      // 插入 styleTargetNode
      if (!window._useSSG && styleSheets[0]) {
        styleSheets[0].parentNode.insertBefore(styleTargetNode, jssSheets[0]);
      }

      const len = styleSheets.length;

      const rulesArr = [];
      const getStyleText = style => {
        const _rules = [];
        const len = style.sheet.cssRules.length;
        for (let i = 0; i < len; i++) {
          _rules.push(style.sheet.cssRules[i].cssText.replace(/\n/g, ''));
        }
        return _rules.join('');
      };
      for (let i = 0; i < len; i++) {
        const _curSheet = styleSheets[i];
        if (_curSheet && !_curSheet.href) {
          rulesArr.push(getStyleText(_curSheet));
          // _curSheet.remove();
        }
      }
      const _cssText = rulesArr.join('');
      style.innerHTML = _cssText;
      if (styleSheets[0]) {
        styleSheets[0].parentNode.insertBefore(style, styleTargetNode);
      }

      for (let i = 0; i < len; i++) {
        const _curSheet = styleSheets[i];
        if (_curSheet && !_curSheet.href) {
          _curSheet.remove();
        }
      }

      // 移除 mui 的 svg symbol icon
      const svgSymbol = document.querySelector('svg symbol');
      const svySymbolId = svgSymbol ? svgSymbol.id || '' : '';
      if (svySymbolId.startsWith('icon-')) {
        svgSymbol.parentElement.remove();
      }
      // 去除非root 之外的所有的div，避免某些modal等提示在水合后无法自动删除的问题
      try {
        (document.body.childNodes || document.body.children).forEach(v => {
          if (v.tagName !== 'DIV') {
            return;
          }
          if (v.tagName === 'DIV' && v.id === 'root') {
            return;
          }
          v.remove();
        });
      } catch (e) {
        // console.log('remove failed');
      }

      if (window._useSSG) {
        // ssg 产物下重复生成时移除旧的 initial script
        document.querySelector('#ssg-initial-script').remove();
      }
      let initialState = {};
      // 快照当前的dva store, 用于水合时初始化dva store
      if (window.getDvaApp) {
        const dvaApp = window.getDvaApp();
        // 如果无法正常获取到 models， 那么initialState = {};
        if (dvaApp && dvaApp._models) {
          const _store = dvaApp._store.getState();
          // 需要排除的 models
          // const excludeModels = [
          //   '@@dva',
          //   'coins',
          //   'categories',
          //   'captcha',
          //   'app',
          //   'market',
          //   'router',
          // ];
          const alwayIncludes = [];
          initialState = dvaApp._models.reduce((result, cur) => {
            if (!alwayIncludes.includes(cur.namespace)) {
              return result;
            }
            // // 如果state 是初始的，那么不加入；
            // if(_.isEqual(cur.state, _store[cur.namespace])){
            //   return result;
            // }
            return {
              ...result,
              [cur.namespace]: _store[cur.namespace],
            };
          }, {});

          // 页面注入特定的state，不需要全部注入，避免数据过大
          if (window.getCurPageState) {
            const curPageState = window.getCurPageState() || {};
            initialState = {
              ...initialState,
              ...curPageState,
            };
          }
          // 注入 gbiz 的 state
          if (window.getCurGbizState) {
            const curGbizState = window.getCurGbizState() || {};
            initialState = {
              ...initialState,
              ...curGbizState,
            };
          }
        }
      }
      let initPageState = {};
      // 注入 page state 不在store中的数据
      if (
        window.getCurPageStateWithOutStore &&
        typeof window.getCurPageStateWithOutStore === 'function'
      ) {
        const { initState = {}, clearInitSate } =
          window.getCurPageStateWithOutStore() || {};
        initPageState = initState;
        // 清理 initState
        if (typeof clearInitSate === 'function') {
          clearInitSate();
        }
      }
      // cms 内容预置
      let cmsCommonState = {};
      if (window.getCmsCommonState) {
        cmsCommonState = window.getCmsCommonState();
      }
      const initialScript = document.createElement('script');
      initialScript.id = 'ssg-initial-script';
      initialScript.innerHTML = `
                window._useSSG = true;
                window.SSG_isMobile = ${isMobile};
                window.SSG_isApp = ${isApp};
                window.SSG_theme = ${JSON.stringify(theme)};
                window.g_useSSR = true;
                window.g_initialProps = ${JSON.stringify(initialState)};
                window.g_cmsCommonState = ${JSON.stringify(cmsCommonState)};
                window.g_initialPageState = ${JSON.stringify(initPageState)};

      `;
      const body = document.querySelector('body');
      body.insertBefore(initialScript, body.childNodes[0]);
    },
    { isMobile, isApp, theme }
  );
}

module.exports = resolveJSSStyles;
