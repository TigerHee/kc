/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-11-18 15:56:31
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-26 15:14:30
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/SpotlightR8Record/index.js
 * @Description:
 */
import { styled } from '@kux/mui';
import isNil from 'lodash/isNil';
import { memo } from 'react';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { skip2Login } from 'TradeActivity/utils';
import Header from 'TradeActivityCommon/AppHeader';
import List from './List.js';

const StyledPage = styled.main``;

function RecordPage() {
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const isLogin = useSelector((state) => state.user.isLogin);

  // 优先判断登录
  if (!isLogin && !isNil(isLogin)) {
    skip2Login();
  }

  return (
    <StyledPage id="spotlightR8RecordPage">
      <NoSSG>
        <Header title={_t('2a183e74427f4000ad5b')} theme={currentTheme} />
      </NoSSG>
      <List />
    </StyledPage>
  );
}

export default memo(RecordPage);
