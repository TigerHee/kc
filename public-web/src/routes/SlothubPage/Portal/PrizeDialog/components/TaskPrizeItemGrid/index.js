/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-13 12:46:32
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:47:10
 */
import { useBoolean } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { useIsH5 } from 'src/hooks/useDeviceHelper';
import { TaskPrizeContent } from '../../styled';
import CarouselContainer from './CarouselContainer';
import { GridContainer } from './index.styled';
import { PrizeItem } from './PrizeItem';

const GROUP_SIZE_MAP = {
  h5: 6,
  web: 8,
};
// 动画播放一次 3 秒
const ITEM_ANIMATION_DURING = 3000;

const TaskPrizeGrid = ({ items }) => {
  const isH5 = useIsH5();
  const groupSize = isH5 ? GROUP_SIZE_MAP.h5 : GROUP_SIZE_MAP.web;
  const [isEvenItemPlayingAnimationFlag, { toggle: toggleAnimationControlFlag }] =
    useBoolean(false);

  // 往复动画2遍 切换3次奇偶播放标志
  useEffect(() => {
    const intervalId = setInterval(() => {
      toggleAnimationControlFlag();
    }, 3000);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, ITEM_ANIMATION_DURING * 3); // 3次 * 3000毫秒

    // 清理函数
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [toggleAnimationControlFlag]);

  const groups = useMemo(() => {
    return items?.reduce((acc, item, index) => {
      const groupIndex = Math.floor(index / groupSize);
      if (!acc[groupIndex]) {
        acc[groupIndex] = [];
      }
      acc[groupIndex].push(item);
      return acc;
    }, []);
  }, [groupSize, items]);

  return (
    <div>
      {isH5 ? (
        <TaskPrizeContent>
          {groups?.map((group, index) => (
            <GridContainer key={index} pageIndex={index}>
              {group?.map((point, idx) => {
                const isEvenElement = (idx + 1) % 2 === 0; // 如果索引是偶数，则为 true
                return (
                  <PrizeItem
                    isEvenItemPlayingAnimationFlag={isEvenItemPlayingAnimationFlag}
                    isEvenElement={isEvenElement}
                    key={idx}
                    value={point}
                  />
                );
              })}
            </GridContainer>
          ))}
        </TaskPrizeContent>
      ) : (
        <CarouselContainer
          groups={groups}
          isEvenItemPlayingAnimationFlag={isEvenItemPlayingAnimationFlag}
        />
      )}
    </div>
  );
};

export default TaskPrizeGrid;
