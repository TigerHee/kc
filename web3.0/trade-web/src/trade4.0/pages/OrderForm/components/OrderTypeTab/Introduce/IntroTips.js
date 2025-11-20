/*
 * owner: jessie@kupotech.com
 */
import React, { useState, Fragment } from 'react';
import { _t } from 'src/utils/lang';
import IntroModal from './IntroModal';

import { QuestionTooltipWrapper, TooltipTextWrapper, IconWrapper } from './style';

const IntroTips = React.memo(({ defaultKey }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <QuestionTooltipWrapper
        disabledOnMobile
        title={
          <TooltipTextWrapper onClick={() => setVisible(true)}>
            {_t('uRTwhTVDwDn1eZSe4vXomS')}
          </TooltipTextWrapper>
        }
      >
        <IconWrapper
          size={14}
          onClick={() => setVisible(true)}
          className="horizontal-flip-in-arabic"
        />
      </QuestionTooltipWrapper>
      <IntroModal defaultKey={defaultKey} visible={visible} onCancel={() => setVisible(false)} />
    </Fragment>
  );
});

export default IntroTips;
