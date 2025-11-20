/**
 * Owner: kevyn.yu@kupotech.com
 */
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSnackbar } from '@kux/mui-next';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/assets/coinDetail/coin-info-link.svg';
import Copy from '@/assets/coinDetail/copy.svg';
// import { ReactComponent as FaIcon } from '@/assets/coinDetail/facebook.svg';
// import { ReactComponent as GitIcon } from '@/assets/coinDetail/github.svg';
// import { ReactComponent as MdIcon } from '@/assets/coinDetail/medium.svg';
// import { ReactComponent as RdIcon } from '@/assets/coinDetail/reddit.svg';
// import { ReactComponent as TgIcon } from '@/assets/coinDetail/telegram.svg';
// import { ReactComponent as TwIcon } from '@/assets/coinDetail/twitter.svg';
// import { ReactComponent as YuIcon } from '@/assets/coinDetail/youtube.svg';
import TwIcon from '@/assets/coinDetail/twitter.svg';
import TgIcon from '@/assets/coinDetail/telegram.svg';
import YuIcon from '@/assets/coinDetail/youtube.svg';
import FaIcon from '@/assets/coinDetail/facebook.svg';
import GitIcon from '@/assets/coinDetail/github.svg';
import RdIcon from '@/assets/coinDetail/reddit.svg';
import MdIcon from '@/assets/coinDetail/medium.svg';
import styles from './style.module.scss';
import clsx from 'clsx';
import { trackClick } from 'gbiz-next/sensors';
import useTranslation from '@/hooks/useTranslation';
import { useCoinDetailStore } from '@/store/coinDetail';
import { saTrackForBiz } from '@/tools/ga';

const ExtendTwIcon = () => <img src={TwIcon} className={styles.icon} />;
const ExtendTgIcon = () => <img src={TgIcon} className={styles.icon} />;
const ExtendYuIcon = () => <img src={YuIcon} className={styles.icon} />;
const ExtendFaIcon = () => <img src={FaIcon} className={styles.icon} />;
const ExtendGitIcon = () => <img src={GitIcon} className={styles.icon} />;
const ExtendRdIcon = () => <img src={RdIcon} className={styles.icon} />;
const ExtendMdIcon = () => <img src={MdIcon} className={styles.icon} />;

//link埋点
const linkArr = ['Web', 'Doc', 'Explorer', 'Community'];


export default () => {
  const { _t } = useTranslation();
  const coinInfo = useCoinDetailStore((state) => state.coinInfo);
  const { message } = useSnackbar();
  const elRef = useRef<(HTMLUListElement | null)[]>(new Array(linkArr.length).fill(null));
  const [storageIdList, setStorageIdList] = useState<string[]>([]);
  
  useEffect(() => {
    let observer;

    if (elRef.current.length > 0) {
      //列表曝光埋点
      observer = new IntersectionObserver(
        (entries) => {
          (entries || []).map((e) => {
            if (e.intersectionRatio > 0) {
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              const key: string = e.target?.dataset?.key;
              if (storageIdList.some((item) => item === key)) return;
              try {
                const urls =
                  key === 'Web'
                    ? coinInfo.website
                    : key === 'Doc'
                    ? coinInfo.doc
                    : key === 'Explorer'
                    ? coinInfo.explorer
                    : coinInfo.codeAndCommunity;

                saTrackForBiz({}, ['currencyMoreInformation', '2'], {
                  position: key,
                  pagecate: 'url',
                  url: (urls || []).join(';'),
                  yesOrNo: 0,
                });
                let newList = storageIdList;
                newList.push(key);
                setStorageIdList(newList);
              } catch (e) {
                console.log('e', e);
              }
            }
          });
        },
        { threshold: [0.1] },
      );

      (elRef.current || []).map((item) => {
        if (item) observer.observe(item);
      });
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [elRef.current.length, coinInfo]);

  //合约埋点

  const contractRef = useRef(null);
  let showContractRef = false;
  useEffect(() => {
    let observer;
    if (contractRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.map((e) => {
            if (e.intersectionRatio > 0 && !showContractRef) {
              try {
                saTrackForBiz({}, ['currencyMoreInformation', '3']);
                showContractRef = true;
              } catch (e) {
                console.log('e', e);
              }
            }
          });
        },
        { threshold: [0.1] },
      );

      if (contractRef.current) observer.observe(contractRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [contractRef.current]);

  const getUrlPrefix = (href) => {
    try {
      const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
      const matchObj = href.match(reg);
      if (matchObj) {
        return matchObj[2].replace(/^www./, '');
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const formatContract = (str) => {
    try {
      if (!str) return '';
      if (str.length < 8) return str;
      let [contract, sit = ''] = str.split(':');
      return (
        <span>
          {contract} <span className={styles.span}>{sit.slice(0, 8) + '...' + sit.slice(-3)}</span>
        </span>
      );
    } catch (error) {
      return '';
    }
  };

  // in: BSC:0xdAC17F958D2ee523a2206206994597C13D831ec7
  // out: 0xdAC17F958D2ee523a2206206994597C13D831ec7
  const getContract = (str) => {
    try {
      if (!str) return '';
      return str.split(':')[1];
    } catch (error) {
      return '';
    }
  };

  const LinkRender = (data: string[] | null, src?: string, type?: string) => {
    if (data && data.length > 0) {
      if (src) {
        return data.map((i, index) => (
          <li key={`${index}-${i}`}>
            <a
              className={clsx(styles.linkTag, styles.extendLink)}
              // style={{ background: `url(${src})` }}
              href={i}
              onClick={(e) => {
                if (type) {
                  try {
                    const reg = new RegExp(`.+kucoin.+\/kucoins`);
                    trackClick(['currencyMoreInformation', '2'], {
                      position: type,
                      pagecate: 'url',
                      url: i,
                      yesOrNo: reg.test(i) ? 1 : 0,
                    });
                  } catch (e) {
                    console.log('e', e);
                  }
                }
                e.preventDefault();
                typeof window !== 'undefined' && window.open(i, '_blank');
              }}
              key={`${index}-${i}`}
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              {getUrlPrefix(i) || i}
            </a>
          </li>
        ));
      }
      return data.map((i) => <li className={styles.tag} key={i}>{i}</li>);
    } else {
      return <li className={styles.blank}>--</li>;
    }
  };

  const ContractRender = (data) => {
    if (data && data.length > 0) {
      return data.map((i) => (
        <li key={i}>
          <CopyToClipboard
            key={i}
            text={getContract(i)}
            onCopy={() => {
              try {
                trackClick(['currencyMoreInformation', '3']);
              } catch (e) {
                console.log('e', e);
              }
              message.success(_t('copy.succeed'));
            }}
          >
            <span
              className={clsx(styles.tag, styles.contractTag)}
              // style={{ background: `url(${Copy})` }}
              key={i}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {formatContract(i) || i}
            </span>
          </CopyToClipboard>
        </li>
      ));
    } else {
      return <li className={styles.blank}>--</li>;
    }
  };

  const IconRender = (data) => {
    if (data && data.length > 0) {
      const onClick = (i) => {
        try {
          trackClick(['currencyMoreInformation', '2'], {
            position: 'Code & Community',
            pagecate: 'url',
            url: i,
            yesOrNo: 0,
          });
        } catch (e) {
          console.log('e', e);
        }
      };
      return data.map((i) => {
        return i.includes('facebook') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="facebook"
            >
              <ExtendFaIcon />
            </a>
          </li>
        ) : i.includes('youtube') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="youtube"
            >
              <ExtendYuIcon />
            </a>
          </li>
        ) : i.includes('twitter') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="twitter"
            >
              <ExtendTwIcon />
            </a>
          </li>
        ) : i.includes('telegram') || i.includes('t.me') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="telegram"
            >
              <ExtendTgIcon />
            </a>
          </li>
        ) : i.includes('github') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="github"
            >
              <ExtendGitIcon />
            </a>
          </li>
        ) : i.includes('reddit') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="reddit"
            >
              <ExtendRdIcon />
            </a>
          </li>
        ) : i.includes('medium') ? (
          <li key={i}>
            <a className={styles.iconLink}
              key={i}
              href={i}
              rel="noopener noreferrer nofollow"
              target="_blank"
              onClick={() => {
                onClick(i);
              }}
              data-ssg="medium"
            >
              <ExtendMdIcon />
            </a>
          </li>
        ) : (
          ''
        );
      });
    } else {
      return <li className={styles.blank}>--</li>;
    }
  };

  return (
    <ul className={styles.wrapper}>
      <li className={styles.row}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.website')}</h4>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ul className={styles.text} ref={(ref) => (elRef.current[0] = ref)} data-key="Web">
          {LinkRender(coinInfo.website, Icon, 'Web')}
        </ul>
      </li>
      <li className={styles.row}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.doc')}</h4>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ul className={styles.text} ref={(ref) => (elRef.current[1] = ref)} data-key="Doc">
          {LinkRender(coinInfo.doc, Icon, 'Doc')}
        </ul>
      </li>
      <li className={styles.row}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.explorer')}</h4>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ul className={styles.text} ref={(ref) => (elRef.current[2] = ref)} data-key="Explorer">
          {LinkRender(coinInfo.explorer, Icon, 'Explorer')}
        </ul>
      </li>
      <li className={styles.row} ref={contractRef}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.contract')}</h4>
        <ul className={styles.text} data-ssg="contract">
          {ContractRender(coinInfo.contract)}
        </ul>
      </li>
      <li className={styles.row}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.audit')}</h4>
        <ul className={styles.text} data-ssg="audit">
          {LinkRender(coinInfo.auditAgency)}
        </ul>
      </li>
      <li className={styles.row}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.code.community')}</h4>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ul className={styles.text} ref={(ref) => (elRef.current[3] = ref)} data-key="Community">
          {IconRender(coinInfo.codeAndCommunity)}
        </ul>
      </li>
      <li className={styles.row}>
        <h4 className={styles.label}>{_t('coin.detail.coin.info.investor')}</h4>
        <ul className={styles.text} data-ssg="investor">
          {LinkRender(coinInfo.investor)}
        </ul>
      </li>
    </ul>
  );
};