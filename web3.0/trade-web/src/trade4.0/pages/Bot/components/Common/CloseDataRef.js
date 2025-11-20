/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useState, useImperativeHandle } from 'react';

const CloseData = React.forwardRef(({ Comp, compDefaultProps, ...rest }, ref) => {
  const [outProps, setData] = useState({});
  const actionSheetRef = useRef();
  useImperativeHandle(
    ref,
    () => {
      return {
        toggle: (outPropsHere) => {
          setData(outPropsHere);
          // 先让state数据传递进入子组件 在打开
          // 不见setTimeout, current控制 可能会优先state数据执行 他们不是同步的
          setTimeout(() => {
            actionSheetRef.current.toggle();
          }, 90);
        },
      };
    },
    [],
  );

  return <Comp {...compDefaultProps} {...rest} {...outProps} actionSheetRef={actionSheetRef} />;
});
// 使用多个dialogRef  在一个组件多次弹窗的情况， 父组件通过toggle传递数据到自组件
// 不通通过toggle传递数据， 就只能在父组件声明 一个/多个state变量， 会造成一个state 影响到不属于他的dialogRef 报错，不美观
// 这里通过组件嵌套隔离state变量在CloseData组件中
const CloseDataRef = (Comp, defaultProps = {}) => {
  return ({ actionSheetRef, ...rest }) => {
    return <CloseData Comp={Comp} ref={actionSheetRef} compDefaultProps={defaultProps} {...rest} />;
  };
};

export default CloseDataRef;
