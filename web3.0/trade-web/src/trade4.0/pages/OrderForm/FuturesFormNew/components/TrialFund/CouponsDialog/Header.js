/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import { RightOutlined } from '@kux/icons';

import { ReactComponent as MoneyIcon } from '@/assets/trialFund/money.svg';

import { _tHTML, addLangToPath, siteCfg, styled } from '../../../builtinCommon';

import { useIsRTL, useTrialFundDetail, useWatchHidden } from '../../../builtinHooks';

const HeaderBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.complementary8};
  border-radius: 20px;
  height: 40px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const RadioBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.layer};
  z-index: 2;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: -4px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.complementary20};
`;

const TextBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0 20px 20px 0;
  padding: 0 12px 0;
  width: 100%;
  > svg {
    transform: ${(props) => (props.isRtl ? 'scaleX(-1)' : 'initial')};
  }
`;

const TextBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  white-space: normal;
  word-break: break-word;
  > span > span {
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CouponsHeader = () => {
  const trialFundDetail = useTrialFundDetail();
  const watchHidden = useWatchHidden();
  const isRtl = useIsRTL();

  const handleGoBonus = useCallback(() => {
    window.location.href = addLangToPath(`${siteCfg.KUMEX_HOST}/bonus`);
  }, []);

  if (!trialFundDetail || !trialFundDetail.activateNum || watchHidden) return null;

  return (
    <HeaderBox onClick={handleGoBonus}>
      <RadioBox>
        <IconBox>
          <MoneyIcon />
        </IconBox>
      </RadioBox>
      <TextBar isRtl={isRtl}>
        <TextBox>{_tHTML('trialFund.activate.tips', { num: trialFundDetail.activateNum })}</TextBox>
        <RightOutlined />
      </TextBar>
    </HeaderBox>
  );
};

export default React.memo(CouponsHeader);
