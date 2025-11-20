/**
 * Owner: larvide.peng@kupotech.com
 *
 * Modal组件内部展示逻辑
 */
import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { IModalProps } from '.';

export const EModalVariant = {
  MODAL: 'modal',
  MDRAWER: 'mobile-drawer',
  DRAWER: 'drawer',
} as const;

export function useModal(props: IModalProps) {
  const isMobile = useIsMobile();
  const {
    mobileTransform,
    isOpen,
    drawTransform = false,
    isTouchEnabled = true,
    centeredFooterButton = true,
    cancelText,
    cancelButtonType,
    footerDirection,
    header,
    footer,
    mode
  } = props;

  /** 弹窗变体 */
  const variant: (typeof EModalVariant)[keyof typeof EModalVariant] = useMemo(() => {
    if (drawTransform) {
      return EModalVariant.DRAWER;
    }
    if (mobileTransform && isMobile) {
      return EModalVariant.MDRAWER;
    }
    return EModalVariant.MODAL;
  }, [drawTransform, isMobile, mobileTransform]);

  // 底部按钮是否居中
  const isCenteredFooterButton = useMemo(() => {
    if (variant === EModalVariant.DRAWER) {
      return false;
    }
    if (isMobile) {
      return true;
    }
    return centeredFooterButton;
  }, [centeredFooterButton, isMobile, variant]);

  /** 是否在移动端打开下滑关闭 */
  const isOpenSlideToClose =
    isMobile && isOpen && isTouchEnabled && variant === EModalVariant.MDRAWER;

  /** 取消按钮为test类型且竖着排列时，footer底部以小边距展示 */
  const footerTinyBottomPadding =
    !!cancelText && cancelButtonType === 'text' && footerDirection === 'vertical';

  /** 
   * 一种弹窗变体，样式比较特殊 
   * @see https://www.figma.com/design/979O23gM42ADNiDJkoo8fa/KC-Guidelines-2025?node-id=42824-25738&m=dev
   */
  const isSimpleMode = mode === 'simple';
  /**
   *  一种弹窗变体，样式比较特殊
   * @see https://www.figma.com/design/979O23gM42ADNiDJkoo8fa/KC-Guidelines-2025?node-id=42824-25716&m=dev
   */
  const isFullMode = mode === 'full';

  return {
    variant,
    isCenteredFooterButton,
    isOpenSlideToClose,
    footerTinyBottomPadding,
    isSimpleMode,
    isFullMode,
    hideHeader: header === null || isSimpleMode,
    hideFooter: footer === null || isSimpleMode,
  };
}
