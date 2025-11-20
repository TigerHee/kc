/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useClickListenAway, Button } from '@kux/mui';
import Wrapper from './wrapper';

const Doc = () => {
  const [counter, setCounter] = React.useState(0);
  const ref = React.useRef(null);

  useClickListenAway(() => {
    setCounter((s) => s + 1);
  }, ref);
  return (
    <div>
      <Button ref={ref}>2121212</Button>
      <p>counter: {counter}</p>
    </div>
  );
};

export default () => (
  <Wrapper>
    <Doc />
  </Wrapper>
);
