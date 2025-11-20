/**
 * Owner: jesse.shao@kupotech.com
 */
/*
 *
 * @Description: 通过ReactDOM.createPortal创建元素,创建后的元素直接追加到body下面
 *
 */
import { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ content }) => {
  //创建元素的容器
  const container = useMemo(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
  }, []);
  // 组件销毁后移除空白的容器
  useEffect(() => {
    return () => {
      if (container) {
        container.remove();
      }
    };
  }, [container]);

  if (!content) return null;
  return ReactDOM.createPortal(content, container);
};

export default Portal;
