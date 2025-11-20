import styled from 'emotion/index';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { layout } from 'styled-system';
import Popper from '../Popper';

export const TooltipPopper = styled(Popper)`
  z-index: ${(props) => props.theme.zIndices.tooltip};
`;

export const TooltipTooltip = styled('div', {
  shouldForwardProp,
})(
  ({ theme }) => `
    max-width: 320px;
    width: 100%;
    position: relative;
    padding: 12px;
    border-radius: 8px;
    background: ${theme.colors.tip};
  `,
  layout,
);

export const TooltipTitle = styled.div`
  word-wrap: break-word;
  font-size: 14px;
  line-height: 130%;
  font-weight: 500;
  color: #fff;
  font-family: ${(props) => props.theme.fonts.family};
`;

export const TooltipArrow = styled.div`
  overflow: hidden;
  position: absolute;
  width: 16px;
  box-sizing: border-box;
  transition: none;
  pointer-events: none;
  background: 0 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &[data-placement*='right'] {
    left: -8px;
  }
  &[data-placement*='left'] {
    right: -8px;
  }
  &[data-placement*='top'] {
    bottom: -8px;
  }
  &[data-placement*='bottom'] {
    top: -8px;
  }
`;

export const TooltipArrowContent = styled.span`
  width: 16px;
  height: 16px;
  background: ${(props) => props.theme.colors.tip};
  margin: auto;
  pointer-events: none;
  display: block;
  border-radius: 3px;
  &[data-placement*='right'] {
    transform: translateX(4px) rotate(45deg);
  }
  &[data-placement*='left'] {
    transform: translateX(-4px) rotate(45deg);
  }
  &[data-placement*='top'] {
    transform: translateY(-4px) rotate(45deg);
  }
  &[data-placement*='bottom'] {
    transform: translateY(4px) rotate(45deg);
  }
`;
