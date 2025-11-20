/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-11-18 15:56:31
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-26 15:14:30
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR7/SpotlightR7Record/index.js
 * @Description:
 */
import { styled } from '@kux/mui';
import { memo } from 'react';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { skip2Login } from 'TradeActivity/utils';
import Header from 'TradeActivityCommon/AppHeader';
import List from './List.js';

const StyledPage = styled.main``;

export const BaseContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
  }
`;

function RecordPage() {
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const isLogin = useSelector((state) => state.user.isLogin);

  // 优先判断登录
  if (!isLogin) {
    skip2Login();
  }

  return (
    <StyledPage id="spotlightR7RecordPage">
      <NoSSG>
        <Header title={_t('a5bb60195ae04000a1b6')} theme={currentTheme} />
      </NoSSG>
      <BaseContainer>
        <List />
      </BaseContainer>
    </StyledPage>
  );
}

export default memo(RecordPage);
