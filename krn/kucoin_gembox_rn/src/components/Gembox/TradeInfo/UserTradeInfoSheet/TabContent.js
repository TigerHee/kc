/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import {useSelector} from 'react-redux';
import styled from '@emotion/native';
import CommonTable from '../CommonTable';
import {USER_TREADEINFO_TAB_MAP, USER_TREADEINFO_COlOR_MAP} from '../config';
import useLang from 'hooks/useLang';
import {unitConverter} from 'utils/helper';

const WrapperView = styled.ScrollView`
  width: 100%;
  height: 430px;
`;

const InfoView = styled.View`
  padding: 7px 16px;
`;
const InfoText = styled.Text`
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 20, 42, 0.6);
`;
const TableText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  color: rgba(0, 20, 42, 0.6);
`;
const TableOrder = styled.Text`
  font-size: 16px;
  line-height: 20px;
  font-weight: normal;
  color: rgba(0, 20, 42, 0.4);
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
  const {_t} = useLang();
  const {marketColors} = useSelector(state => state.app || {});
  const {bigMoneyList, proTraderList, topOneInfo} = useSelector(
    state => state.gembox || {},
  );
  const {name} = topOneInfo;
  const {typeColor, activeTab} = props;
  const columns = [
    {
      key: 'order',
      text: _t('6de3zP3spvWmQ397kemM6u'),
      text_align: 'left',
      render(val, row) {
        return <TableOrder>{val}</TableOrder>;
      },
    },
    {
      key: 'volValue',
      text: _t(
        activeTab === USER_TREADEINFO_TAB_MAP.BIG_MONEY
          ? 'qu2xRdBhE2HpyLpoGtvMUu'
          : 't8T8H8SfVqMgz4dqHFNTft',
      ),
      text_align: 'left',
      render(val, row) {
        return (
          <TableText style={{color: typeColor}}>{unitConverter(val)}</TableText>
        );
      },
    },
    {
      key: 'tradeDirection',
      text: _t('1McHg9QN6ji6tXG5FQzwM9', {coin: name}),
      text_align: 'right',
      render(val, row) {
        return (
          <TableText
            style={{
              color:
                val === 'BUY' ? marketColors.up.color : marketColors.down.color,
              textAlign: 'right',
            }}>
            {val === 'BUY'
              ? _t('nRaepbPTi7m2tUArCVg6QL')
              : _t('qV2W6zfyAWwTASvYqaaXnU')}
          </TableText>
        );
      },
    },
  ];
  return (
    <WrapperView>
      {activeTab === USER_TREADEINFO_TAB_MAP.BIG_MONEY ? (
        <InfoView
          style={{backgroundColor: USER_TREADEINFO_COlOR_MAP.BIG_MONEY12}}>
          <InfoText numberOfLines={2}>{_t('n3uWzMQ54edBYivjTnmetv')}</InfoText>
        </InfoView>
      ) : (
        <InfoView
          style={{backgroundColor: USER_TREADEINFO_COlOR_MAP.PRO_TRADER12}}>
          <InfoText numberOfLines={2}>{_t('cCsnV3UnEjkfEtRcyx5PGS')}</InfoText>
        </InfoView>
      )}
      <CommonTable
        columns={columns}
        dataSource={
          activeTab === USER_TREADEINFO_TAB_MAP.BIG_MONEY
            ? bigMoneyList
            : proTraderList
        }
      />
      {activeTab === USER_TREADEINFO_TAB_MAP.PRO_TRADER &&
        proTraderList.length > 0 && (
          <IntroduceView>
            <IntroduceText>{_t('gaH5JwWJdHL1fBisWTyoKL')}</IntroduceText>
            <IntroduceText>{_t('chzDtxMMDo8CWzerrmtdN9')}</IntroduceText>
          </IntroduceView>
        )}
    </WrapperView>
  );
};
export default TabContent;
