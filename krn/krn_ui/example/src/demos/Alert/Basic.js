import React from 'react';
import { Alert } from '@krn/ui';
import { ScrollView, View } from 'react-native';
import { showToast } from '@krn/bridge';

export default () => {
  return (
    <ScrollView>
      <View style={{ marginBottom: 20 }}>
        <Alert
          type="info"
          title="當前IP在受限區域"
          showArrowIcon
          onPress={() => {
            showToast('点击了Alert');
          }}
        />
      </View>

      {/* 默认四种类型 */}
      {['success', 'warning', 'error', 'info'].map((item) => (
        <View key={item} style={{ marginBottom: 20 }}>
          <Alert type={item} title="當前IP在受限區域，您所在的國家無法註冊及使用我們的服務，抱歉" />
        </View>
      ))}

      {/* 隐藏类型icon */}
      {['success', 'warning', 'error', 'info'].map((item) => (
        <View key={item} style={{ marginBottom: 20 }}>
          <Alert
            type={item}
            title="當前IP在受限區域，您所在的國家無法註冊及使用我們的服務，抱歉"
            showTypeIcon={false}
          />
        </View>
      ))}
    </ScrollView>
  );
};
