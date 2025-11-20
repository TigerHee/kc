/**
 * Owner: mike@kupotech.com
 */

import styled from '@emotion/styled';
import { Div } from 'Bot/components/Widgets';
import { EditRow } from 'Bot/components/Common/Row';

export const MEditRow = styled(EditRow)`
  .editRow-label {
    ${({ hasDashLine, theme }) => {
      if (hasDashLine) {
        return {
          color: theme.colors.text60,
          textDecoration: `underline dashed ${theme.colors.text40}`,
          textUnderlineOffset: '2px',
          cursor: 'pointer',
        };
      }
    }}
  }
`;
export const InputDiv = styled(Div)`
  &:last-of-type {
    margin-bottom: 0;
  }
`;
