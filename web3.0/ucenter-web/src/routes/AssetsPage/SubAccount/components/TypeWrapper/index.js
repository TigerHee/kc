/**
 * Owner: solar@kupotech.com
 */
import { styled, Tab, Tabs } from '@kux/mui';
import { useCallback, useState } from 'react';
import { _t } from 'tools/i18n';
import { SubAccountCommonWrapper } from '../StyledComponents';
const useTabs = () => {
  const [activeTab, setActiveTab] = useState(TYPES.CURRENCY);
  return [
    activeTab,
    useCallback((e, value) => {
      setActiveTab(value);
    }, []),
  ];
};

export const TYPES = {
  CURRENCY: 'currency',
  ACCOUNT: 'account',
};

const TypeWrapperRoot = styled(SubAccountCommonWrapper)`
  .type-wrapper-tabs {
    margin-bottom: 8px;
  }
`;

export function TypeWrapper({ children: renderFn }) {
  const [activeTab, setActiveTab] = useTabs();
  return (
    <TypeWrapperRoot>
      <Tabs
        className="type-wrapper-tabs"
        value={activeTab}
        onChange={setActiveTab}
        variant="line"
        indicator={false}
        showScrollButtons={false}
        size="large"
      >
        <Tab label={_t('5pFDUiMWatgckrnStDTWmf')} value={TYPES.CURRENCY} />
        <Tab label={_t('as1BsgsURUCW6mTPrEtiv8')} value={TYPES.ACCOUNT} />
      </Tabs>
      {renderFn(activeTab)}
    </TypeWrapperRoot>
  );
}
