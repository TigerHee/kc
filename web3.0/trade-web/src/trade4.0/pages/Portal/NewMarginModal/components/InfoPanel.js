/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import styled from '@emotion/styled';

/** 样式开始 */
const PositionPanel = styled.div`
  margin: 24px 0;
`;
export const PositionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:first-of-type) {
    margin-top: 10px;
  }
`;
export const PositionLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
export const PositionValue = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
/** 样式结束 */

const InfoPanel = ({ dataSource }) => {
  return (
    <PositionPanel>
      {map(dataSource, ({ key, label, value, component }) => {
        if (React.isValidElement(component)) {
          return React.cloneElement(component, { key });
        }
        return (
          <PositionRow key={key}>
            <PositionLabel>{label}</PositionLabel>
            <PositionValue>{value}</PositionValue>
          </PositionRow>
        );
      })}
    </PositionPanel>
  );
};

export default InfoPanel;
