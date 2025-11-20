/**
 * Owner: ella@kupotech.com
 */
import { useCallback, useEffect, useState } from 'react';
import { ThumbsUpAni } from './animation';
import BetContent from './BetContent';
import { Wrapper } from './index.style';

let timer;
const NewBet = () => {
  const [actived, setActived] = useState(true);

  useEffect(() => {
    if (!actived && timer) clearInterval(timer);
    if (actived) {
      const thumbsUpAni = new ThumbsUpAni();
      thumbsUpAni.context.fillStyle = 'rgba(255, 255, 255, 0)';

      timer = setInterval(() => {
        thumbsUpAni.start();
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [actived]);

  const closeAminate = useCallback(() => {
    setActived(false);
  }, []);

  return (
    <Wrapper>
      <BetContent closeAminate={closeAminate} />
    </Wrapper>
  );
};
export default NewBet;
