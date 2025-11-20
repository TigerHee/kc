/**
 * Owner: jessie@kupotech.com
 */
import styled from '@emotion/styled';

export const AlertBoxTip = styled.div`
  .KuxAlert-root {
    border-radius: 0;
    font-weight: 400;
    .KuxAlert-title {
      color: ${(props) => props.theme.colors.text};
    }
  }
`;
