/*
 * owner: borden@kupotech.com
 */
import { ICNoviceGuideOutlined, ICShareOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import React from 'react';
import useActivityRules from './useActivityRules';
import useActivityShare from './useActivityShare';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: 12px 16px;
  color: #f3f3f3;
  position: relative;
  z-index: 1;
`;

const H5Header = (props) => {
  const activityRulesProps = useActivityRules();
  const activityShareProps = useActivityShare();
  return (
    <Container {...props} data-inspector="gemslot_H5Header">
      <div className="flex-center">
        <ICNoviceGuideOutlined
          className="pointer horizontal-flip-in-arabic"
          {...activityRulesProps}
        />
        <ICShareOutlined className="pointer ml-20" {...activityShareProps} />
      </div>
    </Container>
  );
};

export default React.memo(H5Header);
