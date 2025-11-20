/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 11:17:58
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-23 18:09:49
 */
import { ICArrowLeftOutlined, ICArrowRightOutlined } from '@kux/icons';
import {
  CarouselGridContainer,
  CarouselWrap,
  PageArrowWrap,
  Wrap,
} from './CarouselContainer.styled';
import { PrizeItem } from './PrizeItem';
import usePageHelper from './usePageHelper';

const CarouselContainer = ({ groups, isEvenItemPlayingAnimationFlag }) => {
  const { handleNextPage, handleLastPage, isLeftEnd, isRightEnd, carouselWrapRef } =
    usePageHelper(groups);

  return (
    <Wrap>
      {!isLeftEnd && (
        <PageArrowWrap disabled={isLeftEnd}>
          <ICArrowLeftOutlined className="icon" onClick={handleLastPage} />
        </PageArrowWrap>
      )}
      <CarouselWrap ref={carouselWrapRef}>
        {groups.map((group, index) => (
          <CarouselGridContainer key={index}>
            {group.map((point, idx) => {
              const isEvenElement = (idx + 1) % 2 === 0; // 如果索引是偶数，则为 true
              return (
                <PrizeItem
                  key={idx}
                  value={point}
                  isEvenItemPlayingAnimationFlag={isEvenItemPlayingAnimationFlag}
                  isEvenElement={isEvenElement}
                />
              );
            })}
          </CarouselGridContainer>
        ))}
      </CarouselWrap>
      {!isRightEnd && (
        <PageArrowWrap disabled={isRightEnd}>
          <ICArrowRightOutlined className="icon" onClick={handleNextPage} />
        </PageArrowWrap>
      )}
    </Wrap>
  );
};

export default CarouselContainer;
