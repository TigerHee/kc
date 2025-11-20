/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.section`
  width: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
`;

export const Title = styled.h2`
  color: #000d1d;
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  margin: 0px;
  text-align: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 16px;
  }
`;

export const Description = styled.h3`
  color: rgba(29, 29, 29, 0.4);
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-top: 12px;
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const IconWrapper = styled.div`
  width: ${(props) => props.size}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

export const Icon = styled.img`
  width: 24px;
  height: 24px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;
