/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme, useResponsive } from 'hooks/index';
import clsx from 'clsx';
import { ICArrowLeft2Outlined, ICClosePlusOutlined } from '@kux/icons';
import ICCloseSmall from '@kux/icons/static/ICCloseSmall.svg';
import ICBackSmall from '@kux/icons/static/ICBackSmall.svg';
import useClassNames from './useClassNames';
import { ModalHeaderRoot, HeaderBack, HeaderTitle, HeaderClose, CloseSmall, BackSmall } from './kux';

const ModalHeader = React.forwardRef(
  (
    {
      title,
      className,
      onClose,
      disableClose,
      onBack,
      back,
      close,
      closeNode,
      backNode,
      border,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const rv = useResponsive();

    const _classNames = useClassNames({ disableClose, border });

    const onBackClick = useCallback(() => {
      if (disableClose) return;
      onBack && onBack();
    }, [onBack, disableClose]);

    const onCloseClick = useCallback(() => {
      if (disableClose) return;
      onClose && onClose();
    }, [onClose, disableClose]);

    return (
      <ModalHeaderRoot
        {...props}
        border={border}
        className={clsx(_classNames.root, className)}
        theme={theme}
        ref={ref}
      >
        {back && (
          <HeaderBack
            className={_classNames.back}
            theme={theme}
            disabled={disableClose}
            onClick={onBackClick}
          >
            {backNode || (
              !rv.sm ? (
                <BackSmall src={ICBackSmall} alt="back" />
              ) : (
                <ICArrowLeft2Outlined size={22} color={theme.colors.text} />
              )
            )}
          </HeaderBack>
        )}
        {close && (
          <HeaderClose
            className={_classNames.close}
            theme={theme}
            disabled={disableClose}
            onClick={onCloseClick}
          >
            {closeNode ||
              (!rv.sm ? (
                <CloseSmall src={ICCloseSmall} alt="close" />
              ) : (
                <ICClosePlusOutlined size={12} color={theme.colors.text} />
              ))}
          </HeaderClose>
        )}
        {title && (
          <HeaderTitle theme={theme} className={_classNames.title}>
            {title}
          </HeaderTitle>
        )}
      </ModalHeaderRoot>
    );
  },
);

ModalHeader.propTypes = {
  border: PropTypes.bool, // 底线
  back: PropTypes.bool, // 显示返回箭头
  close: PropTypes.bool, // 显示关闭箭头
  title: PropTypes.node,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  disableClose: PropTypes.bool, // 禁止关闭和返回
  closeNode: PropTypes.node, // 自定义关闭箭头
  backNode: PropTypes.node, // 自定义返回箭头
};

ModalHeader.defaultProps = {
  border: true,
  back: false,
  close: true,
  title: 'Title',
  onClose: () => {},
  onBack: () => {},
  disableClose: false,
};

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
