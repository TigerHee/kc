/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import SvgIcon from 'kc-svg-sprite';
import { _t } from 'utils/lang';
// import GradientCard from '../module/GradientCard';
import ConditionIcon from './ConditionIcon';
import KYCCheck from './conditions/KYCCheck';
import CountryCheck2 from './conditions/CountryCheck2';
import AgreeCheck from './conditions/AgreeCheck';
import { px2rem } from 'helper';
import SpotlightAccount from 'assets/spotlight/spotlight-account-fill.svg';
import SpotlightCountry from 'assets/spotlight/spotlight-country-fill.svg';
import SpotlightSign from 'assets/spotlight/spotlight-sign-fill.svg';
import style from './style.less';

const _px2rem = (x) => px2rem(x * 0.54);

// const ArrowIcon = (
//   <SvgIcon
//     iconId="arrow-right-blue-fill"
//     className={style.arrow}
//     style={{ width: 23, height: 23 }}
//   />
// );

const ProjectCondition = ({ item, rule, qualification, isNewSpotlight6 }) => {
  const {
    isCompletedKyc,
    isSignedCountryAgreement,
    isSignedAgreement,
    isKycCountryInBlackList,
  } = qualification || {};
  const completedKyc = isNewSpotlight6
    ? (isCompletedKyc && !isKycCountryInBlackList)
    : true;

  const boxCls = classnames({
    [style.box]: true,
    // [style.halfW]: !!isNewSpotlight6,
  });

  return (
    <div className={style.condition} id="spotlight5-ProjectCondition">
      <div className={style.head}>
        <span className={style.title}>{_t('spotlight5.info.reminder')}</span>
      </div>
      <div className={style.row} data-col={isNewSpotlight6 ? '3' : '4'}>
        <KYCCheck className={style.box} isCompletedKyc={completedKyc} rule={rule} >
          {Placeholder => (
            <div>
              {/* {ArrowIcon} */}
              <img src={SpotlightAccount} alt="" className={style.imgSvg} />
              {/* <ConditionIcon iconId="spotlight-account-fill" width={_px2rem(35)} height={_px2rem(50)} /> */}
              {Placeholder}
            </div>
          )}
        </KYCCheck>

        <CountryCheck2
          className={style.box}
          rule={rule}
          country_agreement={item.country_agreement}
          isSignedAgreement={isSignedCountryAgreement}
        >
          {Placeholder => (
            <div>
              {/* {ArrowIcon} */}
              <img src={SpotlightCountry} alt="" className={style.imgSvg} />
              {/* <ConditionIcon iconId="spotlight-country-fill" width={_px2rem(38)} height={_px2rem(38)} /> */}
              {Placeholder}
            </div>
          )}
        </CountryCheck2>

        <AgreeCheck
          className={style.box}
          agreement={item.agreement}
          isSignedAgreement={isSignedAgreement}
          rule={rule}
        >
          {Placeholder => (
            <div>
              {/* {ArrowIcon} */}
              <img src={SpotlightSign} alt="" className={style.imgSvg} />
              {/* <ConditionIcon iconId="spotlight-sign-fill" width={_px2rem(36)} height={_px2rem(37)} /> */}
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
