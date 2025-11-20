import React from 'react';
import { Loading } from '@krn/ui';
import { View } from 'react-native';

export default () => {
  const LoadingStyle = { marginLeft: 10 };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Loading size="large" spin />
      <Loading style={LoadingStyle} spin />
      <Loading size="small" style={LoadingStyle} spin />
      <Loading size="small" style={LoadingStyle} showKcIcon={false} spin />
    </View>
  );
};
