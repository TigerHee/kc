/**
 * Owner: willen@kupotech.com
 */
import { Button, css, styled } from '@kux/mui';
import { useMemo } from 'react';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftText = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  [dir='rtl'] & {
    text-align: right;
  }
`;

// 数字、法币的充提按钮点击埋点的blockId
const trackConfig = {
  deposit: {
    crypto: 'depositFiat', // 数字货币界面，显示的充值法币
    fiat: '', // 法币界面，显示的充值数字资产
  },
  withdraw: {
    crypto: 'withdrawFiat',
    fiat: '',
  },
};

/**
 * @typedef {object} IProps
 * @property {'crypto' | 'fiat'} activeKey
 * @property {'deposit' | 'withdraw'=} bizType
 *
 * @param {IProps} props
 * @returns
 */
export function TabsWithCoinType(props) {
  const { sm } = useResponsiveSSR();

  const { activeKey = 'crypto', bizType = 'withdraw', showRightLink = true } = props;
  const isCrypto = useMemo(() => {
    return activeKey === 'crypto';
  }, [activeKey]);

  const isWithdraw = useMemo(() => {
    return bizType === 'withdraw';
  }, [bizType]);

  const texts = useMemo(() => {
    if (isWithdraw) {
      const cryptoWithdrawTitle = 'withdraw.new.title';
      const fiatWithdrawTitle = 'withdraw.fiat.new.title';
      return {
        left: _t(isCrypto ? cryptoWithdrawTitle : fiatWithdrawTitle),
        right: _t(isCrypto ? fiatWithdrawTitle : cryptoWithdrawTitle),
        rightLink: isCrypto ? '/assets/fiat-currency/withdraw' : '/assets/withdraw',
      };
    } else {
      const cryptoDepositTitle = 'deposit.new.title';
      const fiatDepositTitle = 'deposit.new.fiat';
      return {
        left: _t(isCrypto ? cryptoDepositTitle : fiatDepositTitle),
        right: _t(isCrypto ? fiatDepositTitle : cryptoDepositTitle),
        rightLink: isCrypto ? '/assets/fiat-currency/recharge' : '/assets/coin',
      };
    }
  }, [isCrypto, isWithdraw]);

  const handleTrack = () => {
    const blockId = trackConfig[bizType] && trackConfig[bizType][activeKey];
    if (blockId) {
      trackClick([blockId, '1']);
    }
  };

  return (
    <Wrapper>
      <LeftText>{texts.left}</LeftText>
      <div
        className={css`
          visibility: ${showRightLink ? 'visible' : 'hidden'};
        `}
      >
        <Button
          onClick={() => {
            handleTrack();
            push(texts.rightLink);
          }}
          variant="outlined"
          size={sm ? 'basic' : 'mini'}
        >
          {texts.right}
        </Button>
      </div>
    </Wrapper>
  );
}
