/**
 * Owner: Clyne@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import { FuturesDetailWrapper } from '../FuturesDetail/style';

export const Wrapper = styled(FuturesDetailWrapper)`
  position: relative;
  display: flex;
  padding: 4px 12px 8px 12px;
  background: ${(props) => props.theme.colors.overlay};
  
  &::before {
    content: ' ';
    height: 1px;
    position: absolute;
    top: 0;
    left: 12px;
    right: 12px;
    background: ${(props) => props.theme.colors.background};
  }
  .text-tips {
    display: flex;
    justify-content: space-between;
    ${fx.alignItems('start')}
    width: calc(50% - 6px);
    overflow: hidden;
    white-space: initial;
    margin-left: 0;
    margin-top: 10px;
    :nth-child(2n) {
      margin-left: 12px;
    }
    .text-value,
    .text-header {
      display: flex;
      margin-bottom: 0;
      ${fx.alignItems('center')}
      > span {
        display: block;
      }
    }
  }
  ${(props) => {
    const isActive = props.active;
    if (!isActive) {
      return `
        padding: 0;
        .text-tips {
          display: none;
        }
      `;
    }
  }}
  .detail-arrow {
    position: absolute;
    bottom: -8px;
    left: 50%;
    margin-left: -6px;
    ${(props) => fx.color(props, 'icon')}
    padding: 4px;
    box-sizing: content-box;
    transform: rotate(180deg);
    &.active {
      transform: rotate(0deg)
    }
  }
`;
