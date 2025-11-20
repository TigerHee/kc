/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'tools/i18n';

import Link from '../../../components/Link';
import userBoxStyles from '../../UserBox/styles.module.scss';

const Overlay = props => {
  const { inDrawer, isLong_language, currentLang, isSub, handleLogout } = props;

  const { t } = useTranslation('header');
  return (
    <div
      className={clsx(userBoxStyles.overlayWrapper, {
        [userBoxStyles.overlayWrapperInDrawer]: inDrawer,
        [userBoxStyles.overlayWrapperInTrade]: !inDrawer && props.inTrade,
        [userBoxStyles.overlayWrapperLongLanguage]: !inDrawer && isLong_language,
      })}
    >
      <Link
        onClick={handleLogout}
        className={clsx('center', userBoxStyles.menuItem, inDrawer && userBoxStyles.menuItemInDrawer)}
        data-modid="person"
        data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '10' : '9'}
      >
        {t('logout')}
      </Link>
    </div>
  );
};

export default Overlay;
