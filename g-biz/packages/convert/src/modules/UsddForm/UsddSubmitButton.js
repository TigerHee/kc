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
 * UsddSubmitButton
 * USDD下单按钮
 * 每次询价完成之后提交按钮需要加一个 倒计时的逻辑
 */
const UsddSubmitButton = memo((props) => {
  const { loading: _loading, open, ...restProps } = props;
  const { t: _t } = useTranslation('convert');

  const loopDurationTimeUSDD = useSelector((state) => state[NAMESPACE].loopDurationTimeUSDD);

  const queryPriceForUsddOrderLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/queryPriceForUsddOrder`],
  );

  const formStatus = useSelector((state) => state[NAMESPACE].formStatus);

  const isNormal = !formStatus;

  const times = loopDurationTimeUSDD || 5;

  const loading = _loading || queryPriceForUsddOrderLoading;

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
    <Button size="large" fullWidth loading={loading} {...restProps}>
      {_t('axLG7W3an6vbKkE32hhsTT')}
    </Button>
  );
});

export default UsddSubmitButton;
