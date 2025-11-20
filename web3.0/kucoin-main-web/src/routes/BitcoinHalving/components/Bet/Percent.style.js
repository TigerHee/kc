/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
`;

export const LeftBtn = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  flex: ${({ rate }) => (rate === Infinity ? 5 : rate)};
  min-width: 60px;
`;

export const UpWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(16, 38, 33, 1);
  z-index: 9;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
`;

export const Parallelism = styled.div`
  flex: 1;
  height: 48px;
  background: rgba(16, 38, 33, 1);
  margin-left: -20px;
  transform: skew(-13deg);
  border-radius: 2px;
`;

export const RightBtn = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 12px;
  cursor: pointer;
  flex: 1;
  min-width: 60px;
`;

export const DownWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(45, 26, 26, 1);
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  z-index: 9;
`;
export const RightParallelism = styled.div`
  flex: 1;
  height: 48px;
  background: rgba(45, 26, 26, 1);
  margin-right: -20px;
  transform: skew(-13deg);
  border-radius: 2px;
`;

export const PercentText = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 16px;
  top: 4px;
  font-size: 16px;
  font-weight: 700;
  color: #01bc8d;
  line-height: 130%;
  & > span {
    font-weight: 400;
    font-size: 12px;
    text-wrap: nowrap;
  }
`;

export const PercentTextRight = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 16px;
  text-align: right;
  top: 4px;
  font-size: 16px;
  font-weight: 700;
  color: #f65454;
  line-height: 130%;
  & > span {
    font-weight: 400;
    font-size: 12px;
    text-wrap: nowrap;
  }
`;
