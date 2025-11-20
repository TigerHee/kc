/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Button, ThemeProvider } from '@kufox/mui';
import TemplatesEditor from '../components/Editor';
import { useIsSmall, useIsMiddle, useIsLarge } from 'hooks/mediaQuery';
import styles from './style.less';


const DEVICE_VIEW = {
  pc: 1920,
  ipad: 769,
  h5: 375,
};

const PreviewHeader = () => {
  const isMid = useIsMiddle();
  const isSmall = useIsSmall();
  const isLarge = useIsLarge();

  // 预览不同分辨率窗口
  const openPreview = type => {
    const newWindow = window.open(
      window.location.href,
      '',
      `width=${
        DEVICE_VIEW[type]
      },height=1000,location=no,menubar=no,status=no,toolbar=no,resizable=no`,
    );
    newWindow.opener = null;
  };

  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewInner}>
        <div className={styles.previewTitle}>预览页面</div>
        <div className={styles.previewTools}>
          <div className={styles.previewBtnGroup}>
            <Button
              className={styles.previewBtn}
              onClick={() => openPreview('pc')}
              variant={isLarge ? 'contained' : 'outlined'}
            >
              PC
            </Button>
            <Button
              className={styles.previewBtn}
              onClick={() => openPreview('ipad')}
              variant={isMid ? 'contained' : 'outlined'}
            >
              iPad
            </Button>
            <Button
              className={styles.previewBtn}
              onClick={() => openPreview('h5')}
              variant={isSmall ? 'contained' : 'outlined'}
            >
              H5
            </Button>
          </div>
          <div className={styles.previewTips}>（该功能仅适用于非全屏，请在浏览器非全屏下使用）</div>
        </div>
      </div>
    </div>
  );
};

const LegoActivityPreview = () => {
  return (
    <ThemeProvider>
      <PreviewHeader />
      <TemplatesEditor preview />
    </ThemeProvider>
  );
};

export default React.memo(LegoActivityPreview);
