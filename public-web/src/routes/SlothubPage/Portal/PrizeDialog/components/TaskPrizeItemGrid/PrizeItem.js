/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 16:32:35
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-23 18:10:27
 */
import { memo, useMemo } from 'react';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import prizeSignBubble from 'static/slothub/prize-sign-bubble.svg';
import { SignPrizeImg, TaskPrizeItem } from '../../styled';
import { PrizeLightAnimation } from './index.styled';

export const PrizeItem = memo(({ value, isEvenItemPlayingAnimationFlag, isEvenElement }) => {
  // 判断是否展示动画，奇数下标播放完毕后 切换成 偶数下标展示动画
  const showAnimation = useMemo(() => {
    const isOdd = !isEvenElement;
    if (isOdd && !isEvenItemPlayingAnimationFlag) {
      return true;
    }
    if (isEvenElement && isEvenItemPlayingAnimationFlag) {
      return true;
    }
    return false;
  }, [isEvenElement, isEvenItemPlayingAnimationFlag]);

  return (
    <TaskPrizeItem>
      <SignPrizeImg src={prizeSignBubble} />
      <p className="quantity">{value && <NumberFormat>{value}</NumberFormat>}</p>
      {showAnimation && (
        <PrizeLightAnimation iconName="slothub_prize_popup_bubble_bg_light" speed={1} loop={0} />
      )}
    </TaskPrizeItem>
  );
});
