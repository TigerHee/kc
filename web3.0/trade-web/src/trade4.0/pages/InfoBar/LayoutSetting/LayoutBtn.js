/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Suspense, Fragment, useCallback } from 'react';
import TooltipWrapper from '@/components/TooltipWrapper';
import { commonSensorsFunc } from '@/meta/sensors';
import { IconWrapper } from '../SettingsToolbar/style';
import { useDispatch } from 'dva';
import { _t } from 'src/utils/lang';

// 部分响应式尺寸下没有布局设置
const LayoutSetting = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-layoutSetting' */ './index');
});

/**
 * LayoutBtn
 */
const LayoutBtn = (props) => {
  // const { ...restProps } = props;
  const dispatch = useDispatch();

  const handleLayoutClick = useCallback(() => {
    commonSensorsFunc(['tradeZoneFunctionArea', 'layoutSetting', 'click']);
    dispatch({
      type: 'setting/update',
      payload: {
        openLayoutSetting: true,
      },
    });
  }, []);

  return (
    <Fragment>
      <TooltipWrapper title={_t('uQQmY7meydqpU2HpiywCVV')} placement="bottom">
        <IconWrapper
          fileName="toolbar"
          type="layout"
          onClick={handleLayoutClick}
          style={{ width: '19px', height: '19px' }}
        />
      </TooltipWrapper>
      <Suspense fallback={<div />}>
        <LayoutSetting />
      </Suspense>
    </Fragment>
  );
};

export default memo(LayoutBtn);
