/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Spin } from '@kufox/mui';
import { styled } from '@kufox/mui/emotion';
import { THEME_COLOR } from '../config';
import { fade } from '@kufox/mui/utils';

const WrappedSpin = styled(Spin)`
  & > div{
    border-color: ${THEME_COLOR.primary} ${THEME_COLOR.primary} ${THEME_COLOR.primary} ${fade(THEME_COLOR.primary, 0.4)} !important; 
  }
`

export default (props)=> <WrappedSpin {...props}/>