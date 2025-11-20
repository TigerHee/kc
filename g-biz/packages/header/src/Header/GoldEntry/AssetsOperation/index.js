/**
 * Owner: solar@kupotech.com
 * 运营位
 */

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { multiply } from '@utils/math';
import { map } from 'lodash';
// import { _tHTML } from 'tools/i18n';
import { useTranslation, Trans } from '@tools/i18n';

import { styled } from '@kux/mui/emotion';
import Carousel from '../../../components/ResponsiveCarousel';

const TOP = 'topCurrency'; // 最热币种
const INCREASE = 'increase24'; // 24h涨幅最大币种

const OperationBar = styled.div`
  margin: 24px 0;
`;

const OperationItem = styled.div`
  font-weight: 400;
  font-size: 14px;
  height: 45px;
  display: flex !important;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text40};
  > div span span {
    color: ${({ theme }) => theme.colors.primary};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const ResponsiveCarousel = ({ operationList, onOperation }) => {
  const props = useTranslation('header');
  console.log('====props', props);
  const textMap = {
    [TOP]: (trend) => (
      <Trans i18nKey="jFHvmtVrtfmkKmFu7kLVsz" ns="header" values={{ coin: trend }} />
    ),
    // [TOP]: (trend) => _tHTML('jFHvmtVrtfmkKmFu7kLVsz', { coin: trend }),
    [INCREASE]: (trend) => (
      <Trans
        i18nKey="aFdksuVRsyAUzcq866TqrA"
        ns="header"
        values={{
          coin: trend?.name,
          percent: `${multiply(trend?.changeRate, 100, 2)}`,
        }}
      />
    ),
  };
  const carouselConfig = {
    autoplay: true, // 自动播放
    dots: false, // 指示点
    arrows: false, // 切换箭头
    vertical: true, // 垂直切换
    adaptiveHeight: true, // 自适应高度
  };

  return (
    <Carousel {...carouselConfig}>
      {map(operationList, ({ key, items }) => (
        <OperationItem key={key} onClick={() => onOperation({ key, items })}>
          <div>
            {String.fromCodePoint(128161)}
            {textMap[key] ? textMap[key](items[0] || '') : null}
          </div>
        </OperationItem>
      ))}
    </Carousel>
  );
};

const AssetsOperation = () => {
  const dispatch = useDispatch();
  const trends = useSelector((state) => state.overview?.operationTrends);

  const operationList = useMemo(() => {
    if (trends && Object.keys(trends).length) {
      return map(Object.keys(trends), (key) => ({
        key,
        items: trends[key],
      }));
    }
    return [];
  }, [trends]);

  useEffect(() => {
    dispatch({
      type: 'overview/getOperationTrends',
    });
  }, []);

  const operations = {
    [TOP]: {
      spm: ['recommendAsset', '2'],
      getCoin: (currency) => currency,
      getHref: (currency) => `/assets/coin/${currency || 'USDT'}`,
    },
    [INCREASE]: {
      spm: ['recommendAsset', '1'],
      getCoin: (item) => item.item,
      getHref: (currency) => `/price/${currency || 'USDT'}`,
    },
  };

  const handleOperation = ({ key, items }) => {
    if (operations[key]) {
      const {
        // spm = [],
        getHref = () => null,
        getCoin = () => null,
      } = operations[key] || {};
      const coin = getCoin(items[0]);
      const href = getHref(coin);
      //   trackClick(spm, { coin });
      //   composeSpmAndSave(href, spm);
      window.location.href = href;
    }
  };

  return (
    <OperationBar>
      {operationList && operationList.length ? (
        <ResponsiveCarousel operationList={operationList} onOperation={handleOperation} />
      ) : null}
    </OperationBar>
  );
};

export default React.memo(AssetsOperation);
