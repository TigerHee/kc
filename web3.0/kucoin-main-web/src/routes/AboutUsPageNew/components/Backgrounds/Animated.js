/**
 * Owner: will.wang@kupotech.com
 */
import LottieProvider from '@/components/LottieProvider';
import { useResponsive, useTheme } from '@kux/mui';
import { styled, keyframes } from '@kux/mui';
import darkAnimation from 'static/about-us/bg/dark_animation.json';
import lightAnimation from 'static/about-us/bg/light_animation.json';

const fadeInAnimationDark = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeInAnimationLight = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
`;

const LottieMask = styled.div`
  width: 1680px;
  height: 800px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -840px;
  margin-top: -400px;
  opacity: 0;

  &, & > * {
    pointer-events: none;
  }
  
  filter: blur(${props => props.blurSize}px);

  animation: ${props => props.theme.currentTheme === 'dark' ? fadeInAnimationDark : fadeInAnimationLight} 0.3s ease-in 0.1s forwards;

  ${(props) => props.theme.breakpoints.down('lg')} {
    top: 80px;
    margin-top: unset;
    height: calc(100vh - 180px);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 200%;
    height: calc(100vh - 180px);
    top: 90px;
    left: -50%;
    margin-left: 0;
    margin-top: unset;
  }
`;

const LottieContainer = styled(LottieProvider)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default ({ className }) => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  const rv = useResponsive();
  const isSm = rv.xs && !rv.sm && !rv.lg;

  const json = isDark ? darkAnimation : lightAnimation;

  return (
    <LottieMask blurSize={isSm ? 40 : 80} className={className}>
      <LottieContainer
        lottieJson={json}
        loop
        renderer="canvas"
        options={{ rendererSettings: { preserveAspectRatio: 'none' } }}
      />
    </LottieMask>
  );
};
