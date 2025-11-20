/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { styled } from '@/style/emotion';
import { useTheme } from '@emotion/react';
import { ICFailOutlined, ICSuccessOutlined } from '@kux/icons';
import { eTheme, eConditionStyle } from '@/utils/theme';

const PhaseInfoFeatureSpan = styled.span`
  padding: 0 8px;
  ${eConditionStyle(true, 'noPadding')`
    padding: 0;
  `}
`;

const PhaseInfoLabel = styled.span`
  padding-left: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.isActive ? eTheme('text') : eTheme('text60'))};
`;

const DetureIconDiv = styled.div`
  vertical-align: -3px;
  display: inline-block;
  height: ${(props) => props.size}px;
`;

/**
 * 集合竞价功能描述介绍
 * @param {{
 *  label: string,
 *  disabled?: boolean,
 *  size?; number,
 * }} props
 */
const FetureDes = (props) => {
  const { label, disabled, size = 16, noPadding, isActive } = props;
  const theme = useTheme();
  return (
    <PhaseInfoFeatureSpan noPadding={noPadding}>
      <DetureIconDiv size={size}>
        {disabled ? (
          <ICFailOutlined color={theme.colors.secondary} size={size} />
        ) : (
          <ICSuccessOutlined color={theme.colors.primary} size={size} />
        )}
      </DetureIconDiv>
      <PhaseInfoLabel isActive={isActive}>{label}</PhaseInfoLabel>
    </PhaseInfoFeatureSpan>
  );
};

export default memo(FetureDes);
