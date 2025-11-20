import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import CheckEmpty from '../components/CheckEmpty';
import ExtraCard from '../components/ExtraCard';
import PreferencePie from './PreferencePie';
import {usePullPreference} from './usePullPreference';

const Preference = () => {
  const {isLoading, currencyPreferenceData} = usePullPreference();
  const {_t} = useLang();

  return (
    <ExtraCard
      style={css`
        padding: 16px 0;
      `}
      titleWrapStyle={css`
        max-width: 58%;
      `}
      titleStyle={css`
        padding: 0 16px;
      `}
      title={_t('8ac76a01b5dc4000a1bc')}
      tip={_t('141d4af873934000a3d5')}>
      <CheckEmpty
        isLoading={isLoading}
        isEmpty={isEmpty(currencyPreferenceData)}>
        <PreferencePie currencyPreferenceData={currencyPreferenceData} />
      </CheckEmpty>
    </ExtraCard>
  );
};

export default Preference;
