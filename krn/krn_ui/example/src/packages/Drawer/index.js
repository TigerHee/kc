/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Drawer/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Drawer" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Drawer/Basic').default,
              sourceCode: require('../../demos/Drawer/Basic.doc').default,
            },
            {
              title: '右侧操作按钮',
              Component: require('../../demos/Drawer/RightSlot').default,
              sourceCode: require('../../demos/Drawer/RightSlot.doc').default,
            },
            {
              title: '原生风格的抽屉',
              Component: require('../../demos/Drawer/NativeType').default,
              sourceCode: require('../../demos/Drawer/NativeType.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
