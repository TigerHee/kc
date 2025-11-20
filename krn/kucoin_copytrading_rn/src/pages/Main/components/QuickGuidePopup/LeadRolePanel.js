import React, {memo, useMemo, useState} from 'react';
import styled, {css} from '@emotion/native';

import leadPanelFirstImg from 'assets/help/2-1.png';
import darkLeadPanelFirstImg from 'assets/help/2-1-dark.png';
import leadPanelThirdImg from 'assets/help/2-3.png';
import darkLeadPanelThirdImg from 'assets/help/2-3-dark.png';
import leadPanelFourthImg from 'assets/help/2-4.png';
import leadPanelFifthImg from 'assets/help/2-5.png';
import leadPanelSixthImg from 'assets/help/2-6.png';
import leadPanelSevenThImg from 'assets/help/2-7.png';
import leadPanelEightThImg from 'assets/help/2-8.png';
import leadSetImg from 'assets/help/lead-setting.png';
import Table from 'components/Common/Table';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {ContentImage} from './components/ContentImage';
import {Panel} from './components/Panel';
import {PrefixPointWrap} from './components/PrefixPointWrap';
import Tabs from './components/Tabs';
import {useMakeLeadPanelTableConfig} from './hooks/useMakeLeadPanelTableConfig';
import {
  ActionType,
  leaderRiskManageList,
  LeadPanelContentFragmentMap,
} from './constant';
import {BaseText, ContentSubTitle, ContentTitle, Text60} from './styles';

const StyledContentSubTitle = styled(ContentSubTitle)`
  margin-bottom: 12px;
`;

const StyledBaseText = styled(BaseText)`
  margin-bottom: 12px;
`;

const {
  leadRuleAttentionFragment,
  leadShareProfitRuleFragment,
  shareProfitSettleTip,
} = LeadPanelContentFragmentMap;

const LeadRolePanel = () => {
  const {_t} = useLang();
  const isLight = useIsLight();

  const [actionType, setActionType] = useState(ActionType.Open);
  const {ruleTableConfig, shareProfitExample} = useMakeLeadPanelTableConfig({
    actionType,
  });

  const switchList = useMemo(() => {
    return [
      {
        label: _t('57bc7fdc0ca24000ab53'),
        value: ActionType.Open,
      },
      {
        label: _t('9f7f8ee5677d4000aced'),
        value: ActionType.Close,
      },
    ];
  }, [_t]);

  return (
    <Panel>
      <ContentTitle>{_t('2024eeeabc374000a751')}</ContentTitle>

      <Tabs
        style={css`
          margin-top: 12px;
        `}
        options={switchList}
        value={actionType}
        onChange={setActionType}
      />

      <Table
        containerStyle={css`
          margin: 12px 0;
        `}
        {...ruleTableConfig}
      />
      {leadRuleAttentionFragment.map(({text, hasPrefixPoint}) =>
        hasPrefixPoint ? (
          <PrefixPointWrap key={text}>
            <Text60>{_t(text)}</Text60>
          </PrefixPointWrap>
        ) : (
          <Text60 key={text}>{_t(text)}</Text60>
        ),
      )}

      <ContentTitle
        style={css`
          margin-top: 24px;
        `}>
        {_t('7e9b47ed75cd4000a6e7')}
      </ContentTitle>

      <ContentSubTitle
        style={css`
          margin: 16px 0;
        `}>
        {_t('cc007ca47c534000a0fa')}
      </ContentSubTitle>

      <StyledBaseText>{_t('090077e779504000afaf')}</StyledBaseText>
      <StyledBaseText>{_t('9dbbfa313ecb4000ad63')}</StyledBaseText>
      <ContentImage
        width={343}
        height={129}
        source={isLight ? leadPanelFirstImg : darkLeadPanelFirstImg}
        style={css`
          margin-bottom: 16px;
        `}
      />

      <StyledBaseText>{_t('787dd2f132d04000a893')}</StyledBaseText>
      <ContentImage
        width={343}
        height={61}
        style={css`
          margin-bottom: 16px;
        `}
        source={isLight ? leadPanelThirdImg : darkLeadPanelThirdImg}
        hiddenPaddingColor
      />
      <StyledBaseText>{_t('e0d5d58f44b04000ae74')}</StyledBaseText>
      <ContentImage
        width={343}
        height={208}
        style={css`
          margin-bottom: 16px;
        `}
        source={leadPanelFourthImg}
      />
      <StyledBaseText>{_t('00ee5cdc44514000ab95')}</StyledBaseText>

      <ContentImage width={343} height={183} source={leadPanelFifthImg} />

      <ContentSubTitle
        style={css`
          margin: 16px 0 12px;
        `}>
        {_t('2ab4566ce0614000aabc')}
      </ContentSubTitle>

      <StyledBaseText>{_t('bdabc8d5fbd44000ab69')}</StyledBaseText>
      <ContentImage
        width={343}
        height={114}
        source={leadPanelSixthImg}
        style={css`
          margin-bottom: 12px;
        `}
      />

      <StyledBaseText>{_t('e8cd0cb56fc34000a787')}</StyledBaseText>
      <ContentImage
        width={343}
        height={110}
        style={css`
          margin-bottom: 12px;
        `}
        source={leadPanelSevenThImg}
      />
      <ContentImage width={343} height={83} source={leadSetImg} />
      <ContentSubTitle
        style={css`
          margin: 16px 0 12px;
        `}>
        {_t('c3e1d19e05944000aea6')}
      </ContentSubTitle>

      {leaderRiskManageList.map(({label, value}) => (
        <PrefixPointWrap isBlack key={label}>
          <BaseText>
            {_t(label)}
            <Text60>{` ${_t(value)}`}</Text60>
          </BaseText>
        </PrefixPointWrap>
      ))}

      <StyledContentSubTitle
        style={css`
          margin-top: 16px;
        `}>
        {_t('75466a97ce204000af29')}
      </StyledContentSubTitle>
      <StyledBaseText>{_t('0477fdac1bf44000aba7')}</StyledBaseText>
      {leadShareProfitRuleFragment.map(key => (
        <PrefixPointWrap key={key}>
          <Text60>{_t(key)}</Text60>
        </PrefixPointWrap>
      ))}

      <StyledBaseText>{_t('d313b96fd7034000aacb')}</StyledBaseText>
      {shareProfitSettleTip.map(key => (
        <PrefixPointWrap key={key}>
          <Text60 key={key}>{_t(key)}</Text60>
        </PrefixPointWrap>
      ))}

      <StyledBaseText
        style={css`
          margin-top: 16px;
        `}>
        {_t('d5486116b3be4000adee')}
      </StyledBaseText>

      <Table
        containerStyle={css`
          margin: 16px 0;
        `}
        {...shareProfitExample}
      />
      <ContentSubTitle
        style={css`
          margin: 16px 0 12px;
        `}>
        {_t('161c8b8609e74000af28')}
      </ContentSubTitle>
      <StyledBaseText>{_t('c216bf5922d14000a637')}</StyledBaseText>

      <ContentImage width={343} height={188} source={leadPanelEightThImg} />
    </Panel>
  );
};

export default memo(LeadRolePanel);
