/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import HeaderOption from 'components/Root/Header/HeaderOption';
import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'src/utils/router';
import { _t } from 'tools/i18n';
import Combination from './Combination';
import SetPassword from './SetPassword';
import { Out, UtransferHeader, UtransferWrapper } from './styled';
import SystemUpgrade from './SystemUpgrade';
import Terms from './Terms';

@connect((state) => {
  return {
    NeedVerify: state.utransfer.NeedVerify,
  };
})
class UserTransferContent extends React.Component {
  state = {
    currentKey: 'terms',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'utransfer/get_verify_type',
      payload: {
        bizType: 'USER_UPGRADE',
      },
    });
    this.props.dispatch({
      type: 'utransfer/getUserTotalBalance',
    });
  }

  next = (Key) => {
    this.setState({
      currentKey: Key,
    });
  };

  render() {
    const { NeedVerify } = this.props;
    const { currentKey } = this.state;
    const contentMap = {
      terms: (
        <Terms
          onClick={() => {
            this.next('SystemUpgrade');
          }}
        />
      ),
      SystemUpgrade: (
        <SystemUpgrade
          onClick={() => {
            let Key;
            if (NeedVerify) {
              Key = 'Combination';
            } else {
              Key = 'SetPassword';
            }
            this.next(Key);
          }}
        />
      ),
      SetPassword: <SetPassword step={1} />,
      Combination: <Combination />,
    };
    return <UtransferWrapper>{contentMap[currentKey] || null}</UtransferWrapper>;
  }
}

@connect((state) => {
  return {
    status: (state.user.user || {}).status,
  };
})
class UserTransferContainer extends React.Component {
  checkIfGoToAccount() {
    const { status } = this.props;
    // 状态不有9的时候跳到/account页
    return status !== 9;
  }

  componentDidUpdate() {
    if (this.checkIfGoToAccount()) {
      replace('/account');
    }
  }

  componentDidMount() {
    if (this.checkIfGoToAccount()) {
      replace('/account');
    }
  }

  render() {
    if (this.checkIfGoToAccount()) {
      return null;
    }
    return <div data-inspector="utransfer_page">{this.props.children}</div>;
  }
}

@connect()
@injectLocale
export default class UserTransfer extends React.Component {
  handleLogOut = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/logout',
      payload: {
        to: '/',
      },
    });
  };

  render() {
    return (
      <UserTransferContainer>
        <UtransferHeader>
          <HeaderOption currencyRender={false} />
          <Out onClick={this.handleLogOut}>{_t('logout')}</Out>
        </UtransferHeader>
        <UserTransferContent />
      </UserTransferContainer>
    );
  }
}
