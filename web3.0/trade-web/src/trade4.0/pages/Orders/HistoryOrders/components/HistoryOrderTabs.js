/**
 * Owner: harry.lai@kupotech.com
 */
import React, { useEffect } from 'react';
import Radio from '@mui/Radio';
import { styled, fx } from '@/style/emotion';
import ScrollWrapper from '@/components/ScrollWrapper';

const ScrollComp = styled(ScrollWrapper)`
  flex: 1;
  overflow-x: auto;
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  .KuxRadio-group {
    display: flex;
  }
  .KuxRadio-wrapper {
    font-size: 12px;
    font-weight: 500;
    height: 24px;
    padding: 4px 10px;
    background: none;

    .KuxRadio-text {
      color: ${(props) => props.theme.colors.text40};
    }
    &.KuxRadio-wrapper-checked {
      ${(props) => fx.backgroundColor(props, 'cover4')}

      .KuxRadio-text {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`;

const HistoryOrderTab = ({ tabs, activeIndex, handleTabClick }) => {
  return (
    <ScrollComp>
      <RadioWrapper>
        <Radio.Group value={activeIndex} size="large" onChange={(e, v) => handleTabClick(v)}>
          {tabs.map((item) => {
            return (
              <Radio.Button value={item.key} key={item.key}>
                {item.label()}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </RadioWrapper>
    </ScrollComp>
  );
};

export default HistoryOrderTab;
