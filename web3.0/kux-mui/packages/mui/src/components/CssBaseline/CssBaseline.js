/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Global } from 'emotion/index';
import useTheme from 'hooks/useTheme';
import PickerBaseCss from './PickerBaseCss';
import MPickerBaseCss from './MPickerBaseCss';
import SliderBaseCss from './SliderBaseCss';

export const html = (theme) => ({
  WebkitFontSmoothing: 'antialiased', // Antialiasing.
  MozOsxFontSmoothing: 'grayscale', // Antialiasing.
  boxSizing: 'border-box',
  WebkitTextSizeAdjust: '100%',
  fontFamily: theme.fonts.family,
});

export const body = (theme) => ({
  fontFamily: theme.fonts.family,
});

export const styles = (theme) => {
  const defaultStyles = {
    html: html(theme),
    '*, *::before, *::after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      ...body(theme),
    },
    fieldset: {
      marginInlineStart: '2px',
      marginInlineEnd: '2px',
      paddingBlockStart: '0.35em',
      paddingInlineStart: '0.75em',
      paddingInlineEnd: '0.75em',
      paddingBlockEnd: '0.625em',
    },
    legend: {
      paddingInlineStart: '2px',
      paddingInlineEnd: '2px',
    },
  };

  return defaultStyles;
};

function CssBaseline(props) {
  const { children } = props;
  const theme = useTheme();
  const GlobalStyles = styles(theme);
  return (
    <>
      <Global styles={GlobalStyles} />
      <SliderBaseCss />
      <PickerBaseCss />
      <MPickerBaseCss />
      {children}
    </>
  );
}

CssBaseline.propTypes = {
  children: PropTypes.node,
};

export default CssBaseline;
