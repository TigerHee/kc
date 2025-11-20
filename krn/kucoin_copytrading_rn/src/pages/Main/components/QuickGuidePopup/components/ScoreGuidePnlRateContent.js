import React from 'react';
import {View} from 'react-native';
import styled, {css} from '@emotion/native';

import Table from 'components/Common/Table';
import useLang from 'hooks/useLang';
import {ScoreGuidePnlRate} from '../constant';
import {BaseText, Text60} from '../styles';
import {PrefixPointWrap} from './PrefixPointWrap';

const StyledBaseText = styled(BaseText)`
  margin-bottom: 12px;
`;
export const ScoreGuidePnlRateContent = () => {
  const {_t} = useLang();
  const columns = [
    {
      title: _t('fd3d2349b5d04000aeff'),
      dataIndex: 'metric',
      key: 'metric',
      fixed: 'left', // 固定首列便于横向查看
    },
    {
      title: 'Day 1',
      dataIndex: 'day1',
      key: 'day1',
    },
    {
      title: 'Day 2',
      dataIndex: 'day2',
      key: 'day2',
    },
    {
      title: 'Day 3',
      dataIndex: 'day3',
      key: 'day3',
    },
    {
      title: 'Day 4',
      dataIndex: 'day4',
      key: 'day4',
    },
  ];

  const dataSource = [
    {
      key: 'pnl',
      metric: _t('fa94ababb42c4000a383'),
      day1: '0',
      day2: '+10',
      day3: '0',
      day4: '-5',
    },
    {
      key: 'fund',
      metric: _t('8efa95257d4a4000ad40'),
      day1: '-',
      day2: '-',
      day3: '+50',
      day4: '-30',
    },
    {
      key: 'asset',
      metric: _t('88c5cfeae6324000ab4d'),
      day1: '+100',
      day2: '+110',
      day3: '+160',
      day4: '+125',
    },
    {
      key: 'shares',
      metric: _t('6a36717a6a384000a28b'),
      day1: '100',
      day2: '100',
      day3: '50/1.1+100=145.45 ',
      day4: '145.45-30/1.1=118.18',
    },
    {
      key: 'nav',
      metric: _t('9dbadaad72c64000a8fb'),
      day1: '1',
      day2: '1.1',
      day3: '160/145.45=1.1 ',
      day4: '125/118.18=1.06 ',
    },
    {
      key: 'yield',
      metric: _t('d47e2755cc644000a517'),
      day1: '0%',
      day2: '10%',
      day3: '(1.1-1)*100%=10% ',
      day4: '(1.06-1)*100%=6% ',
    },
  ];

  return (
    <View>
      <Text60>{_t('1c830a9cd20e4000a5e5')}</Text60>
      <Text60
        style={css`
          margin-bottom: 8px;
        `}>
        {_t('caff5b2172154000a07d')}
      </Text60>

      {ScoreGuidePnlRate.map(({title, content}) => (
        <View key={title}>
          <StyledBaseText>{_t(title)}</StyledBaseText>
          <View
            style={css`
              margin-bottom: 16px;
            `}>
            {content?.map(key => (
              <PrefixPointWrap key={key}>
                <Text60>{_t(key)}</Text60>
              </PrefixPointWrap>
            ))}
          </View>
        </View>
      ))}

      <Table dataSource={dataSource} columns={columns} />
    </View>
  );
};
