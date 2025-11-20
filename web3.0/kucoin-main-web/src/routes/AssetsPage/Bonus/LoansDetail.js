/**
 * Owner: borden@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { styled, useResponsive } from '@kux/mui';
import BreadCrumbs from 'components/NewKcBreadCrumbs';
import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import LoansContent from './LoansContent';
import LoansLayout from './LoansContent/LoansLayout';
import { COUPON_CENTER_URL } from 'src/constants';

const BreadCrumbsWrap = styled.div`
  font-weight: 500;
  padding-bottom: 8px;
`;

const LoansDetail = memo((props) => {
  useLocale();
  const { sm } = useResponsive();

  const breadCrumbs = useMemo(
    () => [
      {
        label: _t('eTDTJxStkmMUQt69pX38Mm'),
        url: COUPON_CENTER_URL,
      },
      {
        label: _t('assets.bonus.loans'),
      },
    ],
    [],
  );

  return (
    <LoansLayout>
      {sm && (
        <BreadCrumbsWrap>
          <BreadCrumbs breadCrumbs={breadCrumbs} />
        </BreadCrumbsWrap>
      )}
      <LoansContent {...props} />
    </LoansLayout>
  );
});

export default LoansDetail;
