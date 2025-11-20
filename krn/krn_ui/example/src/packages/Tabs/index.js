/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Tabs/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

import Basic from '../../demos/Tabs/Basic';
import BasicDoc from '../../demos/Tabs/Basic.doc';

import Isolated from '../../demos/Tabs/Isolated';
import IsolatedDoc from '../../demos/Tabs/Isolated.doc';

import Border from '../../demos/Tabs/Border';
import BorderDoc from '../../demos/Tabs/Border.doc';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Tabs" />
      <ScrollView>
        <ParamList
          list={{
            ...API,
            'label[Tabs.Tab]': {
              type: 'string|node',
              comment: '必填，Tab的label, 可以是字符串或者ReactNode',
            },
            'value[Tabs.Tab]': {
              type: 'string',
              comment: '必填，Tab的value',
            },
            'style[Tabs.Tab]': {
              type: 'object|array',
              comment: 'Tab根元素样式，支持@emotion复写',
            },
          }}
        />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: Basic,
              sourceCode: BasicDoc,
            },
            {
              title: 'Isolated类型的Tabs',
              Component: Isolated,
              sourceCode: IsolatedDoc,
            },
            {
              title: 'Border类型的Tabs',
              Component: Border,
              sourceCode: BorderDoc,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
