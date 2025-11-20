/**
 * Owner: lena@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { styled } from '@kufox/mui';
import { useTranslation } from '@tools/i18n';
import storage from '@utils/storage';
import { getKycLevel } from './config';
import { getKycInfo, getKybInfo } from './service';

const Wrapper = styled.div``;
const KycLevel = ({ className, beforeSlot, afterSlot }) => {
  const [level, setLevel] = useState(storage.getItem('kycLevel') || '');
  const { t: _t } = useTranslation('header');

  const handlData = (data) => {
    const _level = getKycLevel(data);
    setLevel(_level);
    storage.setItem('kycLevel', _level);
    storage.setItem('kycLevel_type', data?.type);
  };

  const getLevel = async () => {
    try {
      storage.setItem('kycLevel_expiredTime', Date.parse(new Date()) + 5000);
      const type = storage.getItem('kycLevel_type') || 0;
      const handler = type * 1 === 1 ? getKybInfo : getKycInfo;
      const { data, success } = await handler();

      if (data && success) {
        if (
          (data?.type === 1 && data?.type !== type * 1) ||
          ([-1, 0].includes(data?.type) && ![-1, 0].includes(type * 1))
        ) {
          try {
            const handler = data?.type === 1 ? getKybInfo : getKycInfo;
            const res = await handler();
            handlData(res?.data);
          } catch (error) {
            console.log('error', error);
          }
        } else {
          handlData(data);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    (async () => {
      const levelStr = storage.getItem('kycLevel');

      if (!levelStr) {
        await getLevel();
        return;
      }
      const expiredTime = storage.getItem('kycLevel_expiredTime');
      const now = Date.parse(new Date());
      if (now > expiredTime * 1) {
        await getLevel();
      }
    })();
  }, []);

  return (
    <Wrapper className={className} data-level={level}>
      {beforeSlot}
      {level === 'LV0'
        ? _t('kyc.certification.personal.certified.not')
        : storage.getItem('kycLevel_type') * 1 === 1 && level === 'LV3'
        ? _t('ebNtPL9RQSM851k5Jg9vFa')
        : level}
      {afterSlot}
    </Wrapper>
  );
};
export default (props) => {
  return <KycLevel {...props} />;
};
