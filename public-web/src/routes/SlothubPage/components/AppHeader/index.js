/*
 * owner: borden@kupotech.com
 */
import { ICNoviceGuideOutlined, ICShareOutlined } from '@kux/icons';
import CommonAppHeader from 'components/TradeActivity/ActivityCommon/AppHeader';
import React from 'react';
import NoSSG from 'src/components/NoSSG';
import useActivityRules from './useActivityRules';
import useActivityShare from './useActivityShare';

const AppHeader = (props) => {
  const activityRulesProps = useActivityRules();
  const activityShareProps = useActivityShare();
  return (
    <NoSSG>
      <CommonAppHeader
        title="GemSlot"
        extra={
          <div className="flex-center">
            <ICNoviceGuideOutlined className="horizontal-flip-in-arabic" {...activityRulesProps} />
            <ICShareOutlined className="ml-20" {...activityShareProps} />
          </div>
        }
        {...props}
      />
    </NoSSG>
  );
};

export default React.memo(AppHeader);
