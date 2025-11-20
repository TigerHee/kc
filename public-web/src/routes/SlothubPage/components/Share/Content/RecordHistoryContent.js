/*
 * @Date: 2024-06-05 10:26:41
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 01:59:32
 */
/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-05 01:34:17
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-05 11:32:16
 */
import { css } from '@emotion/css';
import { useLocale } from '@kucoin-base/i18n';
import { px2rem } from '@kux/mui/utils';
import numberFormat from '@kux/mui/utils/numberFormat';
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'src/tools/i18n';

import { MiddleTip } from './MiddleTip';
import {
  ContentWrap,
  RecordCoinRewardImg,
  RecordCoinRewardItem,
  RecordCoinRewardWrap,
  RecordGrayTip,
  RecordHistoryMultiTimesTitle,
  RecordHistorySubtitle,
  RecordHistoryTitle,
} from './styled';
const RewardItem = ({ prizeInfo }) => {
  const { currency, amount } = prizeInfo || {};
  const { currentLang } = useLocale();

  const coinCategories = useSelector((state) => state.categories);
  const { iconUrl, currencyName } = coinCategories?.[currency] || {};

  const formatAmount = useMemo(() => {
    const str = `${numberFormat({
      number: amount,
      lang: currentLang,
    })}`;

    return str.length > 9 ? str.slice(0, 8) + '...' : str;
  }, [currentLang, amount]);

  return (
    <RecordCoinRewardItem>
      <RecordCoinRewardImg>
        <img className="coin-img" src={iconUrl} alt="coin-img" />
      </RecordCoinRewardImg>
      <section className="content">
        <span className="size">{formatAmount}</span>
        <span className="coin">{currencyName}</span>
      </section>
    </RecordCoinRewardItem>
  );
};

const SHOW_LIST_LEN = 6;
const RecordCoinRewardList = ({ list }) => {
  const groups = useMemo(() => {
    return list?.slice(0, SHOW_LIST_LEN)?.reduce((acc, item, index) => {
      const groupIndex = Math.floor(index / 3);
      if (!acc[groupIndex]) {
        acc[groupIndex] = [];
      }
      acc[groupIndex].push(item);
      return acc;
    }, []);
  }, [list]);
  const moreThanOneRow = groups?.length > 1;
  const moreThanTwo = list?.length > 2;

  return (
    <RecordCoinRewardWrap moreThanOneRow={moreThanOneRow} moreThanTwo={moreThanTwo}>
      {groups?.map((group, idx) => (
        <div className="row-wrap" key={idx}>
          {group?.map((info, itemIdx) => (
            <RewardItem prizeInfo={info} key={itemIdx} />
          ))}
        </div>
      ))}
    </RecordCoinRewardWrap>
  );
};

const RecordHistoryContent = ({ data }) => {
  const { prizeList, joinCount = 10 } = data;
  return (
    <ContentWrap>
      {joinCount > 0 ? (
        <RecordHistoryMultiTimesTitle>
          {_tHTML(`c58a0ac3461e4000a2bf`, { x: joinCount })}
        </RecordHistoryMultiTimesTitle>
      ) : (
        <>
          <RecordHistoryTitle>{_t('f1cab5baf4564000a5f4')}</RecordHistoryTitle>
          <RecordHistorySubtitle>{_t('c95e2fa8f9884000a0ea')}</RecordHistorySubtitle>
        </>
      )}

      <RecordCoinRewardList list={prizeList} />

      <RecordGrayTip>{_t('61c5ccb3e0354000ae94')}</RecordGrayTip>
      <MiddleTip
        className={css`
          margin-top: ${px2rem(24)};
        `}
      />
    </ContentWrap>
  );
};

export default RecordHistoryContent;
