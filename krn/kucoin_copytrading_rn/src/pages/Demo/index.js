import React, {useState} from 'react';
import {ScrollView, Text, Vibration, View} from 'react-native';
// import {BUILD_ENV} from 'react-native-dotenv';
import styled from '@emotion/native';
import {Button, Checkbox, DebugBar} from '@krn/ui';

// import {useNavigation} from '@react-navigation/native';
import Card from 'components/Common/Card';
import Collapse from 'components/Common/Collapse';
import {ConfirmModal, ConfirmPopup} from 'components/Common/Confirm/index';
import Header from 'components/Common/Header';
import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import Input from 'components/Common/Input';
import {SegmentedDemo} from 'components/Common/Segmented/Demo';
import {Select} from 'components/Common/Select';
import SelectGroup from 'components/Common/Select/SelectGroup';
import {SelectorDemo} from 'components/Common/Selector/Demo';
import Slider from 'components/Common/Slider';
import {RouterNameMap} from 'constants/router-name-map';
import {commonStyles} from 'constants/styles';
import {useShare} from 'hooks/copyTrade/useShare';
import {useNavigation} from 'hooks/hybridNavigation';
import useGoBack from 'hooks/useGoBack';
import {
  gotoMainCopyPage,
  gotoMainLeadPageFromApplyTraderSuccess,
} from 'utils/native-router-helper';
// import TabViewExample from '../TraderProfile/Tabs';
import InputDemo from './Input';

const {BUILD_ENV} = process.env || {};

const selectGroupOptions = [
  {
    key: '带单用户标签',
    value: 'High profit',
    options: [
      {
        label: 'High profit',
        value: 'High profit',
      },

      {
        label: 'Rising star',
        value: 'Rising star',
      },

      {
        label: 'Aggressive',
        value: 'Aggressive',
      },

      {
        label: 'Most Popular',
        value: 'Most Popular',
      },
    ],
  },
  {
    key: '带单时长',
    value: 'High profit',
    options: [
      {
        label: '≥7 日',
        value: 'High profit',
      },

      {
        label: '＞1个月',
        value: 'Rising star',
      },

      {
        label: '＞3个月',
        value: 'Aggressive',
      },
    ],
  },
];

const ConfirmPopupDemo = () => {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible(!visible);

  const slideOnChange = val => {
    Vibration.vibrate(100);
  };
  return (
    <>
      <Button onPress={toggle}>Open ConfirmPopup</Button>
      <ConfirmPopup
        title="筛选"
        id="tag"
        show={visible}
        onClose={toggle}
        onOk={toggle}
        onCancel={toggle}
        okText="确定"
        cancelText="重置">
        <ScrollView
          // keyboardShouldPersistTaps={'handled'}
          // keyboardDismissMode="on-drag"
          style={{
            paddingTop: 12,
          }}>
          <Input />
          <SegmentedDemo />

          <SelectorDemo />
          <Slider
            // trackStyle={{
            //   backgroundColor: '#eee',
            //   borderRadius: 4,
            //   height: 10,
            //   shadowColor: 'black',
            //   shadowOffset: {
            //     width: 0,
            //     height: 1,
            //   },
            //   shadowOpacity: 0.15,
            //   shadowRadius: 1,
            // }}
            onValueChange={slideOnChange}
          />
          <View style={{padding: 100}} />
        </ScrollView>
      </ConfirmPopup>
    </>
  );
};
const ConfirmModalDemo = () => {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button onPress={toggle}>Open ConfirmModalDemo</Button>

      <ConfirmModal
        title="取消关注"
        show={visible}
        onClose={toggle}
        onOk={toggle}
        onCancel={toggle}
        okText="确定"
        cancelText="取消"
        message="确定取消关注“Lambol Jenny”吗"
      />
    </>
  );
};
const Title = styled.Text`
  ${commonStyles.textStyle};
`;

const ContentImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 60px;
`;

const Demo = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigation = useNavigation();
  const goBack = useGoBack();
  const [filterValues, setFilterValues] = useState({});
  const {handlePositionShare, handleShareLeadUserInfo} = useShare();

  return (
    <ScrollView style={{padding: 16}}>
      <Header title={'DEMO'} onPressBack={goBack} />
      <Text>BUILD_ENV: {BUILD_ENV}</Text>
      <Button size="default" onPress={gotoMainLeadPageFromApplyTraderSuccess}>
        LeadTraderSuccess
      </Button>
      <Checkbox checked={true} onChange={() => {}}>
        张三
      </Checkbox>
      <Button size="default" onPress={gotoMainCopyPage}>
        mycopy-tab
      </Button>

      <DebugBar />
      <Collapse>
        <Button size="default" onPress={handlePositionShare}>
          handlePositionShare
        </Button>

        <Button size="default" onPress={handleShareLeadUserInfo}>
          handleShareLeadUserInfo
        </Button>

        {Object.values(RouterNameMap).map(url => (
          <Button size="default" onPress={() => navigation.navigate(url)}>
            GOTO {url}
          </Button>
        ))}
      </Collapse>
      <Collapse>
        <InputDemo />
      </Collapse>
      <HorizontalScrollContainer>
        <Card
          style={{
            width: 300,
            height: 130,
            backgroundColor: '#fff',
            marginRight: 20,
          }}>
          <Text>Item 1</Text>
        </Card>

        <Card
          style={{
            width: 300,
            height: 130,
            backgroundColor: '#fff',
            marginRight: 20,
          }}>
          <Text>Item 2</Text>
        </Card>
        <Card style={{width: 300, height: 130, backgroundColor: '#fff'}}>
          <Text>Item 3</Text>
        </Card>
      </HorizontalScrollContainer>

      <Card>
        <Button type="secondary" size="large">
          Reset
        </Button>
        <Button size="large" disabled>
          Confirm
        </Button>
        <ConfirmModalDemo />
        <ConfirmPopupDemo />
      </Card>
      {/* <TabViewExample /> */}

      <SegmentedDemo />

      <Slider
        value={1}
        maximumValue={10}
        minimumValue={1}
        trackMarks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      />

      <SelectorDemo />
      <Title style={{margin: 12}}>SelectGroup 筛选</Title>

      <SelectGroup
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onChange={(_index, _val) => {}}
        selectGroupOptions={selectGroupOptions}
      />

      <Select
        options={[
          {
            label: '≥7 日',
            value: 'High profit',
          },

          {
            label: '＞1个月',
            value: 'Rising star',
          },

          {
            label: '＞3个月',
            value: 'Aggressive',
          },
        ]}
        defaultValue={'Overview'}
        value={filterValues.sort}
        onChange={value => {
          setFilterValues({
            ...filterValues,
            sort: value,
          });
        }}
      />
      <Title style={{margin: 12, marginBottom: 60}}>
        TraderProfile Echarts Demo
      </Title>

      {/* <ProfitLineChart />
      <HoldingScatter />
      <PreferencePie /> */}
    </ScrollView>
  );
};

export default Demo;
