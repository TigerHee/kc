import React from 'react';
import { Button } from '@krn/ui';
import { View } from 'react-native';
import { Icon } from './common';

export default () => {
  return (
    <View>
      {['mini', 'small', 'medium', 'large'].map((size) => {
        return (
          <View key={size} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button style={{ margin: 4 }} size={size}>
              {size + ' btn'}
            </Button>
            <Button icon={<Icon />} style={{ margin: 4 }} size={size}>
              {size + ' btn'}
            </Button>
          </View>
        );
      })}
    </View>
  );
};
