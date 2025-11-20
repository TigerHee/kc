import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';

import {H5Links} from 'constants/h5-link';
import {mediumHitSlop} from 'constants/index';
import {openH5Link} from 'utils/native-router-helper';
import {AgreementLinkText} from './styles';

export const PressAgreementLink = props => {
  return (
    <TouchableWithoutFeedback
      hitSlop={mediumHitSlop}
      onPress={() => openH5Link(H5Links.copyTradeAgreement)}>
      <AgreementLinkText {...props} />
    </TouchableWithoutFeedback>
  );
};

export const PressRiskLink = props => (
  <TouchableWithoutFeedback
    hitSlop={mediumHitSlop}
    onPress={() => openH5Link(H5Links.copyRiskAgreement)}>
    <AgreementLinkText {...props} />
  </TouchableWithoutFeedback>
);
