/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Modal component
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { clx, getDocumentDir, isRenderable, getCssSafeArea } from '@/common';
import { type IDirection } from '@/shared-type';
import { Text } from '../text';
import { Button } from '../button';
import { Spacer } from '../spacer';
import { useIsMobile, useLockScroll, useZIndex } from '@/hooks';
import { useDownSlide } from './useDownSlide';
import { useModal, EModalVariant } from './useModal';
import { HStack } from '../stack';
import { CloseIcon } from '@kux/iconpack';
/** 图标库不满足设计要求，这个图标特殊处理 */
import CloseIco from './closeIco.svg?react';

import './style.scss';

export interface IModalProps {
  /**
   * 打开状态
   */
  isOpen: boolean;
  /**
   * 尺码
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 确认按钮文字
   */
  okText?: ReactNode;
  /**
   * 关闭按钮文字
   */
  cancelText?: ReactNode;
  /**
   * 传节点就是自定义渲染，传null就是不要 header 部分。
   */
  header?: ReactNode;
  /**
   * 传节点就是自定义渲染。
   */
  content?: ReactNode;
  /**
   * 传节点就是自定义渲染，传null就是不要 footer 部分。
   */
  footer?: ReactNode;
  /**
   * 宽度
   * @description 如果是以 mobileTransform 使用，在小屏是 100% 展示且不可被覆盖。
   */
  width?: string;
  /**
   * 标题
   */
  title?: ReactNode;
  /**
   * 自定义层级
   */
  zIndex?: number;
  /**
   * 是否需要蒙层
   */
  mask?: boolean;
  /**
   * 是否能通过点击蒙层关闭弹窗
   */
  maskClosable?: boolean;
  /**
   * 是否展示右上角关闭图标
   */
  showCloseX?: boolean;
  /**
   * 移动端自适应开关
   * @description 开启这个选项后在小屏幕自动以抽屉方式打开弹窗，不需要再手动实现两套组件
   */
  mobileTransform?: boolean;
  /**
   * 自适应抽屉开关
   * @description 是否以抽屉形式打开，一般用在大屏上
   */
  drawTransform?: boolean;
  /**
   * 抽屉打开方向
   */
  drawAnchor?: 'left' | 'right';
  /**
   * Footer按钮居中，如果是两个按钮，则对半，如果是一个按钮则撑满
   */
  centeredFooterButton?: boolean;
  /**
   * 是否显示header下边框
   */
  headerBorder?: boolean;
  /**
   * 是否显示footer上边框
   */
  footerBorder?: boolean;
  /**
   * 是否支持触摸手势
   */
  isTouchEnabled?: boolean;
  /**
   * footer对齐方式
   */
  footerDirection?: IDirection;
  /**
   * 取消按钮样式
   */
  cancelButtonType?: 'default' | 'outlined' | 'text';
  /**
   * 同步关闭弹窗。即在cancel,ok事件触发时立即关闭弹窗
   */
  closeSync?: boolean;
  /**
   * 弹窗是否充满整个页面
   */
  mode?: 'full' | 'simple';
  /** skip文案 */
  skipText?: ReactNode;
  /**
   * 取消事件
   */
  onCancel?: () => void;
  /**
   * 确认事件
   */
  onOk?: () => void;
  /**
   * 关闭事件
   */
  onClose?: () => void;
  /** 显示事件 */
  onShow?: () => void;
  /** 隐藏事件 */
  onHide?: () => void;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

/**
 * Modal component
 */
export function ModalInner(props: IModalProps) {
  const {
    isOpen,
    width,
    size = 'small',
    className = '',
    mask = true,
    maskClosable = false,
    showCloseX = true,
    title,
    children,
    header,
    content,
    footer,
    zIndex,
    style,
    cancelText,
    okText,
    mobileTransform = false,
    headerBorder = false,
    footerBorder = false,
    drawAnchor = 'right',
    closeSync = true,
    footerDirection = 'horizontal',
    cancelButtonType = 'outlined',
    mode,
    skipText,
    onCancel,
    onOk,
    onClose,
    onShow,
    onHide,
  } = props;
  const {
    variant,
    isCenteredFooterButton,
    isOpenSlideToClose,
    footerTinyBottomPadding,
    hideHeader,
    hideFooter,
    isFullMode,
    isSimpleMode,
  } = useModal(props);
  const [isCloseAnimating, setCloseAnimating] = useState(false);
  const modalDraggableRef = useRef<HTMLDivElement>(null);
  const innerZIndex = useZIndex(isOpen);
  useLockScroll(isOpen);
  /** 获取内容区 dir, 使用 fallbackLang(为空则默认使用当前语言) */
  const dir = getDocumentDir();
  const isMobile = useIsMobile();

  // 打开弹窗时的动效class
  const visibleAnimationClassName = useMemo(() => {
    // 以抽屉形式打开
    if (variant === EModalVariant.DRAWER) {
      return `${isOpen ? `kux-modal-body-open-${drawAnchor}` : `kux-modal-body-close-${drawAnchor}`}`;
    }
    return `${isOpen ? 'kux-modal-body-open' : 'kux-modal-body-close'}`;
  }, [drawAnchor, isOpen, variant]);

  const callOnClose = useCallback(
    async (primaryAction?: Function) => {
      setCloseAnimating(true);
      if (primaryAction) {
        await primaryAction();
      }
      if (closeSync) {
        onClose?.();
      }
    },
    [closeSync, onClose],
  );
  const onCancelHandle = () => callOnClose(onCancel);
  const onOkHandle = () => callOnClose(onOk);
  const onCloseHandle = useCallback(() => {
    setCloseAnimating(true);
    onClose?.();
  }, [onClose]);

  const downFinish = () => {
    onCloseHandle();
  };
  const dragPositionStyle = useDownSlide({
    isOpen: isOpen,
    dom: modalDraggableRef.current,
    disable: !isOpenSlideToClose,
    downFinish: downFinish,
  });

  const clickMaskClose = useCallback(() => {
    if (maskClosable) {
      onCloseHandle();
    }
  }, [onCloseHandle, maskClosable]);

  useEffect(() => {
    return () => {
      if (isOpen) {
        setTimeout(() => {
          setCloseAnimating(false);
        }, 300); // 动画结束后关闭，300ms和样式一致
      }
    };
  }, [isOpen]);

  useEffect(() => {
    onShow?.();
    return () => {
      onHide?.();
    };
  }, []);

  if (!isOpen && !isCloseAnimating) return null;

  // 如果是移动端抽屉弹窗设置props.width不生效。
  const cusWidth = variant === EModalVariant.MDRAWER ? undefined : width;

  const cusBodyStyles = {
    width: cusWidth,
    ...style,
    ...dragPositionStyle,
    '--kux-modal-safe-area-inset-bottom': getCssSafeArea('safe-area-inset-bottom', 16),
  };

  const innerHeader =
    mode === 'full' ? (
      <HStack justify="space-between" className="kux-modal-header-full-mode">
        <CloseIcon
          size="small"
          className="kux-modal-header-full-mode-close"
          onClick={onCloseHandle}
        />
        {isRenderable(skipText) && (
          <Text className="kux-modal-header-full-mode-skip" onClick={onCancelHandle}>
            {skipText}
          </Text>
        )}
      </HStack>
    ) : (
      <div ref={modalDraggableRef}>
        <>
          {/* 滑动关闭Bar */}
          {isOpenSlideToClose && (
            <div
              data-testid="kux-modal-draggable-bar"
              className="kux-modal-body-draggable-bar"
            ></div>
          )}
          <div
            className={clx('kux-modal-header', `kux-modal-header-${variant}`)}
            data-testid="kux-modal-header"
          >
            <Text as="div" className="kux-modal-header-title">
              {title}
            </Text>
            <Spacer length={16} />
            {showCloseX && (
              <div
                data-testid="kux-modal-closeX"
                className="kux-modal-header-close"
                onClick={onCloseHandle}
              >
                <CloseIco className="kux-modal-header-close-ico" />
              </div>
            )}
          </div>
        </>
      </div>
    );
  const modalHeader = isRenderable(header) ? header : innerHeader;
  const modalFooter = isRenderable(footer) ? (
    footer
  ) : (
    <div
      data-testid="kux-modal-footer"
      className={clx(
        'kux-modal-footer',
        `kux-modal-footer-${variant}`,
        `kux-modal-footer-${footerDirection}`,
        {
          'kux-modal-footer-centered': isCenteredFooterButton,
          'kux-modal-footer-tiny-padding': footerTinyBottomPadding,
        },
      )}
    >
      <>
        {cancelText && (
          <Button
            data-testid="kux-modal-cancel"
            type={cancelButtonType}
            block={isCenteredFooterButton}
            onClick={onCancelHandle}
          >
            {cancelText}
          </Button>
        )}
        {cancelText && okText && <Spacer direction={footerDirection} length={12} />}
        {okText && (
          <Button
            data-testid="kux-modal-ok"
            type="primary"
            block={isCenteredFooterButton}
            className="kux-modal-footer-ok"
            onClick={onOkHandle}
          >
            {okText}
          </Button>
        )}
      </>
    </div>
  );

  return (
    <div
      dir={dir}
      data-testid="kux-modal-container"
      className={clx('kux-modal', className, {
        'kux-modal-open': isOpen,
        'kux-modal-full-mode': isFullMode,
        'kux-modal-simple-mode': isSimpleMode,
      })}
      style={{ zIndex: zIndex || innerZIndex }}
    >
      {/* mask */}
      <div
        data-testid="kux-modal-mask"
        className={clx(`${isOpen ? 'kux-modal-mask-open' : 'kux-modal-mask-close'}`, {
          'kux-modal-mask': mask,
          'kux-modal-mask-hide': !mask,
        })}
        onClick={clickMaskClose}
      ></div>
      {/* container */}
      <div
        className={clx('kux-modal-body', `kux-modal-body-${size}`, visibleAnimationClassName, {
          'kux-modal-body-mobile-drawer': variant === EModalVariant.MDRAWER,
          [`kux-modal-body-drawer kux-modal-body-drawer-${drawAnchor}`]:
            variant === EModalVariant.DRAWER,
          'kux-modal-body-mobile-transform': mobileTransform && isMobile,
        })}
        style={cusBodyStyles}
        data-testid="kux-modal-body"
      >
        {/* header */}
        {!hideHeader && modalHeader}
        {/* headerBorder */}
        {headerBorder && (
          <div data-testid="kux-modal-divider-h" className="kux-modal-divider"></div>
        )}
        {/* content */}
        {isRenderable(content) ? (
          content
        ) : (
          <div
            className={clx('kux-modal-content', `kux-modal-content-${variant}`)}
            data-testid="kux-modal-content"
          >
            {children}
          </div>
        )}
        {/* footerBorder */}
        {footerBorder && (
          <div data-testid="kux-modal-divider-f" className="kux-modal-divider"></div>
        )}
        {/* footer */}
        {!hideFooter && modalFooter}

        {/** show close ico in simple mode  */}
        {isSimpleMode && (
          <div className="kux-modal-simple-mode-close" onClick={onCloseHandle}>
            <CloseIco className="kux-modal-simple-mode-close-ico" />
          </div>
        )}
      </div>
    </div>
  );
}
