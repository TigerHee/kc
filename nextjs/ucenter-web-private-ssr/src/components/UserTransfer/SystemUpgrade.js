/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, Col, Row } from '@kux/mui';
import Avatar from 'components/Avatar';
import KCSvgIcon from 'components/common/KCSvgIcon';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import {
  SystemHead,
  SystemItem,
  SystemItemHead,
  SystemItemHeadLeft,
  SystemItemMain,
  SystemUpgradeWrapper,
  UserInfo,
  UserInfoItem,
} from './styled';

class Item extends React.Component {
  render() {
    const { iconId, title, content } = this.props;
    return (
      <SystemItem>
        <SystemItemHead>
          <SystemItemHeadLeft>
            <KCSvgIcon style={{ width: '16px', height: '16px' }} iconId={iconId} />
            <span className="ml-8">{title}</span>
          </SystemItemHeadLeft>
        </SystemItemHead>
        <SystemItemMain>
          {(content || []).map((item, idx) => {
            return <p key={idx}>{item}</p>;
          })}
        </SystemItemMain>
      </SystemItem>
    );
  }
}

@connect((state) => {
  const { email, phone } = state.user.user;
  const { totalBalance } = state.utransfer;
  return {
    user: email || phone,
    totalBalance,
  };
})
@injectLocale
export default class SystemUpgrade extends React.Component {
  render() {
    const { user, totalBalance } = this.props;
    const items = [
      {
        iconId: 'trading-fill',
        title: _t('trade.engine.upgrade'),
        content: [_t('new.wallet.address.help'), _t('old.api.help')],
      },
      {
        iconId: 'order-fill',
        title: _t('advanced.trade.mode'),
        content: [_t('upgrade.rewards.release.help')],
      },
      {
        iconId: 'safe-fill',
        title: _t('sec.protect.upgrade'),
        content: [_t('added.sms'), _t('question.to.trade.code')],
      },
    ];
    return (
      <SystemUpgradeWrapper>
        <SystemHead>
          <h1>{_t('kucoin.upgrade')}</h1>
        </SystemHead>
        <UserInfo>
          <Row>
            <Col>
              <Avatar size={40} />
            </Col>
            <Col className="ml-16">
              <UserInfoItem>{user}</UserInfoItem>
              <UserInfoItem>
                {_t('total.assets')}:&nbsp;{totalBalance} BTC
              </UserInfoItem>
            </Col>
          </Row>
        </UserInfo>
        <div style={{ marginTop: '40px' }}>
          {items.map((item, idx) => {
            return (
              <Item key={idx} iconId={item.iconId} title={item.title} content={item.content} />
            );
          })}
        </div>
        <Button size="large" style={{ marginTop: '24px' }} fullWidth onClick={this.props.onClick}>
          {_t('next')}
        </Button>
      </SystemUpgradeWrapper>
    );
  }
}
