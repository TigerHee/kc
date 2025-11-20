/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { NUMBER_DISPLAY } from '../config';

// --- 样式start ---
export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  .space {
    margin: 0 ${px2rem(2)};
  }
`;
export const List = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-y: auto;
  padding: 0 ${px2rem(16)};
  @media (min-width: 1040px) {
    ::-webkit-scrollbar {
      background: transparent;
      width: 6px;
      height: 2px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: rgba(0, 20, 42, 0.2);
    }
  }
`;
export const Item = styled.div`
  padding: ${px2rem(24)} 0;
  border-bottom: ${px2rem(1)} solid rgba(0, 20, 42, 0.08);
`;
export const Font = styled.span`
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  color: rgba(0, 20, 42, 0.3);
`;
export const Text = styled(Font)`
  display: flex;
  align-items: center;

`;
export const Number = styled(Text)`
  color: ${props => NUMBER_DISPLAY[props.type]?.color};
`;
export const Amount = styled(Font)`
  display: block;
  color: ${props => NUMBER_DISPLAY[props.type]?.amountColor};
`;
export const Flag = styled.div`
  padding: 0 ${px2rem(4)};
  border-radius: ${px2rem(2)};
  background: ${props => NUMBER_DISPLAY[props.type]?.color};
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  color: #fff;
  margin-left: ${px2rem(8)};
`;

export const NoDataWrapper = styled.div`
  text-align: center;
  margin-top: ${px2rem(10)};
  img {
    width: ${px2rem(100)};
  }
`;
export const Placeholder = styled.div`
  width: ${px2rem(24)};
`;
export const LoadingBlock = styled.div`
  height: ${px2rem(100)};
`;
// --- 样式end ---
