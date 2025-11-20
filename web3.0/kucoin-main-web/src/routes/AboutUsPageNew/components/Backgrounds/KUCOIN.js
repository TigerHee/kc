/**
 * Owner: will.wang@kupotech.com
 */
import { isEqual } from 'lodash';
import { useSelector } from '@/hooks';
import { styled } from '@kux/mui';
import bgDarksrc from 'static/about-us/bg/KUCOIN_dark.svg';
import bgLightsrc from 'static/about-us/bg/KUCOIN_light.svg';

const BG = styled.img`
  width: 100%;
  max-width: 1680px;
  min-height: 431px;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  object-fit: contain;
  object-position: top;
  pointer-events: none;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    min-height: unset;
  }
`;

export default ({ isDark = false }) => {
  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight, isEqual);
  const src = isDark ? bgDarksrc : bgLightsrc;

  return <BG src={src} alt="kucoin background text" top={totalHeaderHeight}/>;
};
