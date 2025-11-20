/**
 * Owner: solar@kupotech.com
 */
import { styled, Button } from '@kux/mui';

export const StyledFiatShow = styled.div`
    ${(props) => props.theme.fonts.size.xl}
    color: ${(props) => props.theme.colors.text40};
    margin-top: 6px;
`;

export const StyledMax = styled(Button)`
  font-weight: 500;
`;
