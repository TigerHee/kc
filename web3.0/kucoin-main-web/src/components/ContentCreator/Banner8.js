/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { px2rem } from '@kufox/mui';
import { Box, Button } from '@kufox/mui';
import { useLocale } from '@kucoin-base/i18n';
import { TOC_TOB_LINK, TEXT_WIDTH } from './config';
import { _t, addLangToPath } from 'tools/i18n';
import { styled } from '@kufox/mui';
import bgImg from 'static/content-creator/kucoin-bg.svg';
import rfImg from 'static/content-creator/referral.svg';
import afImg from 'static/content-creator/affiliate.svg';

const Wrapper = styled(Box)`
  background: rgba(0, 20, 42, 0.04);
  margin: ${px2rem(80)} 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: ${px2rem(60)} 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: ${px2rem(40)} 0;
  }
`;

const Inner = styled(Box)`
  margin: 0 auto;
  width: 93.3%;
  max-width: ${px2rem(1344)};
  background: url(${bgImg}) no-repeat;
  background-size: contain;
  padding: ${px2rem(80)} 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: ${px2rem(60)} ${px2rem(24)};
    background: none;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(40)} ${px2rem(12)};
  }
`;

const Content = styled(Box)`
  margin: 0 auto;
  width: 89.3%;
  max-width: ${px2rem(1200)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
`;

const Title = styled.h2`
  width: 42%;
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #00142a;
  margin: 0 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    margin: 0 0 ${px2rem(44)} 0;
    text-align: center;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: 0 0 ${px2rem(40)} 0;
    font-size: ${px2rem(24)};
    line-height: ${px2rem(36)};
  }
`;

const FlexWrapper = styled(Box)`
  width: 48%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
`;

const FlexItem = styled(Box)`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const ReferralImage = styled.img`
  width: ${px2rem(100)};
`;

const AffiliateImage = styled.img`
  width: ${px2rem(100)};
  transform: translateY(${px2rem(-6)});
`;

const Text = styled.p`
  min-width: ${px2rem(100)};
  font-size: ${px2rem(20)};
  font-weight: 500;
  line-height: ${px2rem(32)};
  color: #000000;
  margin: ${px2rem(24)} 0;
  text-align: center;
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(16)};
    line-height: ${px2rem(24)};
  }
`;

const LinkButton = styled(Button)`
  min-width: ${px2rem(100)};
  min-height: ${px2rem(40)};
  font-size: ${px2rem(16)};
  &:hover {
    color: #fff;
  }
  ,
  ${(props) => props.theme.breakpoints.down('lg')} {
    min-height: ${px2rem(48)};
    font-size: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: ${px2rem(80)};
    min-height: ${px2rem(32)};
    font-size: ${px2rem(14)};
  }
`;

const Banner8 = () => {
  const { currentLang } = useLocale();

  return (
    <Wrapper>
      <Inner>
        <Content>
          <Title>{_t('creator.eighth.title')}</Title>
          <FlexWrapper>
            <FlexItem>
              <ReferralImage src={rfImg} alt="referral" />
              <AffiliateImage src={afImg} alt="affiliate" />
            </FlexItem>
            <FlexItem>
              <Text style={{ width: TEXT_WIDTH[currentLang] || '' }}>
                {_t('creator.eighth.referral')}
              </Text>
              <Text style={{ width: TEXT_WIDTH[currentLang] || '' }}>
                {_t('creator.eighth.affiliate')}
              </Text>
            </FlexItem>
            <FlexItem>
              <LinkButton as="a" href={addLangToPath(TOC_TOB_LINK['rf'])}>
                {_t('creator.eighth.btn')}
              </LinkButton>
              <LinkButton as="a" href={addLangToPath(TOC_TOB_LINK['af'])}>
                {_t('creator.eighth.btn')}
              </LinkButton>
            </FlexItem>
          </FlexWrapper>
        </Content>
      </Inner>
    </Wrapper>
  );
};

export default Banner8;
