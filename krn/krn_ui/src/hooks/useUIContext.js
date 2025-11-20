/**
 * Owner: willen@kupotech.com
 */
import { useContext } from "react";
import { CurrentThemeContext } from "context";

const useUIContext = () => {
  return useContext(CurrentThemeContext) || {};
};

export default useUIContext;
