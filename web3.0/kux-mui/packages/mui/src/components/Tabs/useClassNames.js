/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getTabsClassName(slot) {
  return generateClassName('KuxTabs', slot);
}

export default function useClassNames(state) {
  const { variant, scrollableX, scrollableY } = state;

  const slots = {
    container: ['container', variant && `${variant}Container`],
    scrollButtonLeft: ['scrollButton', 'scrollButtonLeft'],
    scrollButtonRight: ['scrollButton', 'scrollButtonRight'],
    scroller: ['scroller', scrollableX && 'scrollableX', scrollableY && 'scrollableY'],
    Container: ['Container'],
    indicator: ['indicator'],
  };
  return composeClassNames(slots, getTabsClassName);
}


export function useScrollButtonClassNames(state) {
  const { direction } = state;
  const slots = {
    scrollButtonBg: ['scrollButtonBg', direction && `${direction}ScrollButtonBg`],
  };
  return composeClassNames(slots, getTabsClassName);
}
