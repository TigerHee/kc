/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'lodash';
import { Trans, useTranslation } from '@tools/i18n';
import { withStateHoc } from '../hooks/useStateSelector';
import { useAccountMap, ACCOUNT_CODE, STATUS, checkIsMarginAccount } from './config';
import { MODEL_NAMESPACE } from '../config';
import { Root, Description, Flex, FlexBetween, Title } from './styles/tips/style';
import wariningSvg from '../../static/icon-warning.svg';

const TransferTips = (props) => {
  const { to, from, isLiability, isAutoRepay, toSymbolName, isToMarginAccount } = props;
  const { t: _t } = useTranslation('transfer');
  const ACCOUNT_MAP = useAccountMap();
  const fromAccountType = replace(from[0], /SUB_/, '');
  const toAccountType = replace(to[0], /SUB_/, '');

  // 从储蓄划转到合约
  if (fromAccountType === ACCOUNT_CODE.MAIN && toAccountType === ACCOUNT_CODE.CONTRACT) {
    return <Description>{_t('kumex.transfer.warn')}</Description>;
  }
  if (isToMarginAccount) {
    // 穿仓
    if (isLiability) {
      return (
        <Root>
          <Flex>
            <img alt="" width={24} height={24} src={wariningSvg} />
            <Title>
              <Trans i18nKey="marginAccount.liability.label" ns="transfer" />
            </Title>
          </Flex>
          <Description style={{ marginTop: 2 }}>
            {ACCOUNT_MAP[toAccountType].negativeBalanceTip({
              symbol: replace(toSymbolName, '-', '/'),
            })}
          </Description>
        </Root>
      );
    }
    // 自动还币
    if (isAutoRepay) {
      return (
        <Root>
          <FlexBetween>
            <span>{_t('transfer.autoRepay.enabled')}</span>
          </FlexBetween>
          <Description style={{ marginTop: 2 }}>
            {ACCOUNT_MAP[toAccountType].autoRepayEnabledTip({
              symbol: replace(toSymbolName, '-', '/'),
            })}
          </Description>
        </Root>
      );
    }
  }
  return null;
};

export default withStateHoc(
  connect((state, { to, context }) => {
    const { tagMap } = state[MODEL_NAMESPACE];
    const { isolatedSymbolsMap = {} } = context;
    const { marginPosition: userPosition } = state[MODEL_NAMESPACE];

    const toSymbol = to[1];
    const toAccount = replace(to[0], /SUB_/, '');
    const isToMarginAccount = checkIsMarginAccount(toAccount);
    const { symbolName: toSymbolName = '' } = isolatedSymbolsMap[toSymbol] || {};

    const marginIsAutoRepay = !!userPosition?.isAutoRepay;
    const isolatedIsAutoRepay = tagMap[toSymbol] ? tagMap[toSymbol].isAutoRepay : false;
    const isAutoRepay = toSymbol ? isolatedIsAutoRepay : marginIsAutoRepay;

    const { status } = tagMap[toSymbol] || userPosition || {};
    const LIABILITY_CODE = STATUS[toAccount]?.LIABILITY?.code;
    const isLiability = !!status && status === LIABILITY_CODE;
    return {
      isLiability,
      isAutoRepay,
      toSymbolName,
      isToMarginAccount,
    };
  })(TransferTips),
);
