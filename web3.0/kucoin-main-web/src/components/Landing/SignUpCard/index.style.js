/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.section`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
  button {
    margin-top: 16px;
  }
`;

export const TopInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Image = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 12px;
`;

export const Information = styled.p`
  color: rgba(0, 13, 29, 0.68);
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin: 0px;
  & > span > span {
    color: #01bc8d;
    font-weight: 600;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 12px;
  }
`;

export const Description = styled.h2`
  color: #000d1d;
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin-top: 14px;
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-weight: 500;
  }
`;
