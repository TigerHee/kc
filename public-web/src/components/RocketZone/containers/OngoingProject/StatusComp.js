/**
 * Owner: jessie@kupotech.com
 */
import classNames from 'classnames';
import { memo, useMemo } from 'react';
import { _t } from 'tools/i18n';
import { MarkWrapper } from './styledComponents';

const StatusComp = memo(({ status, typeName }) => {
  const statusText = useMemo(() => {
    if (typeName === 'gemPreMarket') {
      // 五种状态依次： 未开始 交易中 待交割 交割中 已结束
      if (status === 0) {
        return _t('4168c02542864000a190');
      } else if (status === 1) {
        return _t('6062bed4b3b34000a5a8');
      } else if (status === 2) {
        return _t('3ouaJyDJuh7eXgYEpJRnSv');
      } else if (status === 3) {
        return _t('f1161fe89e3e4000ac4b');
      } else {
        return _t('cc4d141c536e4000a9d2');
      }
    } else {
      // 三种状态依次： 未开始 进行中 已结束
      if (status === 0) {
        return _t('4168c02542864000a190');
      } else if (status === 1) {
        return _t('7e9ed96c04204000acbf');
      } else {
        return _t('07e43af0e0574000a983');
      }
    }
  }, [status, typeName]);

  return (
    <MarkWrapper
      className={classNames('mark', {
        ['complementary']: status === 0,
        ['primary']: status === 1,
        ['grey']: status >= 2,
      })}
    >
      {statusText}
    </MarkWrapper>
  );
});

export default memo(StatusComp);
