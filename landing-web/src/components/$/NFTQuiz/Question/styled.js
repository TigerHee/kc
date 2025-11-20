/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r  } from '@kufox/mui/utils';

export const Process = styled.p`
  font-weight: 400;
  font-size: ${_r(14)};
  line-height: ${_r(22)};
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0;
  text-align: center;
`;

export const Title = styled.p`
  margin-bottom: ${_r(24)};
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #fff;
  text-align: center;
`;

export const BaseOption = styled.div`
  position: relative;
  width: 100%;
  min-height: ${_r(90)};
  background: ${({ checkOk, tipOK }) => {
    if (tipOK !== undefined) {
      return tipOK ? 'rgba(128, 220, 17, 0.12)' : 'rgba(29, 33, 36, 0.4)';
    }
    if (checkOk === undefined) return 'rgba(29, 33, 36, 0.4)';
    return checkOk ? '#80DC11' : 'rgba(255, 93, 41, 0.12)';
  }};
  border: ${({checkOk, tipOK }) => {
    if (checkOk !==undefined) {
      return checkOk ? 'none' : `${_r(0.5)} solid #FF5D29`
    }
    if (tipOK) return `${_r(0.5)} solid #80DC11`;
    return `${_r(0.415551)} solid rgba(255, 255, 255, 0.4)`;
  }};
  backdrop-filter: blur(${_r(9.97321)});
  border-radius: ${_r(66.4881)};
  padding: ${_r(32)};
  color: ${({ checkOk, tipOK }) => {
    if (tipOK !== undefined || checkOk === false) return '#fff';
    if (checkOk) return '#000';
    return '#fff';
  }};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ isLast }) => !isLast ? _r(14) : 0 };
  &.active:active {
    background: rgba(255, 255, 255, 0.12);
  }
  .index {
    font-weight: 400;
    font-size: ${_r(14)};
    line-height: ${_r(22)};
    margin-right: ${_r(16)};
  }
  .txt {
    display: inline-block;
    max-width: ${_r(205)};
    font-weight: 600;
    font-size: ${_r(14)};
    line-height: ${_r(26)};
    word-break: break-word;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16);
  }
`;

export const Marker = styled.img`
  margin-left: auto;
`;

export const HelpProgress =styled.span`
  .light {
    color: rgba(128, 220, 17, 1);
  }
`;