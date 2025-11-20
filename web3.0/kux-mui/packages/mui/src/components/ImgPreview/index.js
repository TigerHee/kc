/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import Fade from 'components/Fade';
import Portal from 'components/Portal';
import { ICCloseOutlined, ICArrowRight2Outlined } from '@kux/icons';

const ImgWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.mask};
  padding: 112px 16px;
  z-index: 1000;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 24px;
  background: ${(props) => props.theme.colors.mask};
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 88px;
    align-items: flex-end;
    padding-bottom: 20px;
    padding-right: 16px;
  }
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Arrow1 = styled.div`
  position: absolute;
  left: 24px;
  top: 50%;
  width: 44px;
  height: 44px;
  border-radius: 100%;
  background: ${(props) => props.theme.colors.mask};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: rotate(180deg);
  ${(props) => props.theme.breakpoints.down('sm')} {
    left: calc(50% - 64px);
    top: unset;
    bottom: 24px;
  }
`;

const Arrow2 = styled(Arrow1)`
  right: 24px;
  left: unset;
  transform: rotate(0);
  ${(props) => props.theme.breakpoints.down('sm')} {
    left: unset;
    right: calc(50% - 64px);
    top: unset;
  }
`;

const ImgPreview = React.forwardRef(
  (
    {
      showArrow = false,
      url,
      show = false,
      onClose = () => {},
      onLeftClick = () => {},
      onRightClick = () => {},
      maskCloseable = false,
    },
    ref,
  ) => {
    const theme = useTheme();
    const iconClose = (e) => {
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      onClose();
    };

    const maskClose = () => {
      if (maskCloseable) {
        onClose();
      }
    };

    return (
      <Portal>
        <Fade in={show}>
          <ImgWrapper theme={theme} onClick={maskClose}>
            <Header theme={theme}>
              <ICCloseOutlined size={20} color="#fff" onClick={iconClose} />
            </Header>
            <Img src={url} ref={ref} />
            {showArrow && (
              <>
                <Arrow1 onClick={onLeftClick} theme={theme}>
                  <ICArrowRight2Outlined size={20} color="#fff" />
                </Arrow1>
                <Arrow2 onClick={onRightClick} theme={theme}>
                  <ICArrowRight2Outlined size={20} color="#fff" />
                </Arrow2>
              </>
            )}
          </ImgWrapper>
        </Fade>
      </Portal>
    );
  },
);

export default ImgPreview;
