/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import { useDispatch } from 'dva';
import classnames from 'classnames';
import { ThemeProvider } from '@kux/mui';
import { _t } from 'utils/lang';
import ModalFooter from '@mui/ModalFooter';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import SvgComponent from '@/components/SvgComponent';
import TooltipWrapper from '@/components/TooltipWrapper';
import useStatus from './hooks/useStatus';
import guideQueue from './guideQueue';
import {
  Title,
  RightBox,
  Describe,
  TooltipBody,
  TooltipContent,
  GuidePlaceholder,
} from './style';

const GuideTooltip = React.memo((
  { code, title, describe, iconProps, footerProps, children, ...restProps },
) => {
  const dispatch = useDispatch();
  const open = useStatus(code);

  const { className, ...otherIconProps } = iconProps || {};
  const { onOk: onOkFromProps, okText = null, ...otherFooterProps } = footerProps || {};

  const onCancel = useMemoizedFn(() => {
    const nextVal = guideQueue.getNextSequence();
    dispatch({
      type: 'setting/update',
      payload: {
        activeGuideSequence: nextVal,
      },
    });
  });

  const onOk = useMemoizedFn((...rest) => {
    onCancel();
    if (onOkFromProps) onOkFromProps(...rest);
  });

  return (
    <TooltipWrapper
      open={open}
      disabledOnMobile
      placement="bottom"
      popperStyle={{ zIndex: 50 }}
      title={
        <ThemeProvider theme="dark">
          <TooltipContent onClick={e => e.stopPropagation()}>
            <TooltipBody>
              {Boolean(iconProps) && (
                <SvgComponent
                  keepOrigin
                  width={24}
                  height={24}
                  fileName="guide"
                  className={classnames('mr-8', { [className]: !!className })}
                  {...otherIconProps}
                />
              )}
              <RightBox>
                <Title>{title}</Title>
                <Describe>{describe}</Describe>
              </RightBox>
            </TooltipBody>
            <ModalFooter
              onOk={onOk}
              border={false}
              okText={okText}
              onCancel={onCancel}
              okButtonProps={{ size: 'mini' }}
              cancelText={_t('i.know')}
              cancelButtonProps={{
                size: 'mini',
                ...(okText ? { variant: 'text' } : { variant: 'contained', type: 'primary' }),
              }}
              style={{ padding: 0 }}
              {...otherFooterProps}
            />
          </TooltipContent>
        </ThemeProvider>
      }
      {...restProps}
    >
      {children || <GuidePlaceholder />}
    </TooltipWrapper>
  );
});

export default GuideTooltip;
