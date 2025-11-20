/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { _t, styled, CONFIRM_CONFIG, PRICE_DEVIATION_KEY } from '../../builtinCommon';
import { ButtonGroup, PreferencesCheckbox } from '../../builtinComponents';

const BodyWrapper = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text60};
`;

const PriceGapRisk = ({ onClose, onOk }) => {
  return (
    <>
      <BodyWrapper>{_t('order.validate.dialogtext')}</BodyWrapper>
      <PreferencesCheckbox type={CONFIRM_CONFIG} value={PRICE_DEVIATION_KEY} />
      <ButtonGroup onClose={onClose} onOk={onOk} />
    </>
  );
};

export default React.memo(PriceGapRisk);
