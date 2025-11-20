/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgba(29, 29, 29, 0.3);
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-left: -6px;
`;

export const SelectItem = styled.div`
  cursor: pointer;
  padding: 0px 6px;
  color: ${({ selected, lg }) =>
    selected ? (lg ? '#000D1D' : '#01BC8D') : 'rgba(29, 29, 29, 0.30)'};
  font-weight: ${({ selected }) => (selected ? '500' : '400')};
`;
