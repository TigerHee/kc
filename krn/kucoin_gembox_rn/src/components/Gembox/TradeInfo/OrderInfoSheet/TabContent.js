/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';
import CommonTable from '../CommonTable';
import Pagination from './Pagination';
import {ORDERINFO_COlOR_MAP, TAB_MAP} from '../config';
import useLang from 'hooks/useLang';
import {unitConverter} from 'utils/helper';

const WrapperView = styled.ScrollView`
  width: 100%;
  flex: 1;
`;

const InfoView = styled.View`
  height: 32px;
  padding: 7px 16px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
const InfoText = styled.Text`
  flex: 1;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 20, 42, 0.6);
  padding: 0 12px;
`;
const TableTextSmall = styled.Text`
  font-size: 14px;
  line-height: 22px;
  font-weight: normal;
  color: rgba(0, 20, 42, 0.4);
`;
const TableText = styled.Text`
  font-size: 16px;
  line-height: 22px;
  font-weight: normal;
  color: rgba(0, 20, 42, 0.6);
`;
const TableWrapper = styled.View`
  width: 100%;
  height: 398px;
`;
const PortraitView = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
`;
const IntroduceView = styled.View`
  padding: 0 16px 0;
`;
const IntroduceText = styled.Text`
  text-align: left;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 20, 42, 0.6);
`;
const TabContent = props => {
  const {isRTL} = useTheme();
  const {_t} = useLang();
  const {marketColors} = useSelector(state => state.app || {});
  const {
    topOneInfo: {iconUrl},
  } = useSelector(state => state.gembox) || {};
  const {activeTab, dataSource} = props;
  const [buyPage, setBuyPage] = useState(1);
  const [sellPage, setSellPage] = useState(1);
  const columns = [
    {
      key: 'date',
      text: _t('usGTFQCNdJyZPHU9sk96Wq'),
      text_align: 'left',
      render(val, row) {
        return <TableTextSmall>{val}</TableTextSmall>;
      },
    },
    {
      key: 'volValue',
      text: _t('6PGRK177meTSQNmghqvwau'),
      text_align: 'left',
      render(val, row) {
        return (
          <TableText
            style={{
              color:
                activeTab === TAB_MAP.buy
                  ? marketColors.up.color
                  : marketColors.down.color,
            }}>
            {unitConverter(val)}
          </TableText>
        );
      },
    },
    {
      key: 'type',
      text: _t('tTcZriCy3VjHTMgePYRnyU'),
      text_align: 'right',
      render(val, row) {
        return (
          <TableTextSmall
            style={{
              color:
                activeTab === TAB_MAP.buy
                  ? marketColors.up.color
                  : marketColors.down.color,
              textAlign: 'right',
            }}>
            {activeTab === TAB_MAP.buy
              ? _t('nRaepbPTi7m2tUArCVg6QL')
              : _t('qV2W6zfyAWwTASvYqaaXnU')}
          </TableTextSmall>
        );
      },
    },
  ];
  return (
    <WrapperView>
      {activeTab === TAB_MAP.buy ? (
        <InfoView
          style={{
            backgroundColor: ORDERINFO_COlOR_MAP.BUY,
            justifyContent: 'flex-start',
          }}>
          <PortraitView
            autoRotateDisable
            source={
              iconUrl ? {uri: iconUrl} : require('assets/gembox/defaultImg.png')
            }
          />
          <InfoText numberOfLines={1}>{_t('7McavEFAo6wVi3pKE1yDJZ')}</InfoText>
        </InfoView>
      ) : isRTL ? (
        <InfoView
          style={{
            backgroundColor: ORDERINFO_COlOR_MAP.SELL,
            justifyContent: 'flex-start',
          }}>
          <PortraitView
            autoRotateDisable
            source={
              iconUrl ? {uri: iconUrl} : require('assets/gembox/defaultImg.png')
            }
          />
          <InfoText
            numberOfLines={1}
            style={{
              textAlign: 'left',
            }}>
            {_t('5aNDycjeoWJ1ynonS9emUQ')}
          </InfoText>
        </InfoView>
      ) : (
        <InfoView
          style={{
            backgroundColor: ORDERINFO_COlOR_MAP.SELL,
            justifyContent: 'flex-end',
          }}>
          <InfoText
            numberOfLines={1}
            style={{
              textAlign: 'right',
            }}>
            {_t('5aNDycjeoWJ1ynonS9emUQ')}
          </InfoText>
          <PortraitView
            source={
              iconUrl ? {uri: iconUrl} : require('assets/gembox/defaultImg.png')
            }
          />
        </InfoView>
      )}
      <TableWrapper>
        <CommonTable
          columns={columns}
          dataSource={dataSource.slice(
            (activeTab === TAB_MAP.buy ? buyPage - 1 : sellPage - 1) * 10,
            (activeTab === TAB_MAP.buy ? buyPage - 1 : sellPage - 1) * 10 + 10,
          )}
        />
        {(activeTab === TAB_MAP.buy && buyPage === 10) ||
        (activeTab === TAB_MAP.sell && sellPage === 10) ? (
          <IntroduceView>
            <IntroduceText>{_t('3mtvVEVFdLvd7fq2CYq5tU')}</IntroduceText>
          </IntroduceView>
        ) : null}
      </TableWrapper>
      {activeTab === TAB_MAP.buy ? (
        <Pagination
          totalNumber={dataSource.length}
          changePage={val => {
            setBuyPage(val);
          }}
          activePage={buyPage}
        />
      ) : (
        <Pagination
          totalNumber={dataSource.length}
          changePage={val => {
            setSellPage(val);
          }}
          activePage={sellPage}
        />
      )}
    </WrapperView>
  );
};
export default TabContent;
