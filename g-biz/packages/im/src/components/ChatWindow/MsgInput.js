/**
 * Owner: iron@kupotech.com
 */
import React, { useRef, useCallback, useState } from 'react';
import { Button, TextField, InputAdornment } from '@kc/mui';
import { useTranslation } from '@tools/i18n';
import { makeStyles } from '@kc/mui/lib/styles';
import { PicOutlined } from '@kufox/icons';
import clsx from 'clsx';
import { message } from 'antd';
// import { NORMAL_FILE_TYPES } from '../../config';
import { MessageContentType, MessageType } from './types';
import { trackClick } from '../../helper';

const useStyle = makeStyles(() => {
  return {
    actions: {
      display: 'flex',
      height: 56,
      alignItems: 'center',
      background: '#fff',
      boxShadow: '0 4px 18px 0 rgba(0,20,42,0.08)',
      padding: '0 8px',
      overflow: 'hidden',
      position: 'relative',
    },
    input: {
      flex: 1,
      marginRight: 8,
      marginTop: -30,
    },
    fileIpt: {
      width: 0,
      height: 0,
      position: 'absolute',
      top: 100,
    },
  };
});

export default ({ sendInputMsg, className, disabled }) => {
  const styles = useStyle();
  const iptFileRef = useRef(null);
  const [value, setValue] = useState('');
  const { t: _t } = useTranslation('im');

  const submitMsg = useCallback(() => {
    trackClick(['IM', '2']);
    if (!value) return;
    sendInputMsg({ message: value, type: MessageType.MINE, contentType: MessageContentType.TEXT });
    setValue('');
  }, [sendInputMsg, value]);

  const handleUploadFile = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size >= 1024 * 1024 * 4) {
        message.error(_t('im.error.common.file.send.max'));
      }
      sendInputMsg({
        type: MessageType.MINE,
        contentType: MessageContentType.FILE,
        file,
      });
    },
    [sendInputMsg],
  );

  const onEnterMsg = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        submitMsg();
      }
    },
    [submitMsg],
  );

  const handleMouseDown = useCallback((e) => {
    e && e.preventDefault();
  }, []);

  return (
    <div className={clsx(styles.actions, className)}>
      <TextField
        value={value}
        placeholder={_t('im.chat.input.placeholder')}
        className={styles.input}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PicOutlined
                size={24}
                onClick={() => {
                  iptFileRef && iptFileRef.current.click();
                }}
              />
            </InputAdornment>
          ),
        }}
        disabled={disabled}
        // inputProps={{
        //   // eslint-disable-line
        //   maxLength: 500,
        // }}
        onKeyUp={onEnterMsg}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => trackClick(['IM', '1'])}
      />
      <input
        type="file"
        className={styles.fileIpt}
        onChange={handleUploadFile}
        ref={iptFileRef}
        accept="image/*"
      />
      <Button
        className={styles.btn}
        onClick={submitMsg}
        disabled={disabled}
        onMouseDown={handleMouseDown}
      >
        {_t('im.chat.button.text')}
      </Button>
    </div>
  );
};
