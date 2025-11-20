/*
  * owner: borden@kupotech.com
 */
import React, { useCallback, Fragment } from 'react';
import { useDispatch } from 'dva';
import styled from '@emotion/styled';
import useMarginModel from '@/hooks/useMarginModel';
import useMarginStatusConfig from '@/hooks/useMarginStatusConfig';
import Dashboard from './Dashboard';
import StatusLabel from './StatusLabel';
import LiabilityRate from './LiabilityRate';

const Container = styled.span`
  display: inline-flex;
  align-items: center;
`;
const StyledDashboard = styled(Dashboard)`
  margin-right: 6px;
`;
const StyledLiabilityRate = styled(LiabilityRate)`
  margin-right: ${props => (!props.isInit ? 4 : 0)}px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  ${props => {
    if (props.isInit) {
      return `color: ${props.theme.colors.text30};`;
    }
  }}
`;

const PositionStatus = React.memo(
  ({
    status,
    symbol,
    disabled,
    liabilityRate,
    showDashboard,
    ...otherProps
  }) => {
    const dispatch = useDispatch();
    const commonParams = { status, symbol, liabilityRate };

    const { type } = useMarginStatusConfig(commonParams);
    const { liabilityRate: _liabilityRate } = useMarginModel(
      ['liabilityRate'],
      { symbol },
    );

    const isPosition = type === 'position';
    const value = liabilityRate === undefined ? _liabilityRate : liabilityRate;
    const isInit = !showDashboard && (!value || !(+value));
    disabled = disabled || !+value || isPosition;

    const openDebtModal = useCallback(() => {
      dispatch({
        type: 'marginMeta/update',
        payload: {
          debtModalVisible: true,
        },
      });
    }, []);

    return (
      <Container {...otherProps}>
        {!isPosition && (
          <Fragment>
            {Boolean(showDashboard) && <StyledDashboard value={+value} />}
            <StyledLiabilityRate
              {...commonParams}
              isInit={isInit}
              disabled={disabled}
              {...(!disabled ? { onClick: openDebtModal } : null)}
            />
          </Fragment>
        )}
        { !isInit && <StatusLabel {...commonParams} /> }
      </Container>
    );
  },
);

PositionStatus.defaultProps = {
  showDashboard: true,
};

export default PositionStatus;
