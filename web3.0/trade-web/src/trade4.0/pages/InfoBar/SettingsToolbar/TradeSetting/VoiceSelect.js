/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment, useRef } from 'react';
import Select from '@mui/Select';
import { SelectVoiceItem } from './style';
import { map } from 'lodash';
import { _t } from 'utils/lang';
import Beep from '@/components/Beep';

/**
 * VoiceSelect
 */
const VoiceSelect = (props) => {
  const { title, voiceConfig = [], ...restProps } = props;
  const cancelTimeout = useRef();

  const handleMouseEnter = (voice) => {
    cancelTimeout.current = setTimeout(() => {
      Beep({ src: voice });
    }, 500);
  };

  const handleMouseLeave = () => {
    if (cancelTimeout.current) {
      clearTimeout(cancelTimeout.current);
      cancelTimeout.current = null;
    }
  };

  return (
    <Fragment>
      <Select
        allowSearch
        emptyContent
        searchIcon={false}
        size="medium"
        labelProps={{ shrink: true }}
        options={map(voiceConfig, ({ key, value, voice, label }) => {
          const _label = typeof label === 'function' ? label() : label;
          if (voice) {
            return {
              label: (inInput) => (
                <SelectVoiceItem
                  onMouseEnter={() => handleMouseEnter(voice)}
                  onMouseLeave={() => handleMouseLeave}
                >
                  {label}
                  {!inInput && (
                    <span className="listening">
                      {_t('orders.voice.listen')}
                    </span>
                  )}
                </SelectVoiceItem>
              ),
              value,
              key,
            };
          } else {
            return {
              label: _label,
              value,
              key,
            };
          }
        })}
        {...restProps}
      />
    </Fragment>
  );
};

export default memo(VoiceSelect);
