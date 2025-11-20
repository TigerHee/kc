import React from 'react';
import { Empty } from '@krn/ui';
import { View } from 'react-native';

export default () => {
  return (
    <View>
      {[
        'empty',
        'systemBusy',
        'suspension',
        'network',
        'loading',
        'warning',
        'success',
        'error',
      ].map((item) => {
        return (
          <Empty text={item + ' text'} imgType={item} style={{ marginBottom: 20 }} key={item} />
        );
      })}
    </View>
  );
};
