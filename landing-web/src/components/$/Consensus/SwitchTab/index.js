/**
 * Owner: jesse.shao@kupotech.com
 */
import { NewTabs as Tabs } from '@kufox/mui';
import React, { useState, useCallback } from 'react';
import { omit } from 'lodash/fp';
import IndividualInvestors from '../IndividualInvestors';
import InstitutionalInvestors from '../InstitutionalInvestors';
import Listing from '../Listing';
import Partnership from '../Partnership';
import Community from '../Community';
import { SWITCH_TAB_MAP } from '../config';
import styles from './style.less';

const { Tab } = Tabs;
const INIT_SELECT = 0;
const componentsMap = [
  { component: IndividualInvestors },
  { component: InstitutionalInvestors },
  { component: Listing },
  { component: Partnership },
  { component: Community },
];

const SwitchTab = () => {
  const [tabValue, setTabValue] = useState(INIT_SELECT);
  const renderContent = useCallback(() => {
    return (
      <div>
        {componentsMap.map((obj, index) => {
          const el = SWITCH_TAB_MAP[index];
          const Com = obj.component;

          return (
            <div key={el.label} style={{ display: index === tabValue ? 'block' : 'none' }}>
              <Com index={tabValue} config={omit(['component'], el)} />
            </div>
          );
        })}
      </div>
    );
  }, [tabValue]);

  return (
    <div className={styles.tabOut}>
      <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)}>
        {SWITCH_TAB_MAP.map(el => {
          return <Tab label={el.label} key={el.label} className={styles.tab} />;
        })}
      </Tabs>
      <>{renderContent()}</>
    </div>
  );
};

export default React.memo(SwitchTab);
