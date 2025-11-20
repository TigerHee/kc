/**
 * Owner: tiger@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Select } from '@kux/mui';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';

export default ({ timeZone, timeZones, disabled = false }) => {
  useLocale();
  const dispatch = useDispatch();

  const confirm = async (zone) => {
    await dispatch({
      type: 'user/setLocal',
      payload: { params: { timeZone: zone } },
    });
    dispatch({
      type: 'user/pullUser',
    });
  };

  return (
    <Select
      label={_t('6M1bZJjKFweyfwcfp7Pitp').replace(/[:：]$/, '')}
      disabled={disabled}
      value={timeZone}
      onChange={confirm}
      options={_.map(timeZones, (item) => ({
        label: item[1],
        value: item[0],
        title: item[0],
      }))}
      size="xlarge"
      placeholder={_t('otc.ads.onlin.time.placeholder')}
    />
  );
};
