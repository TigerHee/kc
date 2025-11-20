/**
 * Owner: terry@kupotech.com
 */
import { styled } from '@kux/mui/emotion';
import { isIOS } from 'src/helper';
import { _t } from 'utils/lang';

const Wrapper = styled.p`
  padding: 12px 0 50px;
  margin: 0;
  text-align: center;
  color: rgba(243, 243, 243, 0.40);
  background: #000;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  &.coinsPromotion {
    padding: 0 0 50px;
    background: #fff;
    color: rgba(29, 29, 29, 0.48);
  }
  &.quiz {
    position: relative;
    background-color: rgb(25, 27, 29);
    padding: 0 0 50px;
    color: rgba(225, 232, 245, 0.68);
  }
  &.newcomer {
    background-color: #e7f5f2;
    color: rgba(0, 13, 29, 0.68);
    padding: 0 0 50px;
  }
`;

export function AppleDisclaim(props) {
  if (!isIOS()) return null;
  return (
    <Wrapper {...props}>
      {_t('8fe6fe99cef24000a0dd')}
    </Wrapper>
  )
}