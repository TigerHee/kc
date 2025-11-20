import {KRNEventEmitter, openNative, showToast} from '@krn/bridge';

import {Button} from '@krn/ui';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  LeftSlot,
  MHeaderMajor,
  RightCloseSlot,
} from 'components/Common/NavIcons';
import useIconSrc from 'hooks/useIconSrc';
import useLang from 'hooks/useLang';
import React, {useEffect} from 'react';
import * as serv from 'services/kyc_th';
import {getNativeInfo} from 'utils/helper';

import {
  Body,
  Content,
  ContentBox,
  ContentBoxOutter,
  ContentItem,
  ContentText,
  Dot,
  Footer,
  Intro,
  ItemBox,
  ItemLogo,
  ItemTitle,
  ItemTitleLine,
  Main,
  StepTitle,
  Title,
} from './style';

export default () => {
  const {_t} = useLang();
  const route = useRoute();
  const {type, method} = route.params;
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  // 是不是外国人
  const isForeign = type === 'foreign';

  const step1Src = useIconSrc('step1');
  const step2Src = useIconSrc('step2');
  const step3Src = useIconSrc('step3');

  const ListThai = [
    {
      logo: step1Src,
      title: _t('1c42f759dc614000a194'),
      requires: [_t('4ec354e98fd54000ac22'), _t('831b31384be54000add1')],
    },
    {
      logo: step2Src,
      title: _t('5e79a9b9caf64000a6f5'),
      requires: [_t('9f511f5c03444000a634'), _t('615504b817604000a141')],
    },
    {
      logo: step3Src,
      title: _t('c67f59ca835c4000a69a'),
      requires: [_t('41bf3f8afb734000ade1')],
    },
  ];

  const ListForeign = [
    {
      logo: step1Src,
      title: _t('1c42f759dc614000a194'),
      requires: [_t('90cfa1fecf574000a2fd')],
    },
    {
      logo: step2Src,
      title: _t('5e79a9b9caf64000a6f5'),
      requires: [_t('f754ff4084454000ae7c'), _t('690626bf2d624000ab30')],
    },
    {
      logo: step3Src,
      title: _t('c67f59ca835c4000a69a'),
      requires: [_t('41bf3f8afb734000ade1')],
    },
  ];

  const List = isForeign ? ListForeign : ListThai;

  useEffect(() => {
    const subscription = KRNEventEmitter.addListener('onShow', () => {
      navigation.popToTop();
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  const onHandleNext = async () => {
    setLoading(true);
    let standardAlias;
    try {
      const {success, data} = await serv.getComplianceConfig();
      if (success) {
        const {kycStandardThaiId, kycStandardNdId, kycStandardThForeign} =
          data?.standardAliasMap || {};
        if (isForeign) {
          standardAlias = kycStandardThForeign;
        } else if (method === 'thaid') {
          standardAlias = kycStandardThaiId;
        } else if (method === 'ndid') {
          standardAlias = kycStandardNdId;
        }
      }
    } catch (e) {
      setLoading(false);
      showToast(e?.msg || e?.message || '');
      return;
    }

    try {
      const {success} = await serv.recordSelect({
        standardAlias,
        kycType: 1,
      });
      if (success) {
        const {webApiHost} = await getNativeInfo();
        const url = `https://${webApiHost}/account-compliance?complianceType=${standardAlias}&loading=2&dark=true&needLogin=true&appNeedLang=true`;
        setLoading(false);
        openNative(`/link?url=${encodeURIComponent(url)}`);
      }
    } catch (e) {
      setLoading(false);
      showToast(e?.msg || e?.message || '');
    }
  };

  return (
    <Body>
      <MHeaderMajor leftSlot={<LeftSlot />} rightSlot={<RightCloseSlot />} />
      <Main>
        <Title>{_t('3f421e4f183d4000aa1d')}</Title>
        <Intro>{_t('df4226c87db54000a4e5')}</Intro>
        <StepTitle>{_t('e1fac51415ce4000ac47')}</StepTitle>
        {List.map((item, index) => (
          <ItemBox key={item.title}>
            <ItemTitleLine>
              <ItemLogo source={item.logo} />
              <ItemTitle>{item.title}</ItemTitle>
            </ItemTitleLine>
            <ContentBoxOutter>
              <ContentBox isLast={index === List.length - 1}>
                <Content>
                  {item.requires.map((require, i) => (
                    <ContentItem
                      key={require}
                      isLast={i === item.requires.length - 1}>
                      <Dot />
                      <ContentText>{require}</ContentText>
                    </ContentItem>
                  ))}
                </Content>
              </ContentBox>
            </ContentBoxOutter>
          </ItemBox>
        ))}
      </Main>
      <Footer>
        <Button
          onPress={onHandleNext}
          size="large"
          disabled={loading}
          loading={
            loading
              ? {
                  spin: true,
                  color: '#fff',
                  size: 'xsmall',
                  style: {marginLeft: 0},
                }
              : {}
          }>
          {_t('1fd30e6024d64000a1f0')}
        </Button>
      </Footer>
    </Body>
  );
};
