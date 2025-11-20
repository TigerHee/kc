/**
 * Owner: willen@kupotech.com
 */
import { Player } from '@lottiefiles/react-lottie-player';
import clxs from 'classnames';
import { useEffect, useRef } from 'react';
import { CloseFilled } from '@kufox/icons';
import { useIsMobile } from '../../util';
import style from './style.less';

const OpenMysteryBoxAnimation = (props) => {
  const viewHeight = window.innerHeight;
  const viewWidth = window.innerWidth;
  const playerRef = useRef(null);
  const { open = false, json = {}, onClose } = props;
  const isMobile = useIsMobile();
  // 防止页面滚动
  useEffect(() => {
    if (open) {
      playerRef.current.play();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      playerRef.current && playerRef.current.stop();
      document.body.style.overflow = '';
    };
  }, [open]);

  const _onCloseClick = () => {
    onClose && onClose();
  };
  const isWidthMoreThanHeight = viewWidth > viewHeight;

  return (
    <div
      className={clxs(style.outContainer, {
        [style.outContainerShow]: open,
      })}
    >
      <div
        className={clxs(style.mask, {
          [style.maskShow]: open,
        })}
      />
      <div
        className={clxs(style.closeContainer, {
          [style.closeContainerMOne]: isMobile && isWidthMoreThanHeight,
          [style.closeContainerMTwo]: isMobile && !isWidthMoreThanHeight,
        })}
        onClick={_onCloseClick}
      >
        <CloseFilled size={24} />
      </div>
      <div
        className={style.container}
        style={{
          width: isMobile
            ? isWidthMoreThanHeight
              ? '80vh'
              : '80vw'
            : isWidthMoreThanHeight
            ? '50vh'
            : '50vw',
          height: isMobile
            ? isWidthMoreThanHeight
              ? '80vh'
              : '80vw'
            : isWidthMoreThanHeight
            ? '50vh'
            : '50vw',
        }}
      >
        <Player
          ref={playerRef}
          src={json}
          autoplay={false}
          keepLastFrame={true}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet',
            imagePreserveAspectRatio: 'xMidYMid meet',
          }}
          style={{ height: '100%', width: '100%' }}
          loop={false}
        />
      </div>
    </div>
  );
};

export default OpenMysteryBoxAnimation;
