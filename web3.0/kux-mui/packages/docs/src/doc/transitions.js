/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Switch, Fade,Zoom } from '@kux/mui';
import Wrapper from './wrapper';

function Demo1() {
  const [value, setValue] = useState(false);
  const [value2, setValue2] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
          Fade：
          <Switch checked={value} onChange={checked => setValue(checked)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Zoom：
          <Switch checked={value2} onChange={checked => setValue2(checked)} />
        </div>
      </div>
      <Fade in={value}>
        <div style={{ padding: 20, marginTop: 20, marginBottom: 20, background: 'rgba(36, 174, 143, 0.16)' }}>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </div>
      </Fade>
      <Zoom in={value2}>
        <div style={{ padding: 20, marginTop: 20, marginBottom: 20, background: 'rgba(36, 174, 143, 0.16)' }}>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </div>
      </Zoom>
    </div>
  );
}

function TransitionsDoc() {
  return (
    <Wrapper>
      <Demo1 />
    </Wrapper>
  );
}

export default TransitionsDoc;
