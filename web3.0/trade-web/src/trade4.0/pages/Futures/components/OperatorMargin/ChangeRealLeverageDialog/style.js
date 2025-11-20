/**
 * Owner: garuda@kupotech.com
 * 公共样式
 */
import TooltipWrapper from '@/components/TooltipWrapper';
import { styled } from '@/style/emotion';

export const CurrentBox = styled.div`
  margin: 4px 0;
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  .value {
    margin-left: 4px;
    font-weight: 500;
    color: ${(props) => (props.value ? props.theme.colors.text : props.theme.colors.text40)};
  }
  .lean-more {
    cursor: help;
    text-decoration: underline dashed ${(props) => props.theme.colors.text20};
    color: ${(props) =>
      (props.isFocus ? props.theme.colors.complementary : props.theme.colors.text40)};
  }
`;

export const TooltipClx = styled(TooltipWrapper)`
  text-decoration: underline dashed ${(props) => props.theme.colors.text20};
`;
