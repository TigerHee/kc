/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import setRef from 'utils/setRef';
import useForkRef from 'hooks/useForkRef';
import useEnhancedEffect from 'hooks/useEnhancedEffect';

function getContainer(container) {
  return typeof container === 'function' ? container() : container;
}

const Portal = React.forwardRef(function Portal(props, ref) {
  const { children, container, disablePortal = false } = props;
  const [mountNode, setMountNode] = React.useState(null);
  const handleRef = useForkRef(React.isValidElement(children) ? children.ref : null, ref);

  useEnhancedEffect(() => {
    if (!disablePortal) {
      setMountNode(getContainer(container) || document.body);
    }
  }, [container, disablePortal]);

  useEnhancedEffect(() => {
    if (mountNode && !disablePortal) {
      setRef(ref, mountNode);
      return () => {
        setRef(ref, null);
      };
    }

    return undefined;
  }, [ref, mountNode, disablePortal]);

  if (disablePortal) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: handleRef,
      });
    }
    return children;
  }

  return mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode;
});

export default Portal;
