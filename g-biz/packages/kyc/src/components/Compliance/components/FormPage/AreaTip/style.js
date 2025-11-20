/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const AreaTipTitle = styled.h3`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin-bottom: 0;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.text};
  &.isSmStyle {
    font-size: 16px;
  }
`;
export const AreaTipDesc = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${(props) => props.theme.colors.text40};
`;
