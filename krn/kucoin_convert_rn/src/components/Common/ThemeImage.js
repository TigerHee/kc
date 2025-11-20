/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo} from 'react';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';

const Wrapper = styled.Image``;

/**
 * ThemeImage
 */
const ThemeImage = memo(props => {
  const {lightSrc, darkSrc, ...restProps} = props;
  const theme = useTheme();

  const source = theme.type === 'dark' ? darkSrc : lightSrc;

  return <Wrapper {...restProps} source={source} />;
});

export default ThemeImage;
