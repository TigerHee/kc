/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 顶部守护者计划申明
 */

import clsx from 'clsx';
import BannerSvg from 'assets/guardian/trangle.png';
import BannerTitle from 'assets/guardian/banner_title.svg';
import BannerTitleEn from 'assets/guardian/banner_title_en.svg';
import BannerSubTitle from 'assets/guardian/banner_sub_title.svg';
import BannerSubTitleEn from 'assets/guardian/banner_sub_title_en.svg';

import { useIsMobile } from 'components/Responsive';
import { useSelector } from 'dva';

import RenderCMS from '../RenderCMS';
import { _t } from 'utils/lang';

import style from './style.less';

const ImageLangMap = {
  zh_CN: {
    BannerTitle: BannerTitle,
    BannerSubTitle: BannerSubTitle,
  },
  en_US: {
    BannerTitle: BannerTitleEn,
    BannerSubTitle: BannerSubTitleEn,
  },
};

export default () => {
  const { currentLang } = useSelector(state => state.app);
  const isMobile = useIsMobile();

  const langKey = currentLang === 'zh_CN' ? 'zh_CN' : 'en_US';

  return (
    <div
      className={clsx(
        style.banner,
        isMobile ? style.banner_h5 : '',
        langKey === 'zh_CN' ? '' : style.noLetterSpace,
      )}
    >
      <div
        inspector="title"
        className={style.title}
        style={{ backgroundImage: `url('${BannerSvg}')` }}
      >
        <img src={ImageLangMap[langKey].BannerTitle} alt="" />
        <div inspector="sub_title" className={style.subTitle}>
          {_t('guardian.security')}
        </div>
      </div>
      <div className={style.content}>
        <div>
          <img
            inspector="content_title"
            className={style.sub}
            src={ImageLangMap[langKey].BannerSubTitle}
            alt=""
          />
        </div>
        <div inspector="content_detail" className={style.detail}>
          <RenderCMS run="com.landing.guardian.meaning" />
        </div>
      </div>
      <div inspector="content_livings" className={style.livings}>
        <RenderCMS run="com.landing.guardian.livings" />
      </div>
    </div>
  );
};
