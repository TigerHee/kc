/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';

export const HideWrapper = styled.span`
  ${(props) => {
    if (props.hide) {
      return `
        opacity: 0;
        pointer-events: none;
      `;
    }
    return '';
  }}
`;
