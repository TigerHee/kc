/**
 * Owner: willen@kupotech.com
 */
import { debounce, ownerWindow } from '@kufox/mui';
import PropTypes from 'prop-types';
import * as React from 'react';

const styles = {
  width: 99,
  height: 99,
  position: 'absolute',
  top: -9999,
  overflow: 'scroll',
};

export default function ScrollbarSize(props) {
  const { onChange, ...other } = props;
  const scrollbarHeight = React.useRef();
  const nodeRef = React.useRef(null);

  const setMeasurements = () => {
    if (nodeRef.current) {
      scrollbarHeight.current = nodeRef.current.offsetHeight - nodeRef.current.clientHeight;
    }
  };

  React.useEffect(() => {
    const handleResize = debounce(() => {
      const prevHeight = scrollbarHeight.current;
      setMeasurements();

      if (prevHeight !== scrollbarHeight.current) {
        onChange(scrollbarHeight.current);
      }
    });

    const containerWindow = ownerWindow(nodeRef.current);
    containerWindow.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
    };
  }, [onChange]);

  React.useEffect(() => {
    setMeasurements();
    onChange(scrollbarHeight.current);
  }, [onChange]);

  return <div style={styles} ref={nodeRef} {...other} />;
}

ScrollbarSize.propTypes = {
  onChange: PropTypes.func.isRequired,
};
