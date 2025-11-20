/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { Popover } from '@kufox/mui';
import step_green_1 from 'assets/recall/step_green_1.svg';
import step_green_2 from 'assets/recall/step_green_2.svg';
import step_green_3 from 'assets/recall/step_green_3.svg';
import step_blue_1 from 'assets/recall/step_blue_1.svg';
import step_blue_2 from 'assets/recall/step_blue_2.svg';
import step_blue_3 from 'assets/recall/step_blue_3.svg';
import step_yellow_1 from 'assets/recall/step_yellow_1.svg';
import step_yellow_2 from 'assets/recall/step_yellow_2.svg';
import step_yellow_3 from 'assets/recall/step_yellow_3.svg';
import { _t } from 'utils/lang';
import { useSelector } from 'dva';

const Wrapper = styled.div`
  margin: ${px2rem(26)} ${px2rem(32)} 0;
  display: flex;
  justify-content: space-between;
`;

const ExtendTooltip = styled(Popover)`
  &[data-popper-placement='bottom-end'] {
    visibility: hidden;
  }
  & > div[data-placement='top-end'] {
    background-color: transparent;
    margin: ${px2rem(-12)};
    & > div:nth-of-type(1) {
      // ux要求写死
      background: rgba(40, 206, 156, 0.7);
      border: none;
      padding: ${px2rem(5)} ${px2rem(8)};
      border-radius: ${px2rem(6)};
      & > div:nth-of-type(1) {
        font-size: ${px2rem(12)};
        line-height: ${px2rem(16)};
        // ux要求写死
        color: rgba(0, 20, 42, 0.6);
      }
    }
    & > div:nth-of-type(2) {
      & > span:nth-of-type(1) {
        // ux要求写死
        background: rgba(40, 206, 156, 0.7);
      }
    }
  }
`;

const Lines = styled.div`
  flex: 1;
  height: ${px2rem(2)};
  margin: ${px2rem(20)} ${px2rem(5)} 0;
  background-color: ${({ theme }) => theme.colors.cover8};
  border-radius: ${px2rem(12)};
`;
const ChestItem = styled.div`
  position: relative;
`;

const Extend = styled.div`
  width: ${px2rem(52)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ChestDesc = styled.p`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  width: ${px2rem(110)};
  max-height: ${px2rem(32)};
  overflow: hidden;
  // ux要求写死
  color: rgba(0, 20, 42, 0.3);
  text-align: center;
  margin-top: ${px2rem(2)};
  margin-bottom: 0;
`;

const Triangle = styled.div`
  border-width: ${px2rem(10)};
  margin-top: ${px2rem(-6)};
  border-color: transparent transparent ${({ theme }) => theme.colors.base};
  border-style: solid;
`;

const ImgWrapper = styled.div`
  padding-top: ${px2rem(7)};
  padding-bottom: ${px2rem(7)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ChestImg = styled.img`
  height: ${px2rem(26)};
`;

const OnlyOnePlaceholder = styled.div`
  height: ${px2rem(14)};
`;

const RenderCard = ({ index, currentIndex, currentStatus }) => {
  return (
    <ChestImg
      src={
        [
          [step_green_1, step_green_2, step_green_3],
          [step_blue_1, step_blue_2, step_blue_3],
          [step_yellow_1, step_yellow_2, step_yellow_3],
        ][index % 3][index > currentIndex ? 0 : index < currentIndex || currentStatus === 1 ? 2 : 1]
      }
    />
  );
};

const ChestProgress = ({ handleClickIcon }) => {
  const { generalInfo, currentStageInfo } = useSelector(state => state.userRecall);
  const { totalStages = 0, curStageOrder = 1, status } = generalInfo || {};
  return totalStages < 2 ? (
    <OnlyOnePlaceholder />
  ) : (
    <Wrapper>
      {new Array(totalStages).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Lines />}
          <ChestItem>
            {index + 1 === totalStages &&
            (!currentStageInfo?.bonusAmount || curStageOrder !== index + 1) ? (
              <ExtendTooltip open={true} title={_t('piZgRxto3DZHJ1oeRrAuQ1')} placement="top-end">
                <ImgWrapper
                  onClick={curStageOrder <= index + 1 ? () => handleClickIcon(index + 1) : null}
                >
                  <RenderCard
                    index={index}
                    currentIndex={curStageOrder - 1}
                    currentStatus={status}
                  />
                </ImgWrapper>
              </ExtendTooltip>
            ) : (
              <ImgWrapper
                onClick={curStageOrder <= index + 1 ? () => handleClickIcon(index + 1) : null}
              >
                <RenderCard index={index} currentIndex={curStageOrder - 1} currentStatus={status} />
              </ImgWrapper>
            )}
            <Extend>
              <ChestDesc>{_t('iu33jDvDFxynF5ZVQ7KvfX', { step: index + 1 })}</ChestDesc>
              {curStageOrder === index + 1 && <Triangle />}
            </Extend>
          </ChestItem>
        </React.Fragment>
      ))}
    </Wrapper>
  );
};

export default ChestProgress;
