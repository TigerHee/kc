/**
 * Owner: brick.fan@kupotech.com
 */
import Alert from '@/components/mui/Alert';
import Spin from '@/components/mui/Spin';
import Tooltip from '@/components/mui/Tooltip';
import { styled } from '@/style/emotion';

import CoinPrecision from '@/components/CoinPrecision';
import { endsWith } from 'lodash';
import Decimal from 'decimal.js';
import React, { memo, useMemo, Fragment } from 'react';
import { queryCurrencyInfo } from 'services/leveragedTokens';
import { _t, addLangToPath } from 'utils/lang';
import Item from './Item';
import { htmlToReactSync } from '@/utils/htmlToReactSync';
import useRequest from '@/hooks/common/useRequest';
import Common from './Common';

const ContentBox = styled.div`
  color: ${(props) => props.theme.colors.text};
  padding: 16px;
  font-size: 14px;
  font-weight: 500;
  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
  }
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  line-height: 130%;
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 18px;
  font-weight: 700;
`;

const TitleDesc = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  margin-left: 8px;
`;

const Intro = styled.div`
  margin-top: 24px;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
`;

const MarginIntroTitleLine = styled(TitleLine)`
  margin-top: 24px;
  margin-bottom: 8px;
`;

const AlertBox = styled.div`
  margin-top: 10px;
`;

const AlertTitle = styled.div`
  font-size: 12px;
  line-height: 130%;
`;

const TooltipWrapper = styled.div`
  max-width: 216px;
`;

const TooltipTitle = styled.div`
  border-bottom: 1px dashed;
`;

const ExtraBox = styled.div`
  margin-top: 16px;
`;

/**
 * @decription 小数转百分比
 */
export const toPercent = (a, sign = '%') => {
  return `${new Decimal(a).mul(100).toFixed()}${sign}`;
};
/**
 * @decription 是否动态倍数
 */
const isDynamic = (code) => ['UP', 'DOWN'].some((v) => endsWith(code, v));

const renderLeverage = (leverage) => `${leverage || '-'}X`;

// 杠杆类型
const MaginFund = ({ symbol }) => {
  const { data: res, loading } = useRequest(
    () => queryCurrencyInfo({ currencyCode: symbol }),
    {
      refreshDeps: [symbol],
      cacheKey: `info_${symbol}`,
      staleTime: 8 * 60 * 60 * 1000, // 8hours
    },
  );
  const { data } = res || {};

  const basketValue = useMemo(() => {
    if (!data?.assets?.length) {
      return '-';
    }

    return data?.assets?.map((item, index) => {
      const flag = item?.assetSize > 0 ? '+' : '';

      return (
        <span key={index}>
          {flag}<CoinPrecision coin={item?.assetName} value={item?.assetSize} />{' '}
          {_t(item?.assetType === 'future' ? 'tokenInfo.news.futures' : 'tokenInfo.spot', {
            name: item?.assetName,
          })}
        </span>
      );
    });
  }, [data]);

  const leverageValue = useMemo(() => {
    const { code, multiple, leverage } = data || {};
    const _multiple = isDynamic(code) ? '2.00-4.00' : multiple;
    // 动态写死 2.00-4.00X
    return `${renderLeverage(_multiple)} / ${renderLeverage(leverage)}`;
  }, [data]);

  return (
    <Spin spinning={loading} size="small">
      <ContentBox>
        <TitleLine>
          <Title>{symbol}</Title>
          <TitleDesc>
            {_t(
              data?.buyType === 'S'
                ? 'tokenInfo.etf.token.desc.short'
                : 'tokenInfo.etf.token.desc.long',
              {
                multiple: data?.multiple,
                currency: data?.originalCurrencyName,
              })
            }
          </TitleDesc>
        </TitleLine>
        <AlertBox>
          <Alert
            type="warning"
            title={
              <AlertTitle>
                {htmlToReactSync(
                  _t('tokenInfo.etf.alert.tip', {
                    host: addLangToPath('/support/categories/6024330782489-Leveraged-Token'),
                  }),
                )}
              </AlertTitle>
            }
          />
        </AlertBox>
        <MarginIntroTitleLine>
          <Title>{_t('tokenInfo.etf.introduction')}</Title>
        </MarginIntroTitleLine>
        <Intro>
          <Fragment>{_t(data?.buyType === 'S'
            ?
            'tokenInfo.etf.introduction.content.short'
            :
            'tokenInfo.etf.introduction.content.long', {
            code: symbol,
            multiple: data?.multiple,
            originalCurrency: data?.originalCurrencyName,
          })}
            <br />{_t('tokenInfo.etf.introduction.content2')}
            <br />{_t('jsgZamnCgQMtTVs6fD2cR7')}
          </Fragment>
        </Intro>
        <div style={{ marginTop: 24 }}>
          <Item label={_t('tokenInfo.etf.assets.management')} value={data?.assertManagement} />
          <Item
            label={
              <Tooltip
                placement="top"
                title={
                  <TooltipWrapper>{_t('tokenInfo.etf.information.basket.tip')}</TooltipWrapper>
                }
              >
                <TooltipTitle>{_t('tokenInfo.etf.information.basket')}</TooltipTitle>
              </Tooltip>
            }
            value={basketValue}
          />
          <Item
            label={_t('tokenInfo.etf.information.issuedSize')}
            value={data?.currentCirculation}
            unit={data?.quoteCurrency}
            formatNumber
          />
          <Item
            label={_t('8su1YQt2dtJTQMj93kxP82')}
            value={leverageValue}
            unit={data?.quoteCurrency}
            formatNumber
          />
          <Item
            label={
              <Tooltip
                placement="top"
                title={
                  <TooltipWrapper>
                    {_t('tokenInfo.etf.information.managementFee.tip', {
                      time: data?.payManagementFeeTime || '07:45:00(UTC+8)',
                    })}
                  </TooltipWrapper>
                }
              >
                <TooltipTitle>{_t('tokenInfo.etf.information.managementFee')}</TooltipTitle>
              </Tooltip>
            }
            value={toPercent(data?.dailyManageFee || 0)}
          />
        </div>
        <ExtraBox>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={addLangToPath(`/leveraged-tokens/detail/${symbol}`)}
          >
            {_t('tokenInfo.etf.information.disclosure.view')}
          </a>
        </ExtraBox>
      </ContentBox>
    </Spin>
  );
};

const TokenInfo = ({ symbol, type }) => {
  return type === 'MARGIN_FUND' ? <MaginFund symbol={symbol} /> : <Common symbol={symbol} />;
};

export default memo(TokenInfo);
