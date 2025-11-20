/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import SvgComponent from '@/components/SvgComponent';
import ScrollWrapper from '@/components/ScrollWrapper';

export const HeaderBarWrapper = styled.div`
  height: 32px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
`;

export const Operator = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin-right: 0 !important;
  }
`;

export const MarketInfo = styled(ScrollWrapper)`
  flex: 1;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.text};
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 12px;
`;

export const SymbolWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
    border-radius: 16px;
    margin-right: 8px;
  }
`;

export const Change = styled.div`
  font-weight: 400;
  margin-left: 8px;
`;

export const Icon = styled(SvgComponent)`
  margin-left: 12px;
  color: ${(props) => props.theme.colors.icon};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;
