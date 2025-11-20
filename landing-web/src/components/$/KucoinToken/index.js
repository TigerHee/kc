/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';
import { Button } from '@kufox/mui';
import Bg_en from 'assets/KucoinToken/bg_en.png';
import Bg_zh from 'assets/KucoinToken/bg_zh.png';
import { _t } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import siteCfg from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import styles from './style.less';

const KCSToken = () => {
  const { currentLang, isInApp } = useSelector(state => state.app);
  const url = addLangToPath(`${siteCfg.MAINSITE_HOST}/trade/KCS-USDT`);

  const getKCS = (e) => {
    e.preventDefault();
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/trade?symbol=KCS-USDT`,
        },
      });
      return;
    }
    const newTab = window.open();
    newTab.opener = null;
    newTab.location = url;
  };

  return (
    <div className={styles.root} data-inspector="kucoinTokenPage">
      <img inspector="kcs_img" src={currentLang === 'zh_CN' ? Bg_zh : Bg_en} alt="" />

      <Button inspector="get_kcs" as="a" href={url} className={styles.button} onClick={getKCS}>
        {_t('kcs.get')}
      </Button>
    </div>
  );
};

export default KCSToken;
