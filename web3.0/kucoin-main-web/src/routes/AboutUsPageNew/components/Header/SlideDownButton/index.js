/**
 * Owner: will.wang@kupotech.com
 */
import { useSelector } from '@/hooks';
import { isEqual } from 'lodash';
import { styled } from '@kux/mui';
import SvgIcon from 'components/common/KCSvgIcon';
import { useCallback } from 'react';

const ButtonDown = styled.button`
  margin: 100px auto 0;
  color: transparent;
  cursor: pointer;
  background-color: transparent;
  /* color: ${(props) => props.theme.colors.text60}; */
  border: none;

  width: 48px;
  height: 28px;

  &  > svg {
    width: 48px;
    height: 28px;
  }

  & > svg > path {
    fill: ${(props) => props.theme.colors.text40};
  }

  &:hover {
    background-color: transparent;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 72px auto 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 44px auto 0;
    width: 38px;
    height: 20px;

    & > svg {
      width: 38px;
      height: 20px;
    }
  }
`;
export default ({ isDark }) => {
  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight, isEqual);
  const iconId = isDark ? "button_down_dark" : "button_down_light";

  const handleScroll = useCallback(() => {
    const element = document.querySelector('#aboutus_story_banner');
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
    <ButtonDown onClick={handleScroll}>
      <SvgIcon iconId={iconId}/>
    </ButtonDown>
  );
};
