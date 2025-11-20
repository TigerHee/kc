/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { styled } from '@kux/mui';
import Head from 'components/Head';
import NewHeader from 'components/Root/NewHeader';
import { withRouter } from 'components/Router';
import { DEFAULT_JUMP_ROUTE, DEFAULT_JUMP_ROUTE_CL } from 'config/base';
import { tenantConfig } from 'config/tenant';
import { searchToJson } from 'helper';
import React from 'react';
import { connect } from 'react-redux';
import { addLangToPath, getLocaleBasename } from 'tools/i18n';
import { isTMA } from 'utils/tma/bridge';

const base = getLocaleBasename();
const Slash = base ? `/${base}` : '';
const NotAllowdPath = [
  `${Slash}/ucenter/signin`,
  `${Slash}/ucenter/signup`,
  `${Slash}/ucenter/reset-password`,
  // `${Slash}/ucenter/reset-g2fa`,
];

const UCenterLayoutBox = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background: ${(props) => props.theme.colors.overlay};
  display: flex;
  flex-direction: column;
`;

@connect((state) => {
  const { isLogin } = state.user;
  return {
    gotUser: isLogin,
  };
})
@withRouter()
class UcenterLayout extends React.Component {
  // 当用户登录过后切换到登录注册页面，此时 componentWillReciveProps 无法检测: props 未发生改变
  componentDidMount() {
    this._checkIfRedirect(this.props);
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.gotUser !== undefined && this.props.gotUser === undefined) {
      this._checkIfRedirect(nextProps);
    }
  }

  // 校验是否需要跳转
  _checkIfRedirect(nextProps) {
    const { pathname } = window.location;
    const query = searchToJson();
    if (!(query.jwtLogin && pathname.indexOf('/ucenter/signin') !== -1)) {
      if (nextProps.gotUser && NotAllowdPath.includes(pathname)) {
        // 如果是 claim 站点，跳转到 claim 路由
        window.location.href = addLangToPath(
          tenantConfig.common.useCLLogin ? DEFAULT_JUMP_ROUTE_CL : DEFAULT_JUMP_ROUTE,
        );
      }
    } else {
      console.log('jwtLogin');
    }
  }

  isShowHeader = () => {
    const isInApp = JsBridge.isApp();

    if (isInApp) {
      return false;
    }

    if (isTMA()) {
      return false;
    }

    return true;
  };

  render() {
    const { pathname } = this.props;
    const showHeader = this.isShowHeader();

    return (
      <UCenterLayoutBox>
        <Head>
          <script async src="https://assets.staticimg.com/natasha/npm/google-ads/gtag/gtag.js" />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){
                window.dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', 'AW-380686645');
              `}
          </script>
        </Head>
        {showHeader && (
          <NewHeader pathname={pathname} propsMenuConfig={['download', 'i18n', 'theme']} simplify />
        )}
        {this.props.children}
      </UCenterLayoutBox>
    );
  }
}

export default UcenterLayout;
