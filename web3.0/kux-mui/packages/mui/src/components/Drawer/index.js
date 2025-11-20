/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { delay, isNull } from 'lodash-es';
import ReactDOM from 'react-dom';
import useTheme from 'hooks/useTheme';
import ModalHeader from '../ModalHeader';
import { DrawerRoot, DrawerMask, ModalContent } from './kux';
import useClassNames from './useClassNames';

const Drawer = React.forwardRef(
  (
    {
      anchor,
      show = false,
      onClose,
      children,
      className,
      maskClosable,
      back,
      title,
      onBack,
      header,
      headerBorder,
      headerProps,
      keepMounted,
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const maskRef = React.useRef();
    const _classNames = useClassNames({ anchor, show, ...restProps });
    const [iShow, setIShow] = useState(show);
    const [showContent, setShowContent] = useState(false);
    const timerRef = useRef(null);

    const cleanTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    useEffect(() => {
      if (keepMounted) {
        return;
      }
      cleanTimer();
      if (show) {
        setIShow(show);
        timerRef.current = delay(() => setShowContent(show), 100);
      } else {
        setShowContent(false);
        timerRef.current = delay(() => setIShow(show), 300);
      }
      return () => {
        cleanTimer();
      };
    }, [keepMounted, show]);

    useEffect(() => {
      const style = document.body.style;
      if (show) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'relative';
      }
      return () => {
        document.body.style = style;
      };
    }, [show]);

    const closeKeyBoard = useCallback(
      (e) => {
        cleanTimer();
        if (!keepMounted) {
          setShowContent(false);
          timerRef.current = delay(() => {
            if (typeof onClose === 'function') {
              onClose();
            }
          }, 300);
        } else {
          if (typeof onClose === 'function') {
            onClose();
          }
        }
      },
      [onClose, keepMounted],
    );

    const handleMaskClick = (e) => {
      if (maskRef.current === e.target) {
        if (!maskClosable) return;
        closeKeyBoard();
      }
    };

    const domChild = () => {
      return keepMounted || iShow ? (
        <DrawerMask
          className={_classNames.mask}
          onClick={handleMaskClick}
          show={keepMounted ? show : showContent}
          theme={theme}
          ref={maskRef}
        >
          <DrawerRoot
            {...restProps}
            ref={ref}
            show={keepMounted ? show : showContent}
            anchor={anchor}
            theme={theme}
            className={clsx(_classNames.root, className)}
          >
            {isNull(header)
              ? null
              : header || (
                  <ModalHeader
                    back={back}
                    title={title}
                    onClose={onClose}
                    onBack={onBack}
                    border={headerBorder}
                    {...headerProps}
                  />
                )}
            <ModalContent className={_classNames.content}>{children}</ModalContent>
          </DrawerRoot>
        </DrawerMask>
      ) : null;
    };

    return ReactDOM.createPortal(domChild(), document.body);
  },
);

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  anchor: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  show: PropTypes.bool,
  onClose: PropTypes.func,
  maskClosable: PropTypes.bool,
  header: PropTypes.node,
  headerBorder: PropTypes.bool,
  back: PropTypes.bool,
  title: PropTypes.node,
  onBack: PropTypes.func,
  headerProps: PropTypes.object,
  keepMounted: PropTypes.bool,
};

Drawer.defaultProps = {
  anchor: 'right',
  show: false,
  onClose: () => {},
  maskClosable: true,
  header: undefined,
  headerBorder: true,
  title: '',
  back: true,
  onBack: () => {},
  headerProps: {},
};

Drawer.displayName = 'Drawer';

export default Drawer;
