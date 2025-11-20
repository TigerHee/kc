/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Desc: 高级限价下单模式引导
 */
import React, { memo } from 'react';
import { _t } from 'src/utils/lang';
import GuideTooltip from '@/components/GuideTooltip';

const AdvancedLimitGuide = () => {
  return (
    <GuideTooltip
      placement="left"
      code="spotAdvancedLimit"
      title={_t('gSwMLa4CkKnfuxZeVSwZCt')}
      describe={_t('4p5TT2WHwGBr9o3FwcXuGt')}
      iconProps={{ type: 'exchange', fileName: 'orderForm', className: 'flexShrink' }}
    />
  );
};

export default memo(AdvancedLimitGuide);
