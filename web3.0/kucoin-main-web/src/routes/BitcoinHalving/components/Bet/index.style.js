/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const BtnCont = styled.div`
  width: 310px;
  display: flex;
  opacity: ${({ spinning }) => (spinning ? '0' : '1')};
  gap: 58px;
  ${({ voted }) => (voted ? ` pointer-events: none;` : '')}
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  align-self: flex-end;
  .KuxSpin-root {
    .KuxSpin-container::after {
      background: transparent !important;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    display: inline-block;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
  }
`;
