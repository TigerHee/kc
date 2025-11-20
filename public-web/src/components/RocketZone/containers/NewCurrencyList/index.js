/**
 * Owner: jessie@kupotech.com
 */
import { memo } from 'react';
import { _t } from 'tools/i18n';
import NewCurrencyTable from './NewCurrencyTable';
import { StyledNewCurrencyList } from './styledComponents';

function NewCurrencyList() {
  return (
    <StyledNewCurrencyList data-inspector="inspector_gemspace_newlisting_table">
      <div className="container">
        <h2 className="title">{_t('hfWDfRQkztQRi46XzGp1tH')}</h2>
        <NewCurrencyTable />
      </div>
    </StyledNewCurrencyList>
  );
}

export default memo(NewCurrencyList);
