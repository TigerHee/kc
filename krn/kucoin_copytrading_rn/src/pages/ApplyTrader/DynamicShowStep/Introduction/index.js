import React from 'react';
import {css} from '@emotion/native';
import {RichLocale, useTheme} from '@krn/ui';

import bannerLight from 'assets/applyTrade/apply-trade-banner-light.png';
import Button from 'components/Common/Button';
import useLang from 'hooks/useLang';
import {useLoginStatusLoading} from 'hooks/useWithLoginFn';
import PrivilegeDesc from '../../components/PrivilegeDesc';
import {ApplyTraderCommonScrollWrap} from '../styles';
import {useClickIntro} from '../useClick';
import {
  ApplyTraderWrap,
  BannerImg,
  BottomBtnArea,
  GreenSubTitle,
  IntroTitleCard,
  SubTitle,
  Title,
} from './styles';

import bannerDark from '/assets/applyTrade/apply-trade-banner-dark.png';

const Introduction = () => {
  const {_t} = useLang();
  const {gotoApplyPage} = useClickIntro();
  const {type} = useTheme();
  const isLoading = useLoginStatusLoading();

  return (
    <ApplyTraderWrap>
      <ApplyTraderCommonScrollWrap>
        <IntroTitleCard>
          <BannerImg
            source={type === 'light' ? bannerLight : bannerDark}
            autoRotateDisable
          />
          <Title>{_t('76c1b248d1b64000a2ee')}</Title>
          <SubTitle>
            <RichLocale
              message={_t('5c71affd3feb4000ad86', {
                num: 15, // 一期写死 15%
              })}
              renderParams={{
                TAG: {
                  component: GreenSubTitle,
                },
              }}
            />
          </SubTitle>
        </IntroTitleCard>

        <PrivilegeDesc
          style={css`
            padding: 0 16px;
          `}
        />
      </ApplyTraderCommonScrollWrap>
      <BottomBtnArea>
        <Button size="large" loading={isLoading} onPress={gotoApplyPage}>
          {_t('40de81cf17434000abc7')}
        </Button>
      </BottomBtnArea>
    </ApplyTraderWrap>
  );
};

export default Introduction;
