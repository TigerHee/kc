/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-08-03 18:39:45
 * @LastEditors: mike mike@kupotech.com
 * @LastEditTime: 2023-08-13 10:35:51
 * @FilePath: /kucoin_ucenter_rn/src/components/KYC/checkReason.js
 * @Description:
 */

import React, {useMemo} from 'react';
import {TouchableWithoutFeedback, ScrollView} from 'react-native';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import {RichLocale, Button} from '@krn/ui';
import FailureReason from 'components/KYC/FailureReason';
import {useSelector} from 'react-redux';
import {jumpVerify, jumpCommunity} from './Home/config';
import useIconSrc from 'hooks/useIconSrc';
import useTracker from 'hooks/useTracker';
import {useNavigation} from '@react-navigation/native';
import useKyc3Status from 'components/KYC/Home/hooks/useKyc3Status';
import usePIStatus from 'components/KYC/Home/hooks/usePIStatus';
import Clearance from 'components/KYC/Home/Clearance';
import isEmpty from 'lodash/isEmpty';

const ClearanceBox = styled.View`
  padding: 8px 16px;
`;
const Cont = styled.View`
  justify-content: center;
  align-items: center;
`;

const ContCenter = styled(Cont)`
  flex-direction: row;
  position: absolute;
  bottom: 10px;
  margin: 0px 26px;
  left: 0;
  right: 0;
`;

const Detail = styled.View`
  background-color: ${({theme}) => theme.colorV2.cover2};
  margin: 16px;
  color: ${({theme}) => theme.colorV2.text60};
  padding: 20px;
  border-radius: 16px;
`;

const Label = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 24px;
  font-weight: bold;
  line-height: 31px;
  text-align: center;
  margin-top: 12px;
`;

const FailedLogo = styled.Image`
  width: 148px;
  height: 148px;
`;

const TelegramLogo = styled.Image`
  width: 14px;
  height: 14px;
`;

const JoinTelegram = styled.Text`
  margin-left: 6px;
  font-size: 12px;
  font-weight: normal;
  line-height: 16px;
  text-align: left;
  color: ${({theme}) => theme.colorV2.text60};
`;

const GreenText = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
`;

const MButton = styled(Button)`
  margin-top: 16px;
  border-radius: 24px;
  width: 220px;
  height: 48px;
  color: ${({theme}) => theme.colorV2.textEmphasis};
  background: ${({theme}) =>
    theme.colorV2[theme.type === 'dark' ? 'primary' : 'cover']};
`;

export default () => {
  const {_t} = useLang();
  const failureReasonLists = useSelector(s => s.kyc.kycInfo.failureReasonLists);
  const kycClearInfo = useSelector(s => s.kyc.kycClearInfo);
  const {kyc3Status, kyc3StatusEnum} = useKyc3Status();
  const {PIComplianceInfo, PIStatus, PIStatusEnum} = usePIStatus();

  const {onClickTrack} = useTracker();
  const navigation = useNavigation();

  const onPress = () => {
    onClickTrack({
      blockId: 'Retry',
      locationId: '1',
    });
    navigation.canGoBack() ? navigation.goBack() : navigation.push('KYCPage');
    setTimeout(() => {
      jumpVerify(kycClearInfo);
    }, 0);
  };

  const joinTelegram = () => {
    onClickTrack({
      blockId: 'JoinGroup',
      locationId: '1',
    });
    jumpCommunity();
  };

  //败原因
  const reasonList = useMemo(() => {
    if (PIStatus === PIStatusEnum.REJECTED) {
      if (isEmpty(PIComplianceInfo?.failedReason)) {
        return [_t('04447de4a56f4000a7d2')];
      }
      return PIComplianceInfo?.failedReason;
    }

    return failureReasonLists;
  }, [failureReasonLists, PIComplianceInfo]);

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {kyc3Status === kyc3StatusEnum.CLEARANCE ? (
        <ClearanceBox>
          <Clearance />
        </ClearanceBox>
      ) : (
        <>
          <Cont>
            <FailedLogo source={useIconSrc('rejected')} autoRotateDisable />
          </Cont>
          <Label>{_t('kyc.homepage.fail.title')}</Label>
          <Detail>
            <FailureReason failureReasonLists={reasonList} />
          </Detail>
          {PIStatus === PIStatusEnum.REJECTED ? null : (
            <Cont>
              <MButton onPress={onPress} textStyle={{fontWeight: 'bold'}}>
                {_t('kyc.homepage.failed.button')}
              </MButton>
            </Cont>
          )}
          <ContCenter>
            <TelegramLogo source={require('assets/common/telegram_logo.png')} />
            <TouchableWithoutFeedback onPress={joinTelegram}>
              <JoinTelegram>
                <RichLocale
                  message={_t('KYC.web.telegram.failed')}
                  renderParams={{
                    LINK: {
                      component: ({children}) => (
                        <GreenText>{children}</GreenText>
                      ),
                      componentProps: {},
                    },
                  }}
                />
              </JoinTelegram>
            </TouchableWithoutFeedback>
          </ContCenter>
        </>
      )}
    </ScrollView>
  );
};
