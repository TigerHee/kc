/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import { ThemeProvider, NewTabs as Tabs } from '@kufox/mui';
import { styled } from '@kufox/mui/emotion';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'utils/lang';
import MyRace from 'components/$/CryptoCup/MyRace';
import MyIntegral from 'components/$/CryptoCup/MyIntegral';
import SucBlindboxModal from 'components/$/CryptoCup/BlindboxAwardModal/Suc';
import FailBlindboxModal from 'components/$/CryptoCup/BlindboxAwardModal/Fail';
import { CupMain, Wrapper, Page } from 'components/$/CryptoCup/common/StyledComps';
import NormalHeader from 'components/$/CryptoCup/common/NormalHeader';

const { Tab } = Tabs;

const MyPage = styled(Page)`
  min-height: 100vh;
  background: #f7f8fb;
`;

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid rgba(0, 13, 29, 0.08);

  & [role='tablist'] {
    padding: 0 16px;

    & + span {
      display: none;
    }
  }

  & [aria-selected='false'] {
    color: ${props => props.theme.colors.text40};
  }

  & [aria-selected='true'] {
    position: relative;
    color: ${props => props.theme.colors.text};

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      height: 4px;
      width: 24px;
      background: #2dc985;
      border-radius: 2px;
    }
  }
`;

const MyDataPage = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = useCallback((e, _tab) => {
    setTab(_tab);
  }, []);

  return (
    <ThemeProvider>
      <Wrapper>
        <MyPage>
          <NormalHeader title={_t('rbZM3vV8RZV5sbRQyfHTt7')} />
          <StyledTabs value={tab} onChange={handleTabChange}>
            <Tab value={0} label={_t('5bBbWGsYnTMwQqULhQVAHw')} />
            <Tab value={1} label={_t('c6pDQfaq1i47hwvCjwd46p')} />
          </StyledTabs>
          <CupMain>{tab === 0 ? <MyRace /> : <MyIntegral />}</CupMain>
        </MyPage>
        <SucBlindboxModal isSimple />
        <FailBlindboxModal isSimple />
      </Wrapper>
    </ThemeProvider>
  );
};

export default brandCheckHoc(MyDataPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
