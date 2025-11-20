/**
 * Owner: odan.ou@kupotech.com
 */
import { useMemo, useEffect, useRef } from 'react';
import fp from 'lodash/fp';
import isEmpty from 'lodash/isEmpty';
import { useSelector, shallowEqual } from 'react-redux';
import { useDispatch } from 'dva';
import useIsMobile from '@/hooks/common/useIsMobile';

// #region 提取接口中的信息，复制于 public-web/src/routes/PricePage/CoinInfo/Preview/helper.js
const processContent = (arr = []) => {
  const [question, ...answer] = arr;
  return {
    question: question.text,
    answer: question?.type === 'RICHTEXT' ? [question] : answer,
  };
};

const zipContent = (arr = []) => {
  let index = -1;
  return fp.reduce((prev, curr) => {
    const result = prev;
    const isSingleNode = curr.type === 'TITLE' || curr.type === 'RICHTEXT';
    if (isSingleNode) {
      index += 1;
      result[index] = [curr];
    } else {
      result[index] = [...(result[index] || []), curr];
    }
    return result;
  }, {})(arr);
};

// 提取内容段落
const contentHandler = (contentArr) => {
  const zippedArr = fp.pipe(zipContent, fp.map(processContent))(contentArr);
  return zippedArr;
};

// #endregion

const useCoinInfo = (coin) => {
  const { coinInfo, currentSymbol: usedSymbol } = useSelector(
    ({ symbols, trade: { currentSymbol } }) => {
      return {
        coinInfo: symbols.coinInfo,
        currentSymbol,
      };
    },
    shallowEqual,
  );
  const { currencyIntroduction = [] } = coinInfo || {};

  const hasDataCountRef = useRef(1);
  useMemo(() => {
    if (isEmpty(coinInfo) || !String(usedSymbol).startsWith(coin)) {
      hasDataCountRef.current += 1;
    }
  }, [coinInfo, coin, usedSymbol]);

  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const sourceType = isMobile ? 'H5' : 'WEB';
  const dataCount = hasDataCountRef.current;
  useEffect(() => {
    dispatch({
      type: 'symbols/getCoinInfo',
      payload: {
        source: sourceType,
      },
    });
  }, [sourceType, dataCount, dispatch]);

  const contentArr = useMemo(() => {
    return contentHandler(currencyIntroduction);
  }, [currencyIntroduction]);

  return useMemo(() => {
    const briefIntroTitle = contentArr?.[0]?.answer?.[0]?.text?.replace(/↵/g, ''); // 取第一个值
    const briefIntroText = contentArr?.[0]?.answer?.[0]?.subText?.replace(/↵/g, ''); // 取第一个值
    return {
      ...coinInfo,
      contentArr,
      hasData: !!coinInfo,
      introduce_text: briefIntroText, // 取第一个值
      briefIntroTitle,
      briefIntroText,
      currentSymbol: usedSymbol,
    };
  }, [coinInfo, contentArr, usedSymbol]);
};

export default useCoinInfo;
