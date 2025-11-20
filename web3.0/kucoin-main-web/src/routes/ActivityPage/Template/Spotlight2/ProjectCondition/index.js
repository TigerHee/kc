/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'components/common/KCSvgIcon';
import { _t } from 'tools/i18n';
import GradientCard from '../../../module/GradientCard';
import ConditionIcon from './ConditionIcon';
import KYCCheck from './conditions/KYCCheck';
import CountryCheck from './conditions/CountryCheck';
import AgreeCheck from './conditions/AgreeCheck';
import style from './style.less';
import { useLocale } from '@kucoin-base/i18n';

const ArrowIcon = (
  <SvgIcon
    iconId="arrow-right-blue-fill"
    className={style.arrow}
    style={{ width: 23, height: 23 }}
  />
);

const ProjectCondition = ({ item, rule, qualification }) => {
  useLocale();
  const { isCompletedKyc, isKycCountryInBlackList, isSignedAgreement } = qualification || {};

  return (
    <div className={style.condition}>
      <div className={style.head}>
        <span className={style.title}>{_t('spotlight.reservation.condition')}</span>
      </div>
      <div className={style.row}>
        <KYCCheck isCompletedKyc={isCompletedKyc}>
          {(Placeholder) => (
            <GradientCard className={style.box}>
              {ArrowIcon}
              <ConditionIcon iconId="kyc-check-fill" width={35} height={50} />
              {Placeholder}
            </GradientCard>
          )}
        </KYCCheck>
        <CountryCheck
          rule={rule}
          isKycCountryInBlackList={isKycCountryInBlackList}
          isCompletedKyc={isCompletedKyc}
        >
          {(Placeholder) => (
            <GradientCard className={style.box}>
              {ArrowIcon}
              <ConditionIcon iconId="country-check-fill" width={38} height={38} />
              {Placeholder}
            </GradientCard>
          )}
        </CountryCheck>
        <AgreeCheck agreement={item.agreement} isSignedAgreement={isSignedAgreement}>
          {(Placeholder) => (
            <GradientCard className={style.box}>
              {ArrowIcon}
              <ConditionIcon iconId="agree-check-fill" width={36} height={37} />
              {Placeholder}
            </GradientCard>
          )}
        </AgreeCheck>
      </div>
    </div>
  );
};

ProjectCondition.propTypes = {
  item: PropTypes.object,
  qualification: PropTypes.object,
};

ProjectCondition.defaultProps = {
  item: {},
  qualification: {},
};

export default ProjectCondition;
