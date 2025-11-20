/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { useResponsive } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
import halving from 'static/bitcoin-halving/halving.svg';
import halvingsm from 'static/bitcoin-halving/halvingsm.svg';
import Video from '../Video';
import TimeLine from '../TimeLine';
import PriceStats from '../PriceStats';
import Steps from '../Steps';
import Cards from '../Cards';
import Reading from '../Reading';
import Activity from '../Activity';
import FAQs from 'components/Landing/FAQs';
import { getLearnArticleDetail, getBlogDetail, getCategoryList } from 'services/bitcoinHalving';
import { readingList } from '../Reading/config';
import { faqs } from './config';
import {
  Wrapper,
  Title,
  SubTitle,
  ModuleTitle,
  VideoWrapper,
  Paragraph,
  Chapter,
  SpacingChapter,
  Image,
  FAQwrapper,
} from './index.style';

const { KUCOIN_HOST } = siteConfig;

export default () => {
  const responsive = useResponsive();
  const { isLogin } = useSelector((state) => state.user);
  const [list, setList] = useState([]);
  const [topicMap, setTopicMap] = useState({});

  useEffect(() => {
    const param = {
      type: 'topic',
      flag: true,
    };
    getCategoryList(param).then((res) => {
      if (res?.success && res?.data) {
        const obj = {};
        res.data.map((i) => {
          obj[i.topicsEnglishName] = i.name;
        });
        setTopicMap(obj);
      }
    });
  }, []);

  useEffect(() => {
    const promise = readingList.map((item) => {
      if (item.type === 'learn') {
        return getLearnArticleDetail({ title: item.title });
      }
      return getBlogDetail({ title: item.title });
    });
    Promise.allSettled(promise).then((resList) => {
      const list = [];
      resList.forEach((item, index) => {
        if (item.status === 'fulfilled') {
          const resData = item.value;
          if (resData?.success && resData?.data) {
            list.push({
              ...resData.data,
              title: resData.data?.articleDetailTitle || resData.data?.title,
              picUrl: resData.data?.picUrl || (resData.data?.images && resData.data?.images[0]),
              updatedAt: resData.data?.updatedAt || resData.data?.publish_ts,
              articleUrl: resData.data?.articleUrl || readingList[index].url,
            });
          }
        }
      });
      setList(list);
    });
  }, []);

  return (
    <Wrapper>
      <Chapter>
        <Title>{_t('7Hj14X1y1YNVniJuYq3m7U')}</Title>
        {responsive.sm && <SubTitle>{_t('iGnyxRf7AUwUGzrc3QXxur')}</SubTitle>}
        <VideoWrapper>
          <Video video="https://www.youtube.com/embed/9UGREQn7jDY" />
        </VideoWrapper>
        {!responsive.sm && <SubTitle>{_t('iGnyxRf7AUwUGzrc3QXxur')}</SubTitle>}
      </Chapter>
      <SpacingChapter mt={140}>
        <Title>{_t('szuFkSetnc5c6DFzmSaVy2')}</Title>
        <SubTitle>{_t('jupEquKeeihunzCEWzjmBi')}</SubTitle>
        <TimeLine />
      </SpacingChapter>
      <SpacingChapter mt={120}>
        <Title>{_t('ssUq44aZYaMFEbWuWXGjXh')}</Title>
        <Paragraph>
          {_tHTML('vjjmmnWTnFRbBy8KGnDUaC', {
            url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/market-cap`),
            marketurl: addLangToPath(
              `${KUCOIN_HOST}/learn/trading/sentiment-analysis-in-crypto-trading-a-beginners-guide`,
            ),
            coinurl: addLangToPath(
              `${KUCOIN_HOST}/learn/trading/a-beginners-guide-to-the-bitcoin-stock-to-flow-model`,
            ),
          })}
        </Paragraph>
        <Paragraph>{_t('4imetJTK5PEX9jFR2GLX2L')}</Paragraph>
        <Image src={responsive.lg ? halving : halvingsm} alt="btc-halving" />
        <ModuleTitle>{_t('qczZNm7MWHXxWz4ZNtt1Mv')}</ModuleTitle>
        <PriceStats />
      </SpacingChapter>
      <SpacingChapter mt={140}>
        <Title>{_t('wJU6Ffinbs2ivmCobvZi3v')}</Title>
        <SubTitle>{_t('5uyg219oYYuBybX5mCL5Af')}</SubTitle>
        <Steps />
        <ModuleTitle>{_t('hY2dD9Q7h1C9dTdYLs5D8T')}</ModuleTitle>
        <Paragraph>{_t('97rDn5c8r9axPurnUZSTRp')}</Paragraph>
        <Cards />
      </SpacingChapter>
      <Activity />
      {list && list.length && (
        <SpacingChapter mt={120}>
          <Title>{_t('8KcJE5avQxTckdPd9xNafD')}</Title>
          <Reading list={list} topicMap={topicMap} />
        </SpacingChapter>
      )}
      <SpacingChapter mt={120}>
        <Title>{_t('ryexw3HuFDhivWiBgquRzt')}</Title>
        <FAQwrapper>
          <FAQs faqs={faqs} bgTheme="black" />
        </FAQwrapper>
      </SpacingChapter>
    </Wrapper>
  );
};
