import React from 'react';
import Home from 'components/KYC/Home/index';
import Home_TH from 'components/KYC_TH/Home/index';
import {Body, Main} from './style';
import useLang from 'hooks/useLang';
import {LeftSlot, RightSlot, Title, MHeader} from 'components/Common/NavIcons';
import * as site from 'site';

export default () => {
  const {_t} = useLang();
  return (
    <Body useOldBg={site.isTH}>
      <MHeader
        leftSlot={<LeftSlot />}
        title={<Title numberOfLines={1}>{_t('kyc.homepage.title')}</Title>}
        rightSlot={<RightSlot />}
        useOldBg={site.isTH}
      />
      <Main>{site.isTH ? <Home_TH /> : <Home />}</Main>
    </Body>
  );
};
