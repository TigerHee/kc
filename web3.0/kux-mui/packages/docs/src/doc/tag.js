/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Button, Tag } from '@kux/mui';
import { ICTradeOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const iconSize = {
  large: 20,
  medium: 16,
  small: 14,
};

const Doc = () => {
  const [size, setSize] = useState('large');
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <p style={{ fontSize: 30, fontWeight: 500 }}>Basic: </p>

          <p>default:</p>
          <Tag color="default" size={size}>Unavailable</Tag>

          <p>primary:</p>
          <Tag color="primary" size={size}>Lowest Fees</Tag>

          <p>secondary:</p>
          <Tag color="secondary" size={size}>Unavailable</Tag>

          <p>complementary:</p>
          <Tag color="complementary" size={size}>Unavailable</Tag>

          <p>废弃:</p>
          <p>primary tag</p>
          <Tag color="primary" size={size}>Primary Tag</Tag>
          <p>default tag</p>
          <Tag color="default" size={size}>Default Tag</Tag>
          <p>secondary tag</p>
          <Tag color="secondary" size={size}>Secondary Tag</Tag>
          <p>With Icon:</p>
          <Tag color="primary" size={size}><ICTradeOutlined size={iconSize[size]} /> With Icon</Tag>
          <p>Color Primary Variant Contained: </p>
          <Tag color="primary" variant="contained" size={size}>Primary Tag</Tag>
          <p>Color Primary Variant Outlined: </p>
          <Tag color="primary" variant="outlined" size={size}>Primary Tag</Tag>
          <p>Color Secondary Variant Contained: </p>
          <Tag color="secondary" variant="contained" size={size}>Secondary Tag</Tag>
          <p>Color Secondary Variant Outlined: </p>
          <Tag color="secondary" variant="outlined" size={size}>Secondary Tag</Tag>
        </div>
        <div style={{ marginLeft: 30 }}>
          <p>Change Size: </p>
          <Button onClick={() => setSize('small')}>Small Size</Button>
          {/* <Button onClick={() => setSize('medium')} style={{ marginLeft: 20 }}>Medium Size</Button> */}
          <Button onClick={() => setSize('large')} style={{ marginLeft: 20 }}>Large Size</Button>
        </div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
