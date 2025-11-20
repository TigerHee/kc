/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import TextTips from './TextTips';
import { Link } from 'src/components/Router';

import { _t } from 'src/utils/lang';
import FutureChangeRate from 'src/trade4.0/components/FutureChangeRate';
import { useDetailData } from './hooks/useDetail';

const ProjectedFundingRate = () => {
  const predictedFundingFeeRate = useDetailData('predictedFundingFeeRate', 0);
  const tips = (
    <div>
      {_t('trade.tooltip.FundingRate1')}
      <Link target="_blank" to="/futures/refer/funding">
        {_t('trade.tooltip.FundingRate2')}
      </Link>
    </div>
  );
  const value = (
    <FutureChangeRate className="text-color" precision={4} value={predictedFundingFeeRate} />
  );
  return <TextTips tips={tips} header={_t('trade.contract.predictedFundingRate')} value={value} />;
};

export default ProjectedFundingRate;
