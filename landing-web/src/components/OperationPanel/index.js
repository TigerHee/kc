/**
 * Owner: jesse.shao@kupotech.com
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';

import classnames from 'classnames';

import style from './style.less';
import ReactDOM from 'react-dom';

const CmptOperationPanel = ({
  open,
  onCancel = () => {},
  wrapperClas,
  className,
  children,
  enableTransition,
  onEnter,
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [wrapperVisible, setWrapperVisible] = useState('hidden');

  useEffect(() => {
    if (open === showPanel) {
      return;
    }
    setShowPanel(!!open);
  }, [open, showPanel]);

  // 关闭
  // const closePanel = useCallback(() => {
  //   if(onClose) {
  //     onClose();
  //   }
  //   setShowPanel(false);
  // }, [onClose]);

  const _wrapperClas = classnames(style.operationPanelWrapper, !!wrapperClas ? wrapperClas : '');
  const _contentClas = classnames(style.operationPanel, !!className ? className : '');

  const handleClick = useCallback(e => {
    const dataset = e.target.dataset;
    if (dataset && dataset.role === 'operation-panel') {
      setShowPanel('none');
      onCancel();
    }
  }, []);

  const content = (
    <div className={_wrapperClas} style={{ visibility: wrapperVisible }}>
      <div className={style.mask} data-role="operation-panel" onClick={handleClick} />
      <CSSTransition
        in={open}
        timeout={400}
        classNames="operation-panel"
        unmountOnExit
        onEnter={() => {
          console.log('enter');
          setWrapperVisible('visible');
          if (onEnter) onEnter();
        }}
        onExited={() => setWrapperVisible('hidden')}
      >
        <div className={_contentClas}>{children}</div>
      </CSSTransition>
    </div>
  );

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

  return ReactDOM.createPortal(content, container);
};

export default CmptOperationPanel;
