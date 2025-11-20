/**
 * Owner: gavin.liu1@kupotech.com
 */
import { styled, Global, css } from '@kufox/mui/emotion';
import Reel from 'react-reel';
import Dialog from '@kufox/mui/Dialog';
import { _t } from 'utils/lang';
import React, { useEffect, useState } from 'react';
import star from 'src/assets/referFriend/star.svg';
import { motion } from 'framer-motion';

const theme = {
  reel: {
    height: '1em',
    display: 'flex',
    alignItems: 'flex-end',
    overflowY: 'hidden',
    padding: '0 5px 0 0',
    fontSize: '35px',
    fontWeight: '800',
    color: 'rgb(241, 243, 172)',
    lineHeight: '0.95em',
  },
  group: {
    transitionDelay: '0ms',
    transitionTimingFunction: 'ease-in-out',
    transform: 'translate(0, 0)',
    height: '1em',
  },
  number: {
    height: '1em',
  },
};

const Wrap = styled.div`
  width: 100%;

  .title {
    max-width: 210px;
    margin: 0 auto 5px;
    font-weight: 800;
    font-size: 18px;
    font-family: Roboto;
    font-style: italic;
    line-height: 130%;
    text-align: center;
    background: linear-gradient(90.47deg, #ffd75e 4.71%, #ffffc3 95.25%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
  }

  .topLine {
    position: absolute;
    right: 80px;
    left: 26px;
    height: 1px;
    background: linear-gradient(
      90deg,
      #fffadf -0.37%,
      rgba(255, 244, 186, 0) -0.36%,
      rgba(255, 250, 227, 0.64) 49.08%,
      rgba(255, 243, 178, 0) 108.08%
    );
    .star {
      position: absolute;
      right: -25px;
      bottom: 0;
      width: 22px;
    }
  }

  .bottomLine {
    position: absolute;
    right: 20px;
    left: 86px;
    height: 1px;
    background: linear-gradient(
      90deg,
      #fffadf -0.37%,
      rgba(255, 244, 186, 0) -0.36%,
      rgba(255, 250, 227, 0.73) 53.04%,
      rgba(255, 243, 178, 0) 108.08%
    );
  }
  .main {
    position: relative;
    width: 100%;
  }

  .textWrap {
    display: flex;
    justify-content: center;
    min-height: 65px;
    padding-top: 16px;
    font-weight: 800;
    font-size: 50px;
    font-family: Roboto;
    /* font-style: italic; */
    /* 自定义倾斜角度 */
    transform: skewX(-10deg); 
    line-height: 65px;
    text-align: center;
    text-transform: uppercase;

    .usdt {
      margin-bottom: 8px;
      margin-left: 0.3em;
      color: rgb(241, 243, 172);
      font-size: 30px;
      font-size: 20px;
      line-height: 41px;
    }
  }

  .wrap1 {
    position: relative;
    /* top: -7px; */
    display: flex;
    justify-content: center;
  }
`;

const PlatformPower = ({ text, onEnd }) => {
  const [showReel, setShowReel] = useState(false);
  const line1Variants = {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: '0%', transition: { duration: 1, ease: 'easeInOut' } },
  };

  const line2Variants = {
    hidden: { opacity: 0, x: '200%' },
    visible: { opacity: 1, x: '0%', transition: { duration: 1, ease: 'easeInOut' } },
  };

  const handleAnimationComplete = () => {
    setShowReel(true);
  };

  useEffect(() => {
    setTimeout(() => {
      onEnd && onEnd();
    }, 3500);
  }, []);

  const textWithZero = text ? Number(text).toFixed(4) : text;

  return (
    <>
      <Global
        styles={css`
          .PlatformPower-Dialog.KuxDialog-body {
            width: 375px;
            max-width: 375px;
            background: transparent;
            border-radius: 14px;
            .KuxDialog-content {
              padding: 0;
              overflow-y: unset;
              color: unset;
              color: #fff;
              line-height: unset;
            }
          }
        `}
      />

      <Dialog
        className={'PlatformPower-Dialog'}
        open
        showCloseX={false}
        okText={null}
        cancelText={null}
        footer={null}
        header={null}
        showBanner={true}
      >
        <Wrap>
          <div className="title">{_t('nt3fvqTPbWoAgr9Jzynr1b')}</div>
          <motion.div
            className="main"
            initial="hidden"
            animate="visible"
            variants={line1Variants}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="topLine">
              <img src={star} className="star" alt="star" />
            </div>
          </motion.div>
          <div className="textWrap">
            {showReel && (
              <>
                <div className="wrap1">
                  <Reel text={textWithZero} theme={theme} />
                </div>
                <div className="usdt">USDT</div>
              </>
            )}
          </div>
          <motion.div className="main" initial="hidden" animate="visible" variants={line2Variants}>
            <div className="bottomLine" />
          </motion.div>
        </Wrap>
      </Dialog>
    </>
  );
};

export default PlatformPower;
