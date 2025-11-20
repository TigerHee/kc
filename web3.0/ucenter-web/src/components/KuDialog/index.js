/**
 * Owner: willen@kupotech.com
 */
import { Dialog } from '@kux/mui';
import { delay } from 'lodash';
import { useEffect, useState } from 'react';

/**
 * Dialog预处理，每次弹窗打开，childrenh会再次渲染，弹窗关闭，清除dom
 * 适用场景：
 * 打开频率不频繁、dom缓存需求不高
 * 1. 带初始化逻辑操作
 * 2. Dialog带Form，每次重新打开Form需要重置表单
 * @param {*} props
 * @returns
 */
const DialogWrapper = (props) => {
  const { open: visible, children, ...rest } = props;
  const [open, updateOpen] = useState(visible);
  useEffect(() => {
    // 等待Dialog动画完毕后，关闭弹窗（无dom缓存）
    delay(
      () => {
        updateOpen(visible);
      },
      visible ? 0 : 300,
    );
  }, [visible]);

  return (
    <Dialog {...rest} open={visible}>
      {open ? children : null}
    </Dialog>
  );
};

export default DialogWrapper;
