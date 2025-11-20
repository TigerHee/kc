/*
 * owner: borden@kupotech.com
 */
import React, { useState, useCallback, useEffect, Fragment, useMemo } from 'react';
import { debounce, forOwn, isNumber, isBoolean, noop, forEach, filter } from 'lodash';
import { ICAnnouncementOutlined } from '@kux/icons';
import { useDispatch, useSelector } from 'dva';
import { useTheme } from '@kux/mui';
import Button from '@mui/Button';
import Switch from '@mui/Switch';
import Divider from '@mui/Divider';
import Slider from '@mui/Slider';
import SvgComponent from '@/components/SvgComponent';
import TooltipWrapper from '@/components/TooltipWrapper';
import voice from '@/utils/voice';
import { _t } from 'utils/lang';

import { useTradeType } from '@/hooks/common/useTradeType';
import { FUTURES } from '@/meta/const';

import {
  SOUND_SETTINGS,
  SOUND_CONFIG,
  DEFAULT_SOUND_SETTING,
  FUTURES_DISABLED_KEY,
  FUTURES_NOTICE_CHECK_KEYS,
} from './config';
import { DrawerContent, DrawerFooter } from '../style';
import { Container, Row, Label, Describe } from './style';

const getFuturesLiquidState = ({ isFuturesTradeType, alertSettings, dataKey }) => {
  let disabled = false;
  // 合约且合约的adl，强平声音是根据站内信来控制的，如果站内信关闭则需要
  if (isFuturesTradeType && FUTURES_DISABLED_KEY.includes(dataKey)) {
    if (alertSettings.length > 0) {
      // 开始检查置为disabled
      disabled = true;
      // 匹配到alertSettings中有FUTURES_NOTICE_CHECK_KEYS的值就把disabled设置为false
      forEach(alertSettings, (itemKey) => {
        if (FUTURES_NOTICE_CHECK_KEYS.includes(itemKey)) {
          disabled = false;
        }
      });
    } else {
      disabled = true;
    }
  }
  return disabled;
};

const SoundReminder = React.memo(({ onOk = noop }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const soundReminderSettings = useSelector((state) => state.setting.soundReminderSettings);

  // 合约notice的配置
  const alertSettings = useSelector((state) => state.futuresSetting.webNoticeConfig);

  const [realVolume, setRealVolume] = useState(() => {
    return isNumber(soundReminderSettings?.volume)
      ? soundReminderSettings.volume
      : DEFAULT_SOUND_SETTING.volume;
  });
  const isMuted = soundReminderSettings?.muted === true;

  const tradeType = useTradeType();
  // 判断是否合约的 tradeType
  const isFuturesTradeType = useMemo(() => {
    return tradeType === FUTURES;
  }, []);

  useEffect(() => {
    voice.disable();
    return () => {
      voice.enable();
    };
  }, []);

  const audiometric = useCallback((code) => {
    voice.audiometric(code);
  }, []);

  const onValuesChange = useCallback(
    debounce((v) => {
      if (isNumber(v.volume)) {
        voice.setVolume(v.volume / 100);
        if (v.volume <= 0) {
          v.muted = true;
        } else if (v.volume > 0) {
          v.muted = false;
        }
      }
      if (isBoolean(v.muted)) {
        voice.setMuted(v.muted);
      }
      // 取消静音或者音量调整后，播放试听音频
      if (v.muted === false || v.volume > 0) {
        audiometric('order_success');
      }
      forOwn(v, (value, key) => {
        const { voiceCodes } = SOUND_CONFIG[key] || {};
        if (!voiceCodes) return;
        if (value) {
          // 打开开关，存在试听的播放一次
          if (voiceCodes.length === 1) {
            audiometric(voiceCodes[0]);
          }
          voice.open(voiceCodes);
        } else {
          voice.close(voiceCodes);
        }
      });
      dispatch({
        type: 'setting/updateSoundReminderSettings',
        payload: v,
      });
    }, 200),
    [],
  );

  const handleChangeSlider = useCallback((v) => {
    setRealVolume(v);
    onValuesChange({ volume: v });
  }, []);

  const handleAudiometric = useCallback((voiceCode, disabled = false) => {
    if (disabled) return;
    audiometric(voiceCode);
  }, []);

  return (
    <Fragment>
      <DrawerContent padding="12px 32px 32px">
        <Row className="mb-12">
          <Label>{_t('dtY7SBbeCwXFwFVejMc3xB')}</Label>
          <Container>
            <TooltipWrapper
              disabledOnMobile
              title={isMuted ? _t('hHfajogbrRaitYGZaSixGa') : _t('jt31JEQzMyAdzqwuCfwa7N')}
            >
              <SvgComponent
                size={20}
                fileName="toolbar"
                color={colors.icon60}
                type={isMuted ? 'sound-muted' : 'sound-open'}
                className="pointer horizontal-flip-in-arabic"
                onClick={() => onValuesChange({ muted: !isMuted })}
              />
            </TooltipWrapper>
            <Slider
              min={0}
              step={1}
              max={100}
              className="ml-8"
              style={{ width: 100 }}
              onChange={handleChangeSlider}
              value={isMuted ? 0 : realVolume}
              tipProps={{ placement: 'bottom' }}
            />
          </Container>
        </Row>
        {SOUND_SETTINGS.map(({ key, label, children }, index) => {
          return (
            <div key={key}>
              {index > 0 && <Divider style={{ margin: '16px 0' }} />}
              <Describe style={{ padding: '8px 0' }}>{label()}</Describe>
              {children.map((item) => {
                const disabled = getFuturesLiquidState({
                  isFuturesTradeType,
                  alertSettings,
                  dataKey: item.key,
                });
                return (
                  <Row key={item.key}>
                    <div>
                      {item.voiceCodes?.length === 1 ? (
                        <Container>
                          <Label className="mr-8">{item.label()}</Label>
                          <TooltipWrapper
                            disabled={disabled}
                            disabledOnMobile
                            title={disabled ? _t('disabled') : _t('2Fak75xUm2Rmtqw5PKYfMY')}
                          >
                            <ICAnnouncementOutlined
                              size={12}
                              color={colors.icon40}
                              className="pointer horizontal-flip-in-arabic"
                              onClick={() => handleAudiometric(item.voiceCodes[0], disabled)}
                            />
                          </TooltipWrapper>
                        </Container>
                      ) : (
                        <Label>{item.label()}</Label>
                      )}
                      <Describe className="mt-8">{item.describe()}</Describe>
                    </div>
                    <Switch
                      disabled={disabled}
                      onChange={(v) => onValuesChange({ [item.key]: v })}
                      checked={
                        isBoolean(soundReminderSettings?.[item.key])
                          ? soundReminderSettings[item.key]
                          : item.initialValue
                      }
                    />
                  </Row>
                );
              })}
            </div>
          );
        })}
      </DrawerContent>
      <DrawerFooter>
        <Button onClick={onOk}>{_t('confirmed')}</Button>
      </DrawerFooter>
    </Fragment>
  );
});

export default SoundReminder;
