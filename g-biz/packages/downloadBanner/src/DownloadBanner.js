/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import { kcsensorsManualTrack } from '@utils/sensors';
import Default from './components/Default';
import { BLOCK_ID } from './config';

export default ({ pathname, downloadAppUrl, currentLang } = {}) => {
  const [visible, setVisible] = useState(true);

  const onClose = (e, trackData) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setVisible(false);

      kcsensorsManualTrack(
        {
          spm: [BLOCK_ID, '1'],
          data: trackData,
        },
        'page_click',
      );

      // [2023-06-14] 新逻辑：
      // 永远都展示，点击可关闭
    } catch (e) {
      console.error(e);
    }
  };

  const onDownload = (trackData) => {
    try {
      kcsensorsManualTrack(
        {
          spm: [BLOCK_ID, '1'],
          data: trackData,
        },
        'page_click',
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Default
      downloadAppUrl={downloadAppUrl}
      pathname={pathname}
      visible={visible}
      onClose={onClose}
      currentLang={currentLang}
      onDownload={onDownload}
    />
  );
};
