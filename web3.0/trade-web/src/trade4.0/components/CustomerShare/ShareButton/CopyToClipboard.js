/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import Clipboard from 'react-copy-to-clipboard';

import clsx from 'clsx';
import { useDispatch } from 'dva';
import { isFunction } from 'lodash';

import { _t } from 'utils/lang';

import { ICLinkOutlined } from '@kux/icons';
import { Button } from '@kux/mui';


const CopyToClipboard = ({ text, onCopy, isMobile }) => {
  const dispatch = useDispatch();
  const handleCopy = useCallback(() => {
    if (isFunction(onCopy)) {
      onCopy();
      return;
    }
    dispatch({
      type: 'notice/feed',
      payload: {
        type: 'message.success',
        message: _t('share.copySuccess'),
      },
    });
  }, [dispatch, onCopy]);

  return (
    <Clipboard text={text} onCopy={handleCopy}>
      <Button
        className={clsx('operator-button', 'clip-board-button')}
        variant={isMobile ? 'contained' : 'text'}
        isMobile={isMobile}
        type="default"
      >
        <div className="icon-box">
          <ICLinkOutlined className="clipboard-icon" />
        </div>
        <span className="text">{isMobile ? _t('copy.link') : _t('copy')}</span>
      </Button>
    </Clipboard>
  );
};

export default React.memo(CopyToClipboard);
