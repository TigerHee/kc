/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Dialog, styled, ThemeProvider } from '@kux/mui';
import { Trans } from '@tools/i18n';

import { isObject } from 'lodash/isObject';
import delay from 'lodash/delay';
import { getVoiceSupportCountry } from './service';
import { useLang, useToast } from '../../hookTool';
import RootEmotionCacheProvider from '../../Layout/RootEmotionCacheProvider';

const Text = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  cursor: ${({ disable }) => (disable ? 'default' : 'pointer')};
  color: ${({ theme, disable }) => (disable ? 'inherit' : theme.colors.text)};
  text-decoration-line: underline;
`;

let timer = null;

const VoiceCode = (props) => {
  const {
    phone = '',
    countryCode = '',
    disable = false,
    loading = false,
    countTime = null,
    onTimeOver = () => {},
    validateFunc = undefined,
    onSend = () => {},
    placeNode = undefined, // 占位节点
  } = props || {};

  const { t } = useLang();

  const [codes, setCodes] = useState([]); // 支持语音的区号列表
  const [clicked, setClicked] = useState(false); // 是否点击过
  const [visible, setVisible] = useState(false);
  const [countTimer, setCountTimer] = useState(0);

  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    // 获取支持语音的区号列表
    getVoiceSupportCountry()
      .then((res) => {
        const { success = false, data = [] } = res || {};
        if (success && data && data.length) {
          const _list = [];
          data.forEach((item) => {
            const { mobileCode = '' } = item || {};
            if (mobileCode) {
              _list.push(mobileCode);
            }
          });
          setCodes(_list);
        }
      })
      .catch((err) => {
        const msg = isObject(err)
          ? typeof err.msg === 'string'
            ? err.msg
            : JSON.stringify(err.msg)
          : err;
        if (msg) {
          toastRef.current.error(msg);
        }
      });
  }, [setCodes]);

  const startCount = useCallback(
    (seconds) => {
      setCountTimer(seconds);
      if (seconds >= 1) {
        timer = delay(() => {
          startCount(seconds - 1);
        }, 1000);
      } else {
        clearTimeout(timer);
        onTimeOver && onTimeOver();
      }
    },
    [setCountTimer, onTimeOver],
  );

  const _phone = useMemo(() => {
    const str = String(phone) || '';
    const len = str.length;
    if (!len) return str;
    if (len >= 4) {
      return ['***', str.substr(-4)].join('');
    }
    return ['***', str].join('');
  }, [phone]);

  const text = useMemo(() => {
    return clicked ? t('voice.title') : t('voice.tips.msg');
  }, [clicked, t]);

  const onClick = useCallback(() => {
    if (disable) return false;
    if (validateFunc) {
      Promise.resolve(validateFunc()).then(() => {
        setVisible(true);
      });
    } else {
      setVisible(true);
    }
    return true;
  }, [disable, validateFunc, setVisible]);

  const onOk = useCallback(() => {
    if (onSend) {
      Promise.resolve(onSend()).finally(() => {
        setVisible(false);
        setClicked(true);
      });
    }
  }, [onSend, setVisible, setClicked]);

  useEffect(() => {
    clearTimeout(timer);
    setCountTimer(0);
    if (countTime) {
      const _time = typeof countTime === 'number' ? countTime : countTime.time || 0;
      if (_time > 0) {
        startCount(_time || 60);
      }
    }
  }, [countTime, startCount]);

  const placeEle =
    placeNode !== undefined ? placeNode : <span style={{ visibility: 'hidden' }}>占位</span>;

  return codes && codes.length && (countryCode ? codes.includes(countryCode) : true) ? (
    <div style={{ display: 'inline-block' }}>
      <Text onClick={onClick}>
        {text}
        {countTimer ? `(${countTimer}s)` : ''}
      </Text>
      <Dialog
        rootProps={{
          style: { zIndex: 99999999 },
        }}
        open={visible}
        title={t('voice.title')}
        cancelButtonProps={{ size: 'basic' }}
        okButtonProps={{ size: 'basic', loading }}
        cancelText={t('voice.cancel')}
        okText={t('voice.send')}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={onOk}
      >
        {_phone ? (
          <Trans i18nKey="voice_tips1" ns="entrance" values={{ phone: _phone }} />
        ) : (
          t('voice.tips2')
        )}
      </Dialog>
    </div>
  ) : (
    placeEle
  );
};

const VoiceCodeWithTheme = (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <RootEmotionCacheProvider>
        <VoiceCode {...props} />
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};

export default VoiceCodeWithTheme;
