/**
 * Owner: john.zhang@kupotech.com
 */

import { NumberFormat, styled } from '@kux/mui';

export const AmountComponent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  overflow-wrap: anywhere;
`;

const AmountText = ({ value }) => {
  return (
    <AmountComponent>
      <NumberFormat>{value}</NumberFormat>
    </AmountComponent>
  );
};

export default AmountText;
