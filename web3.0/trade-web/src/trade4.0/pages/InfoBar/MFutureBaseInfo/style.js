/**
 * Owner: Clyne@kupotech.com
 */
import { styled } from '@/style/emotion';
import { FuturesDetailWrapper } from '../FuturesDetail/style';

export const Wrapper = styled(FuturesDetailWrapper)`
  display: flex;
  .m-column {
    padding-top: 12px;
    display: flex;
    margin-left: 12px;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    min-width: calc(50% - 12px);
    .text-tips {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      white-space: initial;
      margin-left: 0;
      .text-header {
        transform: scale(0.83);
        transform-origin: left;
      }
    }
    .pretty-currency {
      margin-top: -2px;
    }
  }
`;
