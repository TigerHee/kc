/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { Divider } from '@kux/mui';
import {
  useI18n,
  useAvailableBalance,
  styled,
  fx,
  PrettyCurrency,
  PrettySize,
} from '@/pages/Futures/import';
import { namespace } from '../../config';
import { makeNumber } from 'src/trade4.0/utils/futures/makeNumber';

const DetailItem = styled.div`
  ${fx.display('flex')}
  ${fx.justifyContent('space-between')}
  ${fx.marginBottom('10')}
`;

const DetailItemLabel = styled.div`
  ${fx.fontWeight('400')}
  ${fx.fontSize('14')}
  ${fx.lineHeight('18')}
  ${(props) => fx.color(props, 'text40')}
`;

const DetailItemContent = styled.div`
  ${fx.fontWeight('500')}
  ${fx.fontSize('14')}
  ${fx.lineHeight('18')}
  ${(props) => fx.color(props, 'text')}
  ${fx.textAlign('right')}
`;

const AvailableBalance = styled.div`
  ${fx.marginTop('6')}
  ${fx.display('flex')}
`;

const AvailableBalanceLabel = styled.span`
  ${fx.fontWeight('400')}
  ${fx.fontSize('14')}
  ${fx.lineHeight('18')}
  ${(props) => fx.color(props, 'text40')}
  ${fx.marginRight('4')}
`;

const AvailableBalanceContent = styled.span`
  ${fx.fontWeight('500')}
  ${fx.fontSize('14')}
  ${fx.lineHeight('18')}
  ${(props) => fx.color(props, 'text60')}
`;

const StyledDivider = styled(Divider)`
  ${fx.margin('24px 0px')}
`;

const DetailBox = styled.div``;
const InputContent = styled.div``;

const Detail = (props) => {
  const { _t } = useI18n();
  const {
    currentQty: size,
    realLeverage: leverage,
    maintMargin: margin,
    settleCurrency,
    symbol,
    isTrialFunds,
  } = useSelector((state) => state[namespace].appendMarginDetail, isEqual);
  const availableBalance = useAvailableBalance(settleCurrency, isTrialFunds);

  const levText = makeNumber({
    value: leverage === 0 ? 0.01 : leverage,
    pointed: false,
    showSmall: true,
  });

  return (
    <DetailBox>
      <DetailItem>
        <DetailItemLabel>{_t('append.contract.num')}</DetailItemLabel>
        <DetailItemContent>
          <PrettySize symbol={symbol} value={size} />
        </DetailItemContent>
      </DetailItem>
      <DetailItem>
        <DetailItemLabel>{_t('append.position.lv')}</DetailItemLabel>
        <DetailItemContent>{`${levText} x`}</DetailItemContent>
      </DetailItem>
      <DetailItem>
        <DetailItemLabel>{_t('assets.positionMargin')}</DetailItemLabel>
        <DetailItemContent>
          <PrettyCurrency value={margin} currency={settleCurrency} isShort />
        </DetailItemContent>
      </DetailItem>
      <StyledDivider />
      <InputContent>{props.children}</InputContent>
      <AvailableBalance>
        <AvailableBalanceLabel>{_t('append.position.avb')}</AvailableBalanceLabel>
        <AvailableBalanceContent>
          <PrettyCurrency value={availableBalance} currency={settleCurrency} />
        </AvailableBalanceContent>
      </AvailableBalance>
    </DetailBox>
  );
};

export default Detail;
