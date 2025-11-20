/**
 * Owner: victor.ren@kupotech.com
 */
import deepmerge from 'utils/deepmerge';
import createPalette from './createPalette';
import createTransitions from './createTransitions';
import createBreakpoints from './createBreakpoints';
import createZIndices from './createZIndices';
import creatShadows from './creatShadows';
import fonts from './fonts';
import createSpacing from './createSpacing';
import createRadius from './createRadius';
import createAnimate from './createAnimate';

const createTheme = (options = {}, ...args) => {
  const {
    palette: paletteInput = {},
    transitions: transitionsInput = {},
    breakpoints: breakpointsInput = {},
    ...others
  } = options;
  const palette = createPalette(paletteInput);
  const transitions = createTransitions(transitionsInput);
  const space = createSpacing();
  const radius = createRadius();
  const animate = createAnimate();
  let kuFoxTheme = deepmerge(
    {
      colors: palette,
      transitions,
      breakpoints: createBreakpoints(breakpointsInput),
      zIndices: createZIndices(),
      shadows: creatShadows(),
      radius,
      space,
      fonts,
      animate,
    },
    others,
  );
  kuFoxTheme = args.reduce((acc, argument) => deepmerge(acc, argument), kuFoxTheme);
  return kuFoxTheme;
};

export default createTheme;
