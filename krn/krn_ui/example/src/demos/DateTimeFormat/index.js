import React from 'react';
import styled from '@emotion/native';
import { DateTimeFormat as DateTimeTest } from '@krn/ui';

const Content = styled.View`
  flex-direction: column;
`;
const Wrapper = styled.View``;
const DateTimeFormat = styled(DateTimeTest)`
  color: ${({ theme }) => theme.colorV2.primary};
`;
const TestTnText = styled.Text`
  color: ${({ theme }) => theme.colorV2.primary};
`;
const TestTnText2 = styled.Text``;

export default () => {
  return (
    <Content>
      {/* 29/3/2023, 22.42.02 */}
      <Wrapper>
        <DateTimeFormat lang="id_ID">2023/03/29 22:42:02</DateTimeFormat>
      </Wrapper>

      {/* 29/3/2023, 22.42.02 */}
      <Wrapper>
        <TestTnText>
          {DateTimeTest.dateTimeFormat({
            lang: 'id_ID',
            date: '2023/03/29 22:42:02',
          })}
        </TestTnText>
      </Wrapper>

      {/* ২৯/৩/২০২৩, ২২:৪২:০২ */}
      <Wrapper>
        <DateTimeFormat lang="bn_BD">2023/03/29 22:42:02</DateTimeFormat>
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
              {DateTimeTest.dateTimeFormat({
                lang,
                date: Date.now(),
              })}
            </TestTnText>
          </Wrapper>
        );
      })}
    </Content>
  );
};
