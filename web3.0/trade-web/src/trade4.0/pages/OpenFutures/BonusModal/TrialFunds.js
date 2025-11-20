/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { styled } from '@kux/mui/emotion';
import { Button } from '@kux/mui';
import { _t, _tHTML } from 'utils/lang';

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

const TrialFunds = ({ onClose, bonusData, type }) => {
  const loading = useSelector((state) => state.loading.effects['order/create']);

  return (
    <>
      <BonusTitle>
        {_tHTML('open.futures.bonus.title', { amount: bonusData.rewards || '-' })}
      </BonusTitle>
      <SubTitle>{_t('homepage.slogan')}</SubTitle>
      <Button
        variant="contained"
        fullWidth
        loading={loading}
        size="large"
        onClick={() => {
          onClose();
        }}
      >
        {_t('activity.dialog.getit')}
      </Button>
    </>
  );
};

export default React.memo(TrialFunds);
