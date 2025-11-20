/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { NumberFormat } from '@kux/mui';
import { useLocale } from '@kucoin-base/i18n';
import { useSelector } from 'src/hooks/useSelector';
import { DateTimeFormat } from 'utils/seoTools';
import {
  Wrapper,
  LineItem,
  Title,
  Content,
  ContentWrapper,
  TextWrapper,
  SubTitle,
  SubContent,
} from './index.style';

export default ({ estimatedTime, removingHeight, langText }) => {
  const { tradeData } = useSelector((state) => state.bitcoinHalving);
  const { currentLang } = useLocale();

  return (
    <Wrapper langText={langText}>
      <LineItem>
        <Title>{_t('byH4MwmXNcs1g9DFFS5ePe')}</Title>
        <TextWrapper>
          <Content>
            {estimatedTime
              ? DateTimeFormat({
                  lang: currentLang,
                  date: estimatedTime,
                  options: { dateStyle: 'long' },
                })
              : '--'}
          </Content>
          <SubTitle ml={12}>
            {estimatedTime
              ? DateTimeFormat({
                  lang: currentLang,
                  date: estimatedTime,
                  options: { timeStyle: 'medium' },
                })
              : '--'}
            <span>（GMT+8）</span>
          </SubTitle>
        </TextWrapper>
      </LineItem>
      <LineItem border center>
        <Title>{_t('voQW1AQPjJN5nu7ksdJfzQ')}</Title>
        <ContentWrapper>
          <Content>{removingHeight}</Content>
          <SubContent ml={12}>
            {_t('ozciZoNvuSU7yVkkx1CMAJ')}&nbsp;
            <NumberFormat
              options={{
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
              lang={currentLang}
            >
              840000
            </NumberFormat>
          </SubContent>
        </ContentWrapper>
      </LineItem>
      <LineItem border center>
        <Title>{_t('7u23TXHVRRW6Mo4cW37jNW')}</Title>
        <ContentWrapper>
          <Content>
            {tradeData?.price ? (
              <React.Fragment>
                $
                <NumberFormat
                  options={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                  lang={currentLang}
                >
                  {tradeData?.price}
                </NumberFormat>
              </React.Fragment>
            ) : (
              '--'
            )}
          </Content>
        </ContentWrapper>
      </LineItem>
    </Wrapper>
  );
};
