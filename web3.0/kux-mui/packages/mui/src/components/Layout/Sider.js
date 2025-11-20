/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import { isNumber } from 'lodash-es';
import { LayoutContext } from './layout';

const generateId = (() => {
  let i = 0;
  return (prefix) => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

const SiderRoot = styled.aside`
  flex: 0 0 ${(props) => props.width};
  min-width: ${(props) => props.width};
  max-width: ${(props) => props.width};
  width: ${(props) => props.width};
`;

const SiderContent = styled.div`
  height: 100%;
  margin-top: -0.1px;
  padding-top: 0.1px;
`;

const Sider = React.forwardRef(({ children, width = 200, ...others }, ref) => {
  const { siderHook } = React.useContext(LayoutContext);
  const sideWidth = isNumber(width) ? `${width}px` : String(width);
  React.useEffect(() => {
    const uniqueId = generateId('kufox-sider-');
    siderHook.addSider(uniqueId);
    return () => siderHook.removeSider(uniqueId);
  }, []);
  return (
    <SiderRoot width={sideWidth} ref={ref} {...others}>
      <SiderContent>{children}</SiderContent>
    </SiderRoot>
  );
});

export default Sider;
