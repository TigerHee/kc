/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import useSide from '../../hooks/useSide';
import { TRADE_SIDE } from '../../config';
import { Container, SideTab } from './styled';

const TradeSide = React.memo((props) => {
  const { side, setSide } = useSide();

  return (
    <Container {...props}>
      {
        map(TRADE_SIDE, ({ label, value, color }) => {
          return (
            <SideTab
              key={value}
              color={color}
              isActive={side === value}
              onClick={() => setSide(value)}
            >{label()}</SideTab>
          );
        })
      }
    </Container>
  );
});

export default TradeSide;
