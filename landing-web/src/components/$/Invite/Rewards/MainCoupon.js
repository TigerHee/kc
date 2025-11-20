/**
 * Owner: terry@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import Coupon from './Coupon';
import {
  MainCouponCard,
  Tag,
} from '../styles';

const MainCoupon = ({ tagRef }) => {

  return (
    <MainCouponCard>
      <Tag ref={tagRef}>{_t('pyPtbQVVbXkf7uFmukG1xR')}</Tag>
      <Coupon
        main={true}
        title={_t('gJKeBXFe7fnY5YeTrypnog')}
        btnText={_t('gs3JeeshnRZPixkkwMat1m')}
      />
    </MainCouponCard>
  );
};

export default MainCoupon;