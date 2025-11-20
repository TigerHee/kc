/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'kc-svg-sprite';
import { _t } from 'utils/lang';
import GradientCard from '../module/GradientCard';
import ConditionIcon from './ConditionIcon';
import KYCCheck from './conditions/KYCCheck';
import TradePasswordCheck from './conditions/TradePasswordCheck';
import CountryCheck from './conditions/CountryCheck';
import AgreeCheck from './conditions/AgreeCheck';
import style from './style.less';

const ArrowIcon = (
  <SvgIcon
    iconId="arrow-right-blue-fill"
    className={style.arrow}
    style={{ width: 23, height: 23 }}
  />
);

const ProjectCondition = ({ item, rule, qualification, isNewSpotlight7 }) => {
  const {
    isCompletedKyc,
    isInProcessing,
    isKycCountryInBlackList,
    isPossibleOrder,
    isSignedAgreement,
  } = qualification || {};

  return (
    <div className={style.condition}>
      <div className={style.head}>
        <span className={style.title}>{_t('spotlight.cond.title')}</span>
        <span className={style.note}>{
          isNewSpotlight7
          ? _t('spotlight.cond.subtitle.new7')
          : _t('spotlight.cond.subtitle')}
        </span>
      </div>
      <div className={style.row} data-col={isNewSpotlight7 ? '3' : '4'}>
        <KYCCheck isCompletedKyc={isCompletedKyc}>
          {Placeholder => (
            <GradientCard className={style.box}>
              {ArrowIcon}
              <ConditionIcon iconId="kyc-check-fill" width={35} height={50} />
              {Placeholder}
            </GradientCard>
          )}
        </KYCCheck>
        {isNewSpotlight7 ? null : (
          <TradePasswordCheck>
            {Placeholder => (
              <GradientCard className={style.box}>
                {ArrowIcon}
                <ConditionIcon iconId="password-check-fill" width={35} height={47} />
                {Placeholder}
              </GradientCard>
            )}
          </TradePasswordCheck>
        )}
        <CountryCheck
          rule={rule}
          isKycCountryInBlackList={isKycCountryInBlackList}
          isCompletedKyc={isCompletedKyc}
        >
          {Placeholder => (
            <GradientCard className={style.box}>
              {ArrowIcon}
              <ConditionIcon iconId="country-check-fill" width={38} height={38} />
              {Placeholder}
            </GradientCard>
          )}
        </CountryCheck>
        <AgreeCheck
          agreement={item.agreement}
          isSignedAgreement={isSignedAgreement}
        >
          {Placeholder => (
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
