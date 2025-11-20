import React from 'react';
import { Button } from '@krn/ui';
import { View } from 'react-native';
import { Icon } from './common';

export default () => {
  return (
    <View>
      <Button style={{ marginBottom: 5 }}>长按钮</Button>
      <Button icon={<Icon />} style={{ marginBottom: 5 }}>
        长按钮
      </Button>
      <Button
        style={{ marginBottom: 5 }}
        loading={{
          spin: true,
          color: '#fff',
          size: 'xsmall',
          style: { marginLeft: 5 },
        }}
      >
        加载中
      </Button>
      <Button
        style={{ marginBottom: 5 }}
        loading={{
          spin: true,
          color: '#fff',
          size: 'xsmall',
          style: { marginLeft: 5 },
        }}
        disabled
      >
        加载中
      </Button>
    </View>
  );
};
