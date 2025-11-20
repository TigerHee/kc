/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import AssetsBar from './AssetsBar';

import { FUTURES_TRIAL_COUPONS, styled, withYScreen } from '../../builtinCommon';

import { CompliantRule } from '../../builtinComponents';
import Coupons from '../TrialFund/Coupons';
import TrialFundSwitch from '../TrialFund/TrialFundSwitch';

const InfoToolsWrapper = withYScreen(styled.div`
  margin-bottom: 16px;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    margin-bottom: 5px;
  `)}
`);

const TrialFundSwitchBox = withYScreen(styled(TrialFundSwitch)`
  margin-bottom: 8px;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    margin-bottom: 5px;
  `)}
`);

const AssetsBarBox = withYScreen(styled(AssetsBar)`
  margin-bottom: 8px;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
  margin-bottom: 5px;
`)}
`);

const InfoTools = () => {
  return (
    <InfoToolsWrapper>
      <CompliantRule ruleId={FUTURES_TRIAL_COUPONS}>
        <TrialFundSwitchBox />
      </CompliantRule>
      <AssetsBarBox />
      <CompliantRule ruleId={FUTURES_TRIAL_COUPONS}>
        <Coupons />
      </CompliantRule>
    </InfoToolsWrapper>
  );
};

export default React.memo(InfoTools);
