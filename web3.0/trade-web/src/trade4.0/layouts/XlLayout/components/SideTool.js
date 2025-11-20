/*
 * owner: Borden@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import Tooltip from '@mui/Tooltip';
import SvgComponent from '@/components/SvgComponent';
import { useIsRTL } from '@/hooks/common/useLang';
import { MODULES_MAP } from '../../moduleConfig';

/** 样式开始 */
const StyledTooltip = styled(Tooltip)`
  ${(props) => {
    if (props.isRtl) {
      return `
        .KuxTooltip-arrow>span {
          transform: translateX(4px) rotate(225deg);
        }
        .KuxTooltip-arrow {
          right: unset;
          left: -8px;
        }
      `;
    }
  }}
`;
const IconBox = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;
const Icon = styled(SvgComponent)`
  fill: ${props => props.theme.colors.icon};
`;
// const Name = styled.div`
//   width: 40px;
//   overflow: hidden;
//   text-align: center;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   color: ${props => props.theme.colors.text30};
// `;
const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(props) => {
    if (props.isActive) {
      return `
        .flexlayout__sideTool_iconBox {
          background-color: ${props.theme.colors.cover8};
        }
        .flexlayout__sideTool_icon {
          fill: ${props.theme.colors.text};
          path {
            fill: ${props.theme.colors.text};
          }
        }
      `;
    }
    return '';
  }}
  &:hover {
    .flexlayout__sideTool_iconBox {
      background-color: ${props => props.theme.colors.cover8};
    }
    /* .flexlayout__sideTool_name {
      color: ${props => props.theme.colors.text};
    } */
  }
`;
/** 样式结束 */

const SideTool = React.memo(({ isActive, id }) => {
  const isRtl = useIsRTL();
  const { iconId, renderName = () => '' } = MODULES_MAP[id] || {};
  return (
    <StyledTooltip placement="left" isRtl={isRtl} title={renderName()}>
      <Container isActive={isActive}>
        <IconBox className="flexlayout__sideTool_iconBox">
          {!!iconId && (
            <Icon
              size={20}
              type={iconId}
              className="flexlayout__sideTool_icon"
            />
          )}
        </IconBox>
        {/* <Name className="flexlayout__sideTool_name">{name}</Name> */}
      </Container>
    </StyledTooltip>
  );
});

export default SideTool;
