/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';

import { formatCurrency } from '@/utils/futures';
import { _t, _tHTML } from 'utils/lang';

import { styled } from '@kux/mui/emotion';
import { Button } from '@kux/mui';

const BonusTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
`;

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  margin-bottom: 12px;
`;

const DeductionCoupon = ({ onClose, bonusData, type }) => {
  const settleCurrency = useSelector((state) => state.futures_orders.settleCurrency);

  const debounceOpenTransfer = React.useCallback(
    debounce(() => {
      onClose();
      if (type !== 'anniversary') {
        // context.openAssetsBiz('transfer', formatCurrency(settleCurrency));
      }
    }, 100),
    [type],
  );

  const titleText = React.useMemo(() => {
    if (bonusData.rewards) {
      return {
        title: _tHTML('open.futures.coupon.title', { amount: bonusData.rewards || '-' }),
        subTitle: _tHTML('open.futures.coupon.title.sub', {
          percent: `${bonusData.deductionRatio || '-'}%`,
        }),
      };
    }
    return {
      title: _t('open.futures.success'),
      subTitle: _t('open.futures.body.no.bonus'),
    };
  }, [bonusData.deductionRatio, bonusData.rewards]);

  const btnText = React.useMemo(() => {
    if (bonusData.rewards) {
      return _t('activity.dialog.getit');
    }
    return _t('i.know');
  }, [bonusData.rewards]);

  return (
    <>
      <BonusTitle>{titleText.title}</BonusTitle>
      <SubTitle>{titleText.subTitle}</SubTitle>
      <ButtonGroup>
        <Button variant="contained" color="primary" fullWidth onClick={debounceOpenTransfer}>
          {type === 'anniversary' ? btnText : _t('transfer.btn')}
        </Button>
      </ButtonGroup>
      {type === 'anniversary' ? (
        ''
      ) : (
        <div>
          <span>{_t('transfer.btn.tip')}</span>
        </div>
      )}
    </>
  );
};

export default React.memo(DeductionCoupon);
