/*
 * owner: borden@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { siteCfg } from 'config';
import { _t } from 'src/utils/lang';
import storage from 'src/utils/storage';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { openPage } from '../../utils';

export const Container = styled.a`
  position: relative;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text40};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
  ${(props) =>
    (!props.isRedDot
      ? `
    &:after {
      content: " ";
      position: absolute;
      top: -4px;
      right: -4px;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: ${props.theme.colors.secondary};
    }
  `
      : '')}
`;

const redDotStorageKey = 'grid_tab_reddot';

const GridTabWithRedDot = React.memo(() => {
  const currentSymbol = useGetCurrentSymbol();
  const url = `${siteCfg.TRADING_BOT_HOST}/spot/grid/${currentSymbol}`;

  const [isRedDot, setIsRedDot] = useState(() => {
    return storage.getItem(redDotStorageKey);
  });

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!isRedDot) {
        setIsRedDot(1);
        storage.setItem(redDotStorageKey, 1);
      }
      openPage(url);
    },
    [isRedDot, url],
  );

  return (
    <Container href={url} isRedDot={isRedDot} onClick={onClick}>
      {_t('jqywMTBuo3c43B1EcECWVk')}
    </Container>
  );
});

export default GridTabWithRedDot;
