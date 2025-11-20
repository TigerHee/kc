/**
 * Owner: will.wang@kupotech.com
 */
import {
  StoryContent,
  StoryParagraphOne,
  StoryParagraphThree,
  StoryParagraphTwo,
  StorySectionContainer,
  StorySlideNextButton,
  Storytitle,
} from './StorySection.styles';
import { isEqual } from 'lodash';
import icon_down_light from 'static/ventures/light/icon_down_light.svg';
import icon_down_dark from 'static/ventures/dark/icon_down_dark.svg';
import { useResponsive, useTheme } from '@kux/mui';
import { _t } from '@/tools/i18n';
import { useCallback } from 'react';
import { useSelector } from '@/hooks';

export default () => {
  const theme = useTheme();
  const iconSrc = theme.currentTheme === 'dark' ? icon_down_dark : icon_down_light;
  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight, isEqual);
  const rs = useResponsive();

  const isSm = !rs.sm;

  const handleScroll = useCallback(() => {
    const element = document.querySelector('#ventures_portfolio_banner');
    if (element) {
      const elementRect = element.getBoundingClientRect();
      
      // 计算需要滚动的距离
      // 目标位置 = 当前文档滚动位置 + 元素当前相对视口的位置
      const scrollPosition = window.scrollY + elementRect.top - (totalHeaderHeight);
      
      // 执行滚动
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [totalHeaderHeight])

  return (
    <StorySectionContainer data-inspector="ventures_story">
      <StoryContent>
        <Storytitle>{_t('b84161bcdd5e4000a70b')}</Storytitle>
        <StoryParagraphOne>{_t('a23f71374c5e4000a362')}</StoryParagraphOne>
        <StoryParagraphTwo>
          {_t('f273ff4318a74000ac49')}
        </StoryParagraphTwo>
        <StoryParagraphThree>
          {_t('3ccc4f64a7ab4000a0e2')}
        </StoryParagraphThree>

        <StorySlideNextButton variant="text" onClick={handleScroll}>
          <img src={iconSrc} alt="slide icon" />
        </StorySlideNextButton>
      </StoryContent>
    </StorySectionContainer>
  );
};
