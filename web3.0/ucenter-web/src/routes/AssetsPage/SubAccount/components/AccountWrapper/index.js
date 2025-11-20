/**
 * Owner: solar@kupotech.com
 */
import { Tab, Tabs } from '@kux/mui';
import { useCallback, useState } from 'react';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import { SUB_ACCOUNT_MAP } from 'src/routes/AccountPage/SubAccount/config';
import { _t } from 'tools/i18n';

const useTabs = () => {
  const [activeTab, setActiveTab] = useState('main');
  return [
    activeTab,
    useCallback((e, value) => {
      setActiveTab(value);
    }, []),
  ];
};

function TabsWrapper({ multiSiteConfig, children: renderFn }) {
  const subUserPermissions = (multiSiteConfig?.accountConfig?.subUserPermissions || []).map((p) =>
    p.toLowerCase(),
  );

  const [activeTab, setActiveTab] = useTabs();
  return (
    <>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="bordered"
        type="normal"
        activeType="primary"
        size="medium"
        showScrollButtons={false}
      >
        {Object.values(SUB_ACCOUNT_MAP)
          .flatMap((key) => {
            if (subUserPermissions.includes(key.toLowerCase())) {
              switch (key) {
                case SUB_ACCOUNT_MAP.spot:
                  return [
                    <Tab key="main" label={_t('main.account')} value="main" />,
                    <Tab key="trade" label={_t('trade.account')} value="trade" />,
                  ];
                case SUB_ACCOUNT_MAP.margin:
                  return <Tab key={'margin'} label={_t('margin.margin.account')} value="margin" />;
                case SUB_ACCOUNT_MAP.futures:
                  return <Tab key={'futures'} label={_t('margin.account')} value="futures" />;
                case SUB_ACCOUNT_MAP.option:
                  return <Tab key={'option'} label={_t('ecdf35ac6b904000a464')} value="option" />;
                default:
                  return null;
              }
            }
            return null;
          })
          .filter(Boolean)}
      </Tabs>
      {renderFn(activeTab)}
    </>
  );
}

export default withMultiSiteForbiddenPage(TabsWrapper);
