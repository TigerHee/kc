/**
 * Owner: mike@kupotech.com
 */
import styled from '@emotion/styled';
import {
  ICCloseOutlined,
  ICHookOutlined,
  ICInfoOutlined,
  ICQuestionOutlined,
  ICSuccessFilled,
  ICTriangleBottomOutlined,
  ICTriangleTopOutlined,
  ICArrowRightOutlined,
  ICArrowLeftOutlined,
  ICInfoFilled,
  ICCopyOutlined,
  ICInfoContainOutlined,
  ICEdit2Outlined,
  ICDeleteOutlined,
  ICPlusOutlined,
  ICSearchOutlined,
  ICAddFilled,
  ICEditOutlined,
} from '@kux/icons';
import SvgComponent from '@/components/SvgComponent';

const mFunc = (comp, RTL) => styled(comp)`
  fill: ${({ color, theme }) => (color ? theme.colors[color] : 'currentColor')};
  flex-shrink: 0;
  ${() => {
    if (RTL === 'RTL') {
      return `[dir='rtl'] & {transform: rotate(180deg);}`;
    }
    if (RTL === 'RTL2') {
      return `[dir='rtl'] & {transform: scaleX(-1);}`;
    }
  }}
  ${({ cursor }) => {
    if (cursor) {
      return 'cursor: pointer';
    }
  }}
`;
export const SvgIcon = styled(SvgComponent)`
  fill: ${({ color, theme }) => (color ? theme.colors[color] : 'currentColor')};
  flex-shrink: 0;
  cursor: pointer;
`;

export const MIcons = {
  TriangleDown: mFunc(ICTriangleBottomOutlined),
  TriangleUp: mFunc(ICTriangleTopOutlined),
  Info: mFunc(ICInfoFilled),
  InfoLine: mFunc(ICInfoOutlined),
  InfoContained: mFunc(ICInfoContainOutlined),
  Question: mFunc(ICQuestionOutlined),
  Close: mFunc(ICCloseOutlined),
  Guide: mFunc(ICCloseOutlined),
  ArrowRight: mFunc(ICArrowRightOutlined, 'RTL'),
  ArrowLeft: mFunc(ICArrowLeftOutlined, 'RTL'),
  Copy: mFunc(ICCopyOutlined),
  Edit: mFunc(ICEdit2Outlined, 'RTL2'),
  Delete: mFunc(ICDeleteOutlined),
  Hook: mFunc(ICHookOutlined),
  Add: mFunc(ICPlusOutlined),
  Search: mFunc(ICSearchOutlined),
  AddFilled: mFunc(ICAddFilled),
  EditOutlined: mFunc(ICEditOutlined),
};
