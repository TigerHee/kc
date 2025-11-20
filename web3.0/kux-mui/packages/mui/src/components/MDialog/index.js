/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import isNull from 'lodash-es/isNull';
import MModalHeader from '../MModalHeader';
import { MDialogRoot, MModalContent, MModalFooter } from './kux';
import useClassNames from './useClassNames';

const MDialog = React.forwardRef(
  (
    {
      onClose,
      headerProps,
      footerProps,
      show,
      children,
      className,
      onOk,
      onCancel,
      title,
      back,
      onBack,
      centeredFooterButton,
      cancelText,
      okText,
      cancelButtonProps,
      okButtonProps,
      footer,
      ...restProps
    },
    ref,
  ) => {
    const _classNames = useClassNames({ show });

    return (
      <MDialogRoot
        show={show}
        onClose={onClose}
        className={clsx(_classNames.root, className)}
        anchor="bottom"
        ref={ref}
        header={
          <MModalHeader
            back={back}
            title={title}
            onClose={onClose}
            onBack={onBack}
            {...headerProps}
          />
        }
        {...restProps}
      >
        <MModalContent className={_classNames.content}>{children}</MModalContent>
        {isNull(footer)
          ? null
          : footer || (
            <MModalFooter
              className={_classNames.footer}
              onOk={onOk}
              onCancel={onCancel}
              border={false}
              okText={okText}
              cancelText={cancelText}
              okButtonProps={{
                size: 'basic',
                ...okButtonProps,
              }}
              cancelButtonProps={{
                size: 'basic',
                ...cancelButtonProps,
              }}
              centeredButton={centeredFooterButton}
              {...footerProps}
            />
          )}
      </MDialogRoot>
    );
  },
);

MDialog.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.node,
  back: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onBack: PropTypes.func,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  cancelButtonProps: PropTypes.object,
  okButtonProps: PropTypes.object,
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
  centeredFooterButton: PropTypes.bool, // Footer按钮居中，如果是两个按钮，则对半，如果是一个按钮则撑满
  maskClosable: PropTypes.bool,
  footer: PropTypes.node, // footer 内容
};

MDialog.defaultProps = {
  show: false,
  back: true,
  title: '',
  onBack: () => { },
  onClose: () => { },
  headerProps: {},
  footerProps: {},
  onOk: () => { },
  onCancel: () => { },
  okText: 'Ok',
  cancelText: 'Cancel',
  cancelButtonProps: {},
  okButtonProps: {},
  centeredFooterButton: false,
  maskClosable: false,
  footer: undefined,
};

MDialog.displayName = 'MDialog';

export default MDialog;
