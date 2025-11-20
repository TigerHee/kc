/**
 * owner: june.lee@kupotech.com
 */
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '@tools/i18n';
import { Button } from '@kux/mui';
import { NAMESPACE } from '../../config';
import useInterval from '../../hooks/common/useInterval';

/**
 * StakingSubmitButton
 * Staking下单按钮
 * 每次询价完成之后提交按钮需要加一个 倒计时的逻辑
 */
const StakingSubmitButton = memo((props) => {
  const { loading: _loading, open, ...restProps } = props;
  const { t: _t } = useTranslation('convert');

  const loopDurationTimeStaking = useSelector((state) => state[NAMESPACE].loopDurationTimeStaking);

  const queryPriceForStakingOrderLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/queryPriceForStakingOrder`],
  );

  const formStatus = useSelector((state) => state[NAMESPACE].formStatus);

  const isNormal = !formStatus;

  const times = loopDurationTimeStaking || 5;

  const loading = _loading || queryPriceForStakingOrderLoading;

  const [delay, setDelay] = useState(1000);
  const [countdown, setCountdown] = useState(times);

  useInterval(() => {
    setCountdown((prev) => --prev);
    if (countdown === 0) {
      setDelay(null);
    }
  }, delay);

  useEffect(() => {
    if (isNormal && !loading && open) {
      setCountdown(times);
      setDelay(1000);
    } else {
      setDelay(null);
      setCountdown(times);
    }
  }, [times, isNormal, loading, open]);

  return (
    <Button
      size="large"
      fullWidth
      loading={loading}
      {...restProps}
      data-inspector="convert_staking_confirm_button"
    >
      {_t('axLG7W3an6vbKkE32hhsTT')}
      {delay ? ` (${countdown}s)` : ''}
    </Button>
  );
});

export default StakingSubmitButton;
