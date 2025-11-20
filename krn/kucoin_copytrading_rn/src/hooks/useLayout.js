import {useCallback, useState} from 'react';

/**
 * 自定义 Hook，用于获取元素布局信息。
 * @returns {[Object, Function]} 返回一个包含布局信息的对象和一个用于设置布局信息的函数。
 */
const useLayout = () => {
  const [layout, setLayout] = useState({x: 0, y: 0, width: 0, height: 0});
  // const isFirstLayout = useRef(null);
  /**
   * onLayout 事件处理函数，更新布局信息。
   * @param {Object} event - 布局事件对象。
   */
  const handleOnLayout = useCallback(event => {
    if (!event?.nativeEvent?.layout) return;

    // isFirstLayout.current = true;
    const {x, y, width, height} = event.nativeEvent.layout;
    setLayout({x, y, width, height});
  }, []);

  return [layout, handleOnLayout];
};

export default useLayout;
