/**
 * Owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import { withYScreen } from '@/pages/OrderForm/config';

export const Container = withYScreen(styled.div`
  width: 100%;
  width: 100%;
  display: flex;
  border-radius: 80px;
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 4px;
  margin-top: 16px;
  background-color: ${props => props.theme.colors.cover4};
  ${props => props.$useCss(['md', 'sm'])(`
    margin-top: 8px;
    margin-bottom: 0px;
  `)}
`);

export const SideTab = styled.div`
  flex: 1;
  border-radius: 80px;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: ${(props) => {
    if (props.isActive) {
      return props.theme.colors.textEmphasis;
    }
    return props.theme.colors.text60;
  }};
  background-color: ${(props) => {
    if (props.isActive) {
      return props.theme.colors[props.color];
    }
    return 'transparent';
  }};
`;
