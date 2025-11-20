/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { styled, Dialog, useTheme, ThemeProvider, Snackbar } from '@kux/mui';
import { Trans, useTranslation } from '@tools/i18n';
import delay from 'lodash/delay';
import { isObject } from 'lodash/isObject';
import NotReceiveDialog from './NotReceiveDialog';
import { getVoiceSupportCountry } from './service';
import { useLang, useToast } from '../../hookTool';
import { kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';

const Container = styled.div`
  display: inline-block;
`;
const BaseText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  cursor: ${({ disable }) => (disable ? 'default' : 'pointer')};
  color: ${({ theme, disable }) => (disable ? 'inherit' : theme.colors.text)};
  text-decoration-line: underline;
`;

const PlaceElement = styled.span`
  visibility: hidden;
`;

const VoiceDialog = styled(Dialog)``;

let timer = null;

const VoiceCode = (props) => {
  const {
    phone = '',
    email = '',
    countryCode = '',
    disable = false,
    loading = false,
    countTime = null,
    onTimeOver = () => {},
    onSend = () => {},
    trackingConfig = {},
  } = props || {};

  const { t } = useLang();
  const theme = useTheme();
  const { t: _t } = useTranslation('entrance');

  const [show, setShow] = useState(false);
  const [codes, setCodes] = useState([]); // 支持语音的区号列表
  const [visible, setVisible] = useState(false);
  const [countTimer, setCountTimer] = useState(0);
  const isSupportVoice =
    codes?.length && (countryCode && `${countryCode}` !== '0' ? codes.includes(countryCode) : true);

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
  }, []);

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
    [onTimeOver],
  );

  // 打开第一个提示弹窗
  const showFirstDialog = () => {
    setShow(true);
    kcsensorsClick(['noCodeButton', '1']);
    kcsensorsManualTrack({
      spm: ['noCodePopUp', '1'],
      ...((trackingConfig && trackingConfig.data) || {}),
    });
  };

  // 关闭第一个弹窗
  const closeFirstDialog = () => {
    setShow(false);
  };

  const onOk = useCallback(() => {
    if (disable) return;
    if (onSend) {
      Promise.resolve(onSend()).finally(() => {
        closeFirstDialog();
      });
    }
  }, [onSend, disable]);

  useEffect(() => {
    clearTimeout(timer);
    setCountTimer(0);
    const time = typeof countTime === 'number' ? countTime : countTime?.time;
    if (time > 0) {
      startCount(time);
    }
  }, [countTime, startCount]);

  return isSupportVoice ? (
    <Container className="voiceCodeBox">
      <BaseText onClick={showFirstDialog} theme={theme} className="voiceCodeText">
        {_t('newsignup.code.ask')}
      </BaseText>
      <NotReceiveDialog
        open={show}
        phone={phone}
        countryCode={countryCode}
        email={email}
        onClose={closeFirstDialog}
        isSupportVoice={isSupportVoice}
        onSend={onOk}
        disabled={disable}
        countTimer={countTimer}
      />
      <VoiceDialog
        open={visible}
        title={t('voice.title')}
        onOk={onOk}
        onCancel={() => {
          setVisible(false);
        }}
        loading={loading}
        okText={t('voice.send')}
        cancelText={t('voice.cancel')}
      >
        <div>
          {phone ? (
            <Trans i18nKey="voice_tips1" ns="entrance" values={{ phone }} />
          ) : (
            t('voice.tips2')
          )}
        </div>
      </VoiceDialog>
    </Container>
  ) : (
    <PlaceElement />
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <Snackbar.SnackbarProvider>
        <VoiceCode {...props} />
      </Snackbar.SnackbarProvider>
    </ThemeProvider>
  );
};
