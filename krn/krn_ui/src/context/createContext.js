/**
 * Owner: willen@kupotech.com
 */
import React from "react";

export default (name = null) => {
  const context = React.createContext({});
  context.displayName = `${name}`;
  return context;
};
