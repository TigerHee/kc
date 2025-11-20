/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-06 16:46:05
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 16:27:45
 */
import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import loadable from '@loadable/component';
import { memo } from 'react';

import LottieProvider from 'src/components/LottieProvider';
import { useIsH5 } from 'src/hooks/useDeviceHelper';
import useLockBodyScroll from 'src/hooks/useLockBodyScroll';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import { FLOWER_ANIMATION_STATIC_ICON_MAP, GAIN_PRIZE_TYPE } from './constant';
import {
  BlurMask,
  ButtonArea,
  Container,
  fadeOutAnimation,
  MaskContentWrapper,
  StyledButton,
} from './styled';
import { usePrizeDialogVisibleAndClick } from './usePrizeDialogVisibleAndClick';
const SharedRewardContent = loadable(() => import('./SharedRewardContent'));
const TaskPrizeContent = loadable(() => import('./TaskPrizeContent'));

const TopFlowerAnimation = styled(LottieProvider)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;

  ${(props) => props.theme.breakpoints.up('sm')} {
    max-width: 720px;
  }
`;

/**
 * 奖励弹窗
 * @param {*} displayPrize
 * @returns
 */
const PrizeDialog = () => {
  const isH5 = useIsH5();
  const {
    visible,
    data: prizeData,
    prizeType,
  } = useSelector((state) => state.slothub.prizeDialogConfig);

  const { onShare, onReceive, isCloseAnimating } = usePrizeDialogVisibleAndClick({
    prizeType,
    prizes: prizeData,
  });
  useLockBodyScroll(visible);

  if (!visible || !prizeType) return null;

  return (
    <BlurMask className={cx(isCloseAnimating && fadeOutAnimation)}>
      <TopFlowerAnimation
        iconName={isH5 ? FLOWER_ANIMATION_STATIC_ICON_MAP.H5 : FLOWER_ANIMATION_STATIC_ICON_MAP.Web}
        speed={1}
        loop={0}
      />
      <MaskContentWrapper
        onClose={() => {}}
        maskContentStyle={{
          gap: 0,
          width: '100%',
        }}
        className={cx(isCloseAnimating && fadeOutAnimation)}
      >
        <Container>
          {prizeType === GAIN_PRIZE_TYPE.TASK_REWARD && <TaskPrizeContent prizeData={prizeData} />}
          {prizeType === GAIN_PRIZE_TYPE.SHARED_REWARD && (
            <SharedRewardContent prizes={prizeData} />
          )}

          <ButtonArea>
            <StyledButton variant="outlined" onClick={onShare}>
              {_t('5d420a2591a54000ae9f')}
            </StyledButton>
            <StyledButton variant="contained" onClick={onReceive}>
              {_t('cfd8109587bf4000aa5b')}
            </StyledButton>
          </ButtonArea>
        </Container>
      </MaskContentWrapper>
    </BlurMask>
  );
};

export default memo(PrizeDialog);
