import React from 'react';
import styled from '@emotion/native';
import { NumberFormat as NumberTest } from '@krn/ui';

const Content = styled.View`
  flex-direction: column;
`;
const Wrapper = styled.View``;
const NumberFormat = styled(NumberTest)`
  color: ${({ theme }) => theme.colorV2.primary};
`;
const TestTnText = styled.Text`
  color: ${({ theme }) => theme.colorV2.primary};
`;
const TestTnText2 = styled.Text``;

export default () => {
  return (
    <Content>
      {/* 1.999.999,9999 */}
      <Wrapper>
        <NumberFormat lang="id_ID">1999999.9999</NumberFormat>
      </Wrapper>

      {/* 1.999.999,9999 */}
      <Wrapper>
        <TestTnText>
          {NumberTest.numberFormat({
            lang: 'ar_AE',
            number: 1999999.9999,
          })}
        </TestTnText>
      </Wrapper>

      {/* %12,35 */}
      <Wrapper>
        <TestTnText>
          {NumberTest.numberFormat({
            lang: 'ar_AE',
            number: 123456.789,
            // isPositive:true,
            // options: { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 },
          })}
        </TestTnText>
      </Wrapper>

      {/* ১৯,৯৯,৯৯৯.৯৯৯৯ */}
      <Wrapper>
        <NumberFormat lang="bn_BD">1999999.9999</NumberFormat>
      </Wrapper>

      {/* %25,8789 */}
      <Wrapper>
        <NumberFormat lang="tr_TR" options={{ style: 'percent' }}>
          0.258789
        </NumberFormat>
      </Wrapper>

      {[
        'de_DE',
        'en_US',
        'es_ES',
        'fr_FR',
        'hi_IN',
        'id_ID',
        'it_IT',
        'ko_KR',
        'ms_MY',
        'nl_NL',
        'pt_PT',
        'ru_RU',
        'tr_TR',
        'vi_VN',
        'zh_CN',
        'zh_HK',
        'ja_JP',
        'th_TH',
        'bn_BD',
        'fil_PH',
        'pl_PL',
        'ar_AE',
        'uk_UA',
      ].map((lang) => {
        return (
          <Wrapper key={lang}>
            <TestTnText2>{lang} : </TestTnText2>
            <TestTnText>
              {NumberTest.numberFormat({
                lang,
                number: 90958320.123456,
                // isPositive:true,
                options: { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 },
              })}
            </TestTnText>
            <TestTnText>---------- 负数 -----------</TestTnText>
            <TestTnText>
              {NumberTest.numberFormat({
                lang,
                number: -90958320.123456,
                // isPositive:true,
                options: { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 },
              })}
            </TestTnText>
          </Wrapper>
        );
      })}
    </Content>
  );
};
