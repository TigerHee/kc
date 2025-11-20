/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Confirm/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Confirm" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Confirm/Basic').default,
              sourceCode: require('../../demos/Confirm/Basic.doc').default,
            },
            {
              title: '自定义按钮',
              Component: require('../../demos/Confirm/CustomButton').default,
              sourceCode: require('../../demos/Confirm/CustomButton.doc').default,
            },
            {
              title: '带图弹窗',
              Component: require('../../demos/Confirm/BannerDialog').default,
              sourceCode: require('../../demos/Confirm/BannerDialog.doc').default,
            },
            {
              title: '运营弹窗',
              Component: require('../../demos/Confirm/YunYingDialog').default,
              sourceCode: require('../../demos/Confirm/YunYingDialog.doc').default,
            },
            {
              title: '自定义内容',
              Component: require('../../demos/Confirm/CustomContent').default,
              sourceCode: require('../../demos/Confirm/CustomContent.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
