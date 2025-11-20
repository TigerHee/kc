/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Switch } from '@kux/mui';
import Wrapper from './wrapper';

const Doc = () => {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <div>Size: basic</div>
      <Switch
        checked={checked}
        onChange={(val) => {
          setChecked(val);
        }}
      />
      <br />
      <div>Size: small</div>
      <Switch size="small" />
      <br />
      <div>Size: large</div>
      <Switch size="large" />
      <br />
      <div>默认不可用</div>
      <Switch disabled />
      <Switch disabled checked />
      <div>默认选中</div>
      <Switch defaultChecked />
      <br />
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
