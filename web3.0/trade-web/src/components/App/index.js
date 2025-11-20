/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import connectWithRouter from 'utils/connectWithRouter';
import SEOmeta from 'components/SEOmeta';
// import CmsComs from 'components/CmsComs';
import NewAppLoading from '@/components/AppLoading';
import RouterResolve from './routerResolve';
// 单元测试不识别，必须添加后缀
import './style.less';

export const LocaleContext = React.createContext('');

@connectWithRouter((state) => {
  return {
    appReady: state.app.currentLangReady,
    currentLang: state.app.currentLang,
  };
})
class App extends React.Component {
  render() {
    const { children, appReady, currentLang, location } = this.props;

    // let hasSSG = false;
    // if (document) {
    //   const headDom = document.querySelector('head');
    //   if (headDom) {
    //     const list = headDom.childNodes;
    //     hasSSG = [...(list || [])].some((dom) => dom.data === 'powered_by_ssg');
    //   }
    // }

    return (
      <React.Fragment>
        {/* 新交易大厅不再需要动态加载css文件来切换主题 */}
        {/* <CmsComs.Heads /> */}
        {/* 前端路由切换依然需要更新canonical中的url*/}
        <SEOmeta currentLang={currentLang} pathname={location.pathname} />
        {appReady && (
          <LocaleContext.Provider value={currentLang}>
              {children}
          </LocaleContext.Provider>
        )}
        <RouterResolve {...this.props} />
        <NewAppLoading />
      </React.Fragment>
    );
  }
}

export default App;
