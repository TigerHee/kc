/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { map } from 'lodash';
import MuiTooltip from 'src/trade4.0/components/mui/Tooltip';
import { styled, fx } from '@/style/emotion';
import { _t } from 'src/utils/lang';
import { Link } from 'src/components/Router';

const AdlTipsWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.cursor('help')}
`;

const AdlTipsItem = styled.div`
  ${fx.width('2', 'px')}
  ${fx.height('8', 'px')}
  ${fx.marginRight('2')}
  ${(props) => {
    return props.isActive
      ? fx.backgroundColor(props, 'icon40')
      : fx.backgroundColor(props, props.levelColor);
  }}
`;

const AdlTips = ({ delevPercentage }) => {
  const AdlTipsArray = new Array(5);
  const level = Math.ceil(delevPercentage * 5);

  const levelColor = useMemo(() => {
    if (level < 1) {
      return 'icon40';
    }
    if (level >= 1 && level < 2) {
      return 'primary';
    }
    if (level >= 2 && level < 3) {
      return 'complementary';
    }
    if (level >= 3 && level < 6) {
      return 'secondary';
    }
  }, [level]);

  return (
    <MuiTooltip
      title={
        <>
          {_t('trade.tooltip.ADL1')}
        </>
      }
    >
      <AdlTipsWrapper>
        {map(AdlTipsArray, (item, index) => (
          <AdlTipsItem key={`adlTips_${index}`} levelColor={levelColor} isActive={index >= level} />
        ))}
      </AdlTipsWrapper>
    </MuiTooltip>
  );
};

export default memo(AdlTips);
