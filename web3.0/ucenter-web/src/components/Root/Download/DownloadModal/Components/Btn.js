/**
 * Owner: mcqueen@kupotech.com
 */
import { styled } from '@kux/mui';
import gift from 'static/root/download/modal/gift.svg';
import Countdown from './Countdown';

const Wrapper = styled.div`
  position: relative;
  width: 56px;
  height: 60px;
`;

const Gift = styled.img`
  width: 56px;
  height: 60px;
`;

export default ({ onClose, onOpenModal } = {}) => {
  return (
    <Wrapper onClick={onOpenModal}>
      <Gift src={gift} />
      <Countdown onClose={onClose} />
    </Wrapper>
  );
};
