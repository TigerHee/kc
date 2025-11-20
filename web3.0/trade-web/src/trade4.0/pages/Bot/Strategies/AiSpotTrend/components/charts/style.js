/**
 * Owner: mike@kupotech.com
 */
import { Flex } from 'Bot/components/Widgets';
import { styled } from '@kux/mui';
import { toolTipWidth } from './config';
import Collapse from '@kux/mui/Collapse';

export const Box = styled.div`
  margin-top: 12px;
  position: relative;
`;
export const MCollapse = styled(Collapse)`
  /* margin-left: -12px;
  margin-right: -12px; */
`;
export const Tooltip = styled.div`
  position: absolute;
  z-index: 99;
  top: 20px;
  left: 40px;
  padding: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  width: ${toolTipWidth}px;
  line-height: 12px;
  display: none;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05)) drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.1));
  .flex-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    &:last-of-type {
      margin-bottom: 0;
    }
    > span:first-of-type {
      color: ${({ theme }) => theme.colors.text40};
      margin-right: 8px;
    }
    > span {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const Cover = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.cover2};
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 16px;
`;
