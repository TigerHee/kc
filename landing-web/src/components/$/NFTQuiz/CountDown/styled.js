/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';

export const View = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: rgba(29, 33, 36, 0.4);
  backdrop-filter: blur(40px);
  margin-top: ${_r(40)};
  padding: ${_r(20)} ${_r(12)};
  border-radius: ${_r(12)};
`;


export const PoolTitle = styled.p`
  font-weight: 400;
  font-size: 14px;
  color: #fff;
  margin-bottom: ${_r(12)};
  margin-bottom: 0;
`;

export const AmountField = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: ${_r(20)};
  line-height: 130%;
  text-align: left;
  word-break: break-word;
    background: linear-gradient(272.68deg, #80DC11 10.78%, #FFF850 99.23%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-top: ${_r(6)};
  margin-bottom: 0;
`;

export const PoolAmount = styled.section`
  display: flex;
  flex-direction: column;
`;