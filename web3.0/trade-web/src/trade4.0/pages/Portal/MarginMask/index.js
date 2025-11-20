/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback, memo } from 'react';
import { useDispatch } from 'dva';
import { _t } from 'utils/lang';
import AuthMask from '@/pages/Portal/AuthMask';

/**
 * 请先开通杠杆交易提示，如果修改需要同步更新 main-web 对应的组件相关的逻辑
 * 历史原因两边的代码书写格式不一样，比如：class hooks 是否换肤， 需要自己捋下逻辑
 */
const MarginMask = (props) => {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch({
      type: 'marginMeta/update',
      payload: {
        openMarginVisible: true,
      },
    });
  }, []);

  return (
    <AuthMask
      onClick={handleClick}
      desc={_t('margin.sign.agreement.tip')}
      btnText={_t('margin.sign.agreement')}
      {...props}
    />
  );
};
export default memo(MarginMask);
