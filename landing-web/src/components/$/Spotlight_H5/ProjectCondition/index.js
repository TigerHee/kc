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
import { px2rem } from 'helper';
import style from './style.less';

const _px2rem = (x) => px2rem(x * 0.54);

// const ArrowIcon = (
//   <SvgIcon
//     iconId="arrow-right-blue-fill"
//     className={style.arrow}
//     style={{ width: _px2rem(23), height: _px2rem(23) }}
//   />
// );

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
      {/* <div className={style.head}>
        <span className={style.title}>{_t('spotlight.cond.title')}</span>
        <span className={style.note}>{_t('spotlight.cond.subtitle')}</span>
      </div> */}
      <div className={style.row} data-col={isNewSpotlight7 ? '3' : '2'}>
        <KYCCheck className={style.box} isCompletedKyc={isCompletedKyc}>
          {Placeholder => (
            <div>
              {/* {ArrowIcon} */}
              <ConditionIcon iconId="kyc-check-fill" width={_px2rem(35)} height={_px2rem(50)} />
              {Placeholder}
            </div>
          )}
        </KYCCheck>
        {isNewSpotlight7 ? null : (
          <TradePasswordCheck className={style.box}>
            {Placeholder => (
              <div>
                {/* {ArrowIcon} */}
                <ConditionIcon iconId="password-check-fill" width={_px2rem(35)} height={_px2rem(47)} />
                {Placeholder}
              </div>
            )}
          </TradePasswordCheck>
        )}
        <CountryCheck
          rule={rule}
          isKycCountryInBlackList={isKycCountryInBlackList}
          isCompletedKyc={isCompletedKyc}
          className={style.box}
        >
          {Placeholder => (
            <div>
              {/* {ArrowIcon} */}
              <ConditionIcon iconId="country-check-fill" width={_px2rem(38)} height={_px2rem(38)} />
              {Placeholder}
            </div>
          )}
        </CountryCheck>
        <AgreeCheck
          agreement={item.agreement}
          isSignedAgreement={isSignedAgreement}
          className={style.box}
        >
          {Placeholder => (
            <div>
              {/* {ArrowIcon} */}
              <ConditionIcon iconId="agree-check-fill" width={_px2rem(36)} height={_px2rem(37)} />
              {Placeholder}
            </div>
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
