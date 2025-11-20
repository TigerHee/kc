import React from 'react';
import { Tag } from '@krn/ui';
import { ScrollView, View, Text } from 'react-native';

export default () => {
  return (
    <ScrollView>
      <View style={{ marginBottom: 12 }}>
        <Text>medium :</Text>
      </View>
      {['success', 'warning', 'error', 'info'].map((item) => (
        <View key={item} style={{ marginBottom: 20, flexDirection: 'row' }}>
          <Tag type={item} content={item + ' msg'} />
        </View>
      ))}

      <View style={{ marginBottom: 12 }}>
        <Text>small :</Text>
      </View>
      {['success', 'warning', 'error', 'info'].map((item) => (
        <View key={item} style={{ marginBottom: 20, flexDirection: 'row' }}>
          <Tag type={item} content={item + ' msg'} size="small" />
        </View>
      ))}
    </ScrollView>
  );
};
