/**
 * Owner: will.wang@kupotech.com
 */
import { styled } from '@kux/mui';

const bgGlassSrc = require('static/about-us/bg/glass_light.png');
const bgGlassDarkSrc = require('static/about-us/bg/glass_dark.png');

export const AboutusContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: ${props => props.isDark ? 'rgb(8, 8, 8)' : '#fff'};
  overflow-x: hidden;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
  }
`;

export const ContentWrapper = styled.div`
  background-image: url(${props => props.theme.currentTheme === 'dark' ? bgGlassDarkSrc : bgGlassSrc});
  background-repeat: repeat;
  background-size: 200px auto;

  position: relative;
  min-height: 100vh;
`;
