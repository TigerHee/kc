/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import { withRouter } from 'components/Router';
import UserRoot from 'components/UserRoot';
import pathToRegexp from 'path-to-regexp';
import React from 'react';
import { connect } from 'react-redux';
import KcBreadCrumbs from 'src/components/KcBreadCrumbs';
import { _t } from 'tools/i18n';

import { injectLocale } from '@kucoin-base/i18n';

const MainContent = styled.div`
  width: 100%;
  max-width: 1200px;
  @media screen and (max-width: 1248px) {
    padding: 0px 24px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0px 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 12px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  font-size: 14px;
  line-height: 22px;
`;

@connect()
@withRouter()
@injectLocale
class AccountPage extends React.Component {
  // 进入子账号api，进行标识设置
  componentDidMount() {
    const { dispatch, query } = this.props;
    dispatch({
      type: 'api_key/update',
      payload: {
        subName: query.sub,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'api_key/update',
      payload: {
        filters: {
          bizType: '',
        },
        subName: undefined,
        apiKeys: [],
        cloneApiKeys: [],
        ApiWordModalVisible: false,
        securityModalVisible: false,
        needActions: [],
        ready: false,
      },
    });
  }

  render() {
    const { pathname } = this.props;
    const pathReg = pathToRegexp('/account-sub/api-manager/:sub');
    const execResult = pathReg.exec(pathname);
    const showHeader = execResult && execResult[1];

    return (
      <UserRoot>
        <div className="side-menu-layout">
          <MainContent>
            {showHeader ? (
              <HeaderWrapper>
                <KcBreadCrumbs
                  breadCrumbs={[
                    { label: _t('b3ZQna2k1NGzWKCfmbC8vr'), url: `/account/sub` },
                    { label: _t('api.title') },
                  ]}
                />
                {/* <PosWrapper onClick={() => push('/account/sub')}>
                  {_t('subaccount.subaccount')}
                </PosWrapper> */}
              </HeaderWrapper>
            ) : null}
            {this.props.children}
          </MainContent>
        </div>
      </UserRoot>
    );
  }
}

export default AccountPage;
