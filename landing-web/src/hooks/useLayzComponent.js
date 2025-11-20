/**
 * Owner: terry@kupotech.com
 */
import { useEffect } from 'react';
import useState from 'src/hooks/useSafeState';

const useLayzComponent = ({ show, loadableFunc } = {}) => {
  const [Component, updateComponent] = useState(null);

  useEffect(() => {
    if (!show || typeof loadableFunc !== 'function') return;
    if (Component) return;
    updateComponent(loadableFunc());
  }, [show, loadableFunc, Component]);

  return Component;
};

export default useLayzComponent;
