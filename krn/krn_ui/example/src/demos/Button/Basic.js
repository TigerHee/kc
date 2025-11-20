import React from 'react';
import { Button } from '@krn/ui';
import { showToast } from '@krn/bridge';
import { View, Text } from 'react-native';
import { Icon, IconBlack } from './common';

export default () => {
  return (
    <View>
      <View style={{ margin: 4 }}>
        <Text>主按钮：</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Button style={{ margin: 4 }} textStyle={{ fontWeight: '400' }} onPress={() => showToast('点了一下按钮')}>
          普通按钮400
        </Button>
        <Button style={{ margin: 4 }} textStyle={{ fontWeight: '500' }} onPress={() => showToast('点了一下按钮')}>
          普通按钮500
        </Button>
        <Button style={{ margin: 4 }} textStyle={{ fontWeight: '600' }} onPress={() => showToast('点了一下按钮')}>
          普通按钮600
        </Button>
        <Button style={{ margin: 4 }} textStyle={{ fontWeight: '700' }} onPress={() => showToast('点了一下按钮')}>
          普通按钮700
        </Button>
        <Button style={{ margin: 4 }} onPress={() => showToast('点了一下按钮')}>
          普通按钮
        </Button>
        <Button
          style={{ margin: 4 }}
          loading={{
            spin: true,
            color: '#fff',
            size: 'xsmall',
            style: { marginLeft: 0 },
          }}
        >
          加载中
        </Button>
        <Button disabled style={{ margin: 4 }}>
          禁用按钮
        </Button>
        <Button icon={<Icon />} style={{ margin: 4 }}>
          带图标
        </Button>
      </View>

      <View style={{ margin: 4 }}>
        <Text>次按钮：</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Button type="secondary" style={{ margin: 4 }} onPress={() => showToast('点了一下按钮')}>
          普通按钮
        </Button>
        <Button
          type="secondary"
          style={{ margin: 4 }}
          loading={{
            spin: true,
            color: '#1D1D1D',
            size: 'xsmall',
            style: { marginLeft: 0 },
          }}
        >
          加载中
        </Button>
        <Button type="secondary" disabled style={{ margin: 4 }}>
          禁用按钮
        </Button>
        <Button type="secondary" icon={<IconBlack />} style={{ margin: 4 }}>
          带图标
        </Button>
      </View>
    </View>
  );
};
