/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import useContextSelector from '../../hooks/common/useContextSelector';

const defaultPreloadSrc =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAJFBMVEWtra0AAACvr6+urq6urq6tra2qqqqvr6+srKypqamurq6vr69HPm1WAAAADHRSTlMfAEMiPBoQNgUMFDK8UTkhAAABrklEQVRIx52WMU/CQBiGX0NaqC7eQFOczIWEgYVEEwc3YHMpAw5OMJgYJwN/gC4mbLA54qAzwT9o6d15H8e1X+SdyN2Tp1+vd98BQbJ8HQPj7w86RoDkGTpPmQ+IYRNYCcg8zYsLtHCYYH0IJClcIjsAVjhKSIEYnkwJsPEB5xZowpuRBozAr4CtwF8F6Cu4CRWQoDRZDhyVeCHntEwcPWEm2z3yDLirXJdSDmCyB2JtHm61QBLFNAcW6udOdrWAKs4ETAn5cE8JqCLMgdQCWkAVAgksoARDqshwRYBC0L7pE8UUTQrMiqlbohhhQYC6mqntFW9quIEVAZQAheJaDUeYWODOqHOFAUJsLKAFSrHVmwapBWxttV3X7H4KKMG9/twGMPkT7GQbviiBfp3TAVk8ogMSX5EDWmTZaz4YgC5U37dQ7FKzH4v93PyGiau33Ce/aQWqtn0gICZVByfKgUtz9Dqeo9cgh1fOSw6vQPnxDzKmgUT+FvRjWxDbxJg2GLGNlGvFbDPnrgP2QmGupOh/l5poucTavVjf3QJcQCxTOu+93L+g80gud/bvwS8gMIQocppF3QAAAABJRU5ErkJggg==';

const Container = styled.div`
  border-radius: 50%;
  display: inline-flex;
  background-position: 0 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: ${(props) => props.theme.colors.cover4};
`;

const CoinIcon = ({ size = 32, coin, style, icon, ...otherProps }) => {
  const currenciesMap = useContextSelector((state) => state.currenciesMap);
  const { iconUrl = defaultPreloadSrc } = currenciesMap[coin] || {};

  return (
    <Container
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${icon || iconUrl})`,
        ...style,
      }}
      {...otherProps}
    />
  );
};

export default React.memo(CoinIcon);
