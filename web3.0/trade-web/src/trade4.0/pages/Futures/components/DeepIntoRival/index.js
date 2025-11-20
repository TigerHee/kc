/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';
import { styled } from '@/style/emotion';
import { useTheme } from '@kux/mui/hooks';

import SuspensionDark from '@/assets/toolbar/suspension_dark.png';
import SuspensionLight from '@/assets/toolbar/suspension_light.png';

import { _t } from 'utils/lang';
import { quantityPlaceholder } from '@/utils/futures';
import { CONFIRM_CONFIG } from '@/meta/futures';

import { getSymbolText } from '@/hooks/futures/useGetSymbolText';
import { MISOPERATION_KEY } from '@/pages/InfoBar/SettingsToolbar/TradeSetting/futuresConfig';

import ButtonGroup from './ButtonGroup';
import PreferencesCheckbox from '../PreferencesCheckbox';

const IconWarningBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const ContentBox = styled.div`
  h3 {
    font-size: 24px;
    color: ${(props) => props.theme.colors.text};
    line-height: 1.3;
    font-weight: 500;
    margin-top: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
  .deep,
  p {
    font-size: 14px;
    color: ${(props) => props.theme.colors.text60};
    text-align: center;
  }
`;

const DeepIntoRival = ({ values, side, onClose, onOk, ask1, bid1, symbolInfo }) => {
  const { base, type, settle } = getSymbolText(symbolInfo) || {};

  const prompt =
    side === 'sell'
      ? _t('position.bid.tips', { price: bid1 })
      : _t('position.ask.tips', { price: ask1 });

  const theme = useTheme();

  return (
    <>
      <IconWarningBox>
        <img
          width="148px"
          height="148px"
          src={theme.currentTheme === 'dark' ? SuspensionDark : SuspensionLight}
        />
      </IconWarningBox>
      <ContentBox>
        <h3>{_t('position.confirm.title')}</h3>
        <div className="deep">
          <div className="deepInfo">{_t('position.confirm.tips')}</div>
          <div className="deepPrompt">
            {_t(`position.confirm.dec.${side}`, {
              price: values.price,
              size: values.size,
              symbol: `${base}/${settle} ${type}`,
              tips: quantityPlaceholder(symbolInfo, _t),
            })}
          </div>
          <div className="deepPrompt">{prompt}</div>
          <PreferencesCheckbox type={CONFIRM_CONFIG} value={MISOPERATION_KEY} />
        </div>
      </ContentBox>
      <ButtonGroup
        onClose={onClose}
        onOk={onOk}
      />
    </>
  );
};

export default React.memo(DeepIntoRival);
