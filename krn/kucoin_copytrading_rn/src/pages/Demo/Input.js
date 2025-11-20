import React from 'react';
import {Pressable, Text, View} from 'react-native';
import styled from '@emotion/native';
import {showToast} from '@krn/bridge';

import searchImg from 'assets/common/ic-search.png';
import Input from 'components/Common/Input/KrnInput';

const ExImage = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;
const TestText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.text};
`;

export default () => {
  const [value, setValue] = React.useState(
    'TD8Vh4RkiuLwHZJNqAHZebLr361AKNfQ7M',
  );

  return (
    <View>
      <Input
        placeholder="Place holder"
        label="Label disabled"
        disabled={true}
        value={value}
        onChange={e => setValue(e.nativeEvent.text)}
      />
      <Input placeholder="Place holder" label="Label" />
      <Input placeholder="Place holder" label="Label" colorType="success" />
      <Input
        placeholder="Place holder"
        label="Label"
        colorType="error"
        tips="Supporting text"
      />

      <Input
        placeholder="search"
        allowClear
        value={value}
        onChange={e => setValue(e.nativeEvent.text)}
        prefix={<ExImage source={searchImg} />}
      />

      <Input
        colorType="success"
        value={value}
        onChange={e => setValue(e.nativeEvent.text)}
        allowClear
        label="Label 多行"
        originInputProps={{
          multiline: true,
        }}
      />

      <Input
        colorType="success"
        value={value}
        onChange={e => setValue(e.nativeEvent.text)}
        allowClear
        label="Label 多行"
        originInputProps={{
          multiline: true,
        }}
        suffix={
          <Pressable
            style={{marginLeft: 12}}
            onPress={() => showToast('点击了After')}>
            <Text style={{color: '#01BC8D'}}>Text</Text>
          </Pressable>
        }
      />

      <Input
        placeholder="Place suffix"
        label="Label disabled"
        disabled={true}
        suffix={
          <Pressable
            style={{marginLeft: 12}}
            onPress={() => showToast('点击了After')}>
            <Text style={{color: '#01BC8D'}}>Text</Text>
          </Pressable>
        }
      />
      <Input
        prefix={
          <View style={{marginRight: 12}}>
            <Text style={{color: '#01BC8D'}}>Before</Text>
          </View>
        }
        suffix={
          <Pressable
            style={{marginLeft: 12}}
            onPress={() => showToast('点击了After')}>
            <Text style={{color: '#01BC8D'}}>After</Text>
          </Pressable>
        }
      />
    </View>
  );
};
