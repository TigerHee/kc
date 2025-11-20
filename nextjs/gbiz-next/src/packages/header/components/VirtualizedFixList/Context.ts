/**
 * Owner: roger@kupotech.com
 */
import React from 'react';

interface ScrollTopContextType {
  scrollTop?: number;
  top?: number;
  bottom?: number;
  toggleReflow?: any;
}

const ScrollTopContext = React.createContext<ScrollTopContextType>({});

export default ScrollTopContext;
