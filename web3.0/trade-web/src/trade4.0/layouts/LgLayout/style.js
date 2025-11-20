/*
 * owner: borden@kupotech.com
 */
import styled from '@emotion/styled';

// 随机生成16进制颜色
// function getRandomColor(props) {
//   return props.theme.colors.overlay;
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return 'color';
// }

const FlexBox = styled.div`
  display: flex;
`;
const ColumnBox = styled(FlexBox)`
  flex-direction: column;
`;
const Module = styled.div`
  position: relative;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.overlay};
`;

export const InfoBarBox = styled.div`
  margin-bottom: 4px;
`;

/** 内容区域开始 */
export const ScrollArea = styled(ColumnBox)`
  flex: 1;
  overflow-y: auto;
  margin-top: 4px;
`;
export const Content = styled(ColumnBox)`
  flex: 1;
  position: relative;
`;

export const TopArea = styled(FlexBox)`
  display: flex;
`;

export const TopAreaLeft = styled.div`
  flex: 1;
`;

export const TopAreaLeftTop = styled.div`
  width: 100%;
  height: 560px;
`;

export const TopAreaLeftBottom = styled.div`
  width: 100%;
  height: 320px;
  margin-top: 4px;
  display: flex;
`;

export const OrderBookBox = styled(Module)`
  flex: 1;
  height: 100%;
`;

export const RecentTradeBox = styled(Module)`
  flex: 1;
  height: 100%;
  margin-left: 4px;
`;

export const TopAreaRight = styled.div`
  width: 320px;
  margin-left: 4px;
`;

export const TradeFormBox = styled(Module)`
  width: 100%;
  height: 560px;
`;

export const AssetsBox = styled(Module)`
  width: 100%;
  height: 320px;
  margin-top: 4px;
`;

export const OrderListBox = styled.div`
  flex: 1;
  width: 100%;
  min-height: 320px;
  margin-top: 4px;
`;
/** 内容区域结束 */

export const FixedBar = styled.footer`
  margin-top: 4px;
`;
