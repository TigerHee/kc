/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import Header from 'TradeActivityCommon/AppHeader';
import { StyledHeader } from './styledComponents';

const ListPageHeader = memo(({ title, extra = null }) => {
  const history = useHistory();
  const isInApp = JsBridge.isApp();

  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  if (isInApp) {
    return (
      <NoSSG>
        <Header title={title} theme={currentTheme} />
      </NoSSG>
    );
  }

  return (
    <StyledHeader>
      <div role="button" tabIndex="0" className="left" onClick={handleBack}>
        <ICArrowRight2Outlined />
        {title}
      </div>
      {extra}
    </StyledHeader>
  );
});

export default ListPageHeader;
