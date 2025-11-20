/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from 'components/Responsive';
import { useSelector } from 'dva';
import CrownIcon from 'assets/showcase/case/crown.svg';
import cls from 'clsx';
import { separateNumber } from 'helper';
import { QUESTDES_VOTE } from 'config';
import { _t, _tHTML } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import styles from './styles.less';
import H5Bg1 from 'assets/showcase/case/app3_1.jpg';
import H5Bg2 from 'assets/showcase/case/app3_2.jpg';
import H5Bg3 from 'assets/showcase/case/app3_3.jpg';
import WebBg1 from 'assets/showcase/case/web3_1.jpg';
import WebBg2 from 'assets/showcase/case/web3_2.jpg';
import WebBg3 from 'assets/showcase/case/web3_3.png';

const H5_BGS = [H5Bg1, H5Bg2, H5Bg3];
const WEB_BGS = [WebBg1, WebBg2, WebBg3];

const Card = ({ bg, logoUrl, name, prizePool, isComfort, prizePoolUnit }) => {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${bg})` }}>
      <div className={styles.label}>
        {
          logoUrl && (
            <div className={styles.icons}>
              <img src={CrownIcon} alt={name} className={styles.crownIcon} />
              <img src={logoUrl} alt={name} className={styles.coinImg} />
            </div>
          )
        }
        <div className={cls(styles.text, { [styles.noIcon]: !logoUrl })}>
          {isComfort ? _t('choice.vote.prize.share') : _tHTML('choice.case.card.des', { currency: name }) }
        </div>
      </div>
      <div className={cls(styles.currency, { [styles.noIcon]: !logoUrl })}>
        <div className={styles.mount}>{separateNumber(prizePool)}</div>
        <div className={styles.coin}>
          {prizePoolUnit}
        </div>
      </div>
    </div>
  );
};

const Case = ({ refreshScroll }) => {
  const currentLang = useSelector(state => state.app.currentLang);
  const isMobile = useIsMobile();
  const publishDetail = useSelector(state => state.showcase.publishDetail);
  const [tokens, setTokens] = useState([]);
  const isInApp = useSelector(state => state.app.isInApp);

  useEffect(() => {
    refreshScroll();
  }, [refreshScroll, tokens]);

  const handleClickMore = useCallback((e) => {
    e.preventDefault();
    const url = QUESTDES_VOTE[currentLang] || QUESTDES_VOTE.en_US;
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${url}`,
        }
      });
      return;
    }
    window.open(url, '_blank');
  }, [currentLang, isInApp]);

  useEffect(() => {
    if (!publishDetail.id) return;
    setTokens(publishDetail.tokens);
  }, [publishDetail]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.title}>{_tHTML('choice.case.title', { time: publishDetail.number })}</div>
        <div className={styles.desWrapper}>
          <div className={styles.des}>
            {tokens[0] ? tokens[0].name : '--'}
            <span className={styles.vs}>VS</span>
            {tokens[1] ? tokens[1].name : '--'}
          , {_t('choice.case.title.des')}</div>
          <a className={styles.more} href={QUESTDES_VOTE[currentLang] || QUESTDES_VOTE.en_US} onClick={handleClickMore}>{_t('choice.case.link')}</a>
        </div>
        <div className={styles.cards}>
          {
            map(tokens, (item, idx)=> (
              <Card {...item} key={idx} bg={isMobile ? H5_BGS[idx] : WEB_BGS[idx]}  />
            ))
          }
          {
           publishDetail.comfort !== '0' && <Card isComfort={true} prizePoolUnit={publishDetail.comfortUnit} prizePool={publishDetail.comfort} key='comfort' bg={isMobile ? H5_BGS[2] : WEB_BGS[2]} />
          }
        </div>
      </div>
    </div>
  );
}

export default Case;
