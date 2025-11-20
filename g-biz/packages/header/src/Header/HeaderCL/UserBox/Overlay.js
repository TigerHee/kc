/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { useLang } from '../../../hookTool';

import { MenuItem, OverlayWrapper } from '../../UserBox/styled';

const Overlay = (props) => {
  const { inDrawer, isLong_language, currentLang, isSub, handleLogout } = props;

  const { t } = useLang();
  return (
    <OverlayWrapper inDrawer={inDrawer} isLong_language={isLong_language}>
      <MenuItem
        onClick={handleLogout}
        className="center"
        data-modid="person"
        data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '10' : '9'}
        inDrawer={inDrawer}
      >
        {t('logout')}
      </MenuItem>
    </OverlayWrapper>
  );
};

export default Overlay;
