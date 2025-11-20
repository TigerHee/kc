/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-08-04 16:21:52
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-08-11 10:18:43
 * @FilePath: /kucoin_ucenter_rn/src/components/KYC/FailureReason.js
 * @Description:
 */
import {isArray, isEmpty, map} from 'lodash';
import React from 'react';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import {ScrollView} from 'react-native';

const Cont = styled.View``;

const ContWrapper = styled.View`
  max-height: 280px;
  overflow-y: auto;
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: bold;
  line-height: 18px;
  text-align: left;
  margin-bottom: 12px;
`;

const ReasonContent = styled.Text`
  font-size: 14px;
  font-weight: normal;
  line-height: 21px;
  color: ${({theme}) => theme.colorV2.text60};
`;
const FailureReason = ({failureReasonLists = []}) => {
  const reasonList = failureReasonLists || [];
  const {_t} = useLang();

  //处理兜底错误文案
  const handleError = (list = []) => {
    if (isArray(list) && !isEmpty(list)) {
      return map(list, (item, index) => {
        if (item && item.trim()) {
          return <ReasonContent key={index}>{item}</ReasonContent>;
        }
      });
    }
    return null;
  };

  let reason = null;
  if (isArray(reasonList) && !isEmpty(reasonList)) {
    reason = map(reasonList, (item, index) => {
      if (item.includes('\n')) {
        return handleError(item.split('\n'));
      }
      if (item && item.trim()) {
        return (
          <ReasonContent key={index}>{`${index + 1}. ${item}`}</ReasonContent>
        );
      }
    });
  }

  //兜底错误文案
  if (reasonList?.length === 0) {
    const textArr = _t('kyc.app.failed.reason.des')?.split('\\n') || [];
    reason = handleError(textArr);
  }

  return (
    <ContWrapper>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {reasonList?.length === 0 ? (
          <Cont>
            <Title>{_t('kyc.app.failed.reason.title')}</Title>
          </Cont>
        ) : null}
        <Cont>{reason}</Cont>
      </ScrollView>
    </ContWrapper>
  );
};
export default FailureReason;
