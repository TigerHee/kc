/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Image = styled.img`
  width: 100%;
  margin: 12px 0px 36px 0px;
`;

export const Table = styled.table`
  text-align: center;
  margin-top: 24px;
`;

export const Th = styled.th`
  color: #1d1d1d;
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  text-align: left;
  padding: 12px 20px;
`;

export const ThCenter = styled.th`
  color: #01bc8d;
  font-size: 16px;
  padding: 12px 20px;
  font-weight: 600;
  line-height: 130%;
  background: rgba(1, 188, 141, 0.04);
  padding-top: 16px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  text-align: left;
`;

export const Tr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid rgba(29, 29, 29, 0.08);
  }
`;

export const Td = styled.td`
  padding: 12px 20px;
  color: rgba(29, 29, 29, 0.6);
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
`;

export const TdBottom = styled(Td)`
  padding: 12px 20px 46px 20px;
`;

export const TdCenter = styled.td`
  padding: 12px 20px;
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  background: rgba(1, 188, 141, 0.04);
`;

export const TdCenterBottom = styled(TdCenter)`
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  padding: 12px 20px 46px 20px;
`;
