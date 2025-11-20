/**
 * Owner: willen@kupotech.com
 */
import { css, styled, withTheme } from '@kux/mui';
import AccountHeader from 'components/Account/AccountHeader';
import { TabsWithCoinType } from 'components/Assets/Withdraw/TabsWithCoinType';
import SvgIcon from 'components/common/KCSvgIcon';
import React from 'react';
import { injectLocale } from 'src/components/LoadLocale';
import { _t } from 'tools/i18n';
import { composeSpmAndSave, trackClick } from 'utils/ga';
import { push } from 'utils/router';

const WithdrawBoardTitleEx = styled.div`
  position: absolute;
  right: 24px;
  background: ${({ theme }) => theme.colors.cover8};
  border-radius: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const WithdrawBoard = (theme) => css`
  background-color: ${(theme) => theme.colors.overlay};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  border: solid 1px rgba(0, 0, 0, 0.01);
  min-height: 480px !important;
  padding: 20px 24px;
  .text-center {
    text-align: center;
  }
`;

const Title = styled.div`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  text-align: center;
`;

const WithdrawBox = styled.div`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 64px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 44px;
    padding: 0 16px;
  }
`;

const WithdrawBoardTitleWrapper = styled.div`
  position: relative;
`;

const TIcon = (theme) => css`
  width: 11.5px;
  height: 11.5px;
  margin-right: 6.8px;
  color: ${({ theme }) => theme.colors.text};
`;

// 定义一个styled-component
const CombileCssComponent = styled.div`
  ${(props) =>
    props.className &&
    css`
      ${props.className}
    `}
  ${(props) =>
    props.isCard &&
    css`
      ${WithdrawBoard(props.theme)}
    `}
`;

export class BaseBoard extends React.Component {
  render() {
    const { children, className = '', normal = false, isCard = true, ...rest } = this.props;
    return (
      <CombileCssComponent isCard={isCard} {...rest} data-inspector="account_sub_page">
        {children}
      </CombileCssComponent>
    );
  }
}
@withTheme
@injectLocale
export class BoardWithdraw extends React.Component {
  goAddrManage = () => {
    trackClick(['address', '1']);
    const _url = '/withdraw-addr-manage';
    composeSpmAndSave(_url, ['address', '1']);
    push(_url);
  };

  render() {
    const {
      children,
      hideBtn,
      title = null,
      hideWithdraw,
      titleLeft = false,
      ...rest
    } = this.props;
    return (
      <BaseBoard {...rest}>
        <WithdrawBoardTitleWrapper>
          {hideWithdraw ? null : (
            <WithdrawBox>
              <TabsWithCoinType activeKey="crypto" />
            </WithdrawBox>
          )}

          {/* <h1 className={` ${titleLeft ? style.titleLeft : null}`}>{title || _t('withdrawal')}</h1> */}
          <AccountHeader title={title || _t('withdrawal')} />
          {!hideBtn && (
            <WithdrawBoardTitleEx onClick={this.goAddrManage}>
              <SvgIcon iconId="info" css={TIcon()} />
              {_t('addr.manage.name')}
            </WithdrawBoardTitleEx>
          )}
        </WithdrawBoardTitleWrapper>
        <div>{children}</div>
      </BaseBoard>
    );
  }
}
