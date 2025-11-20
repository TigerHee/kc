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
  height: 560px;
  min-height: 480px;
  width: 100%;
`;

export const OrderListBox = styled.div`
  flex: 1;
  width: 100%;
  min-height: 320px;
  margin-top: 4px;
`;

/** 内容区域结束 */

export const ButtonGroup = styled.footer`
  padding: 12px 16px;
  background: ${props => props.theme.colors.layer};
  box-shadow: inset 0px 0.5px 0px rgba(188, 200, 224, 0.12);
`;

export const FixedBar = styled.footer`
  margin-top: 4px;
`;
