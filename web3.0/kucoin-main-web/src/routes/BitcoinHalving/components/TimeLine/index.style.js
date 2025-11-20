/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  margin-top: 64px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 24px;
  }
`;

export const Button = styled.a`
  color: #1d1d1d;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 130%;
  border-radius: 24px;
  background: #01bc8d;
  padding: 9px 16px;
  margin-top: 52px;
  img {
    margin-left: 4px;
  }
  [dir='rtl'] & {
    img {
      transform: rotateZ(180deg);
    }
  }
  &:hover {
    color: #1d1d1d;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 20px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0px;
  }
`;
