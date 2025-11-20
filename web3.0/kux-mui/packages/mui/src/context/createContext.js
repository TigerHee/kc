/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export default (name = null) => {
  const context = React.createContext();
  context.displayName = `${name}`;
  return context;
};
