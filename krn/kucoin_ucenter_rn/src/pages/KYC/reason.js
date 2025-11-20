/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-08-03 21:50:29
 * @LastEditors: mike mike@kupotech.com
 * @LastEditTime: 2023-08-13 16:54:21
 * @FilePath: /kucoin_ucenter_rn/src/pages/KYC/reason.js
 * @Description:
 */
import React from 'react';
import styled from '@emotion/native';
import {Header, useUIContext} from '@krn/ui';
import {useNavigation} from '@react-navigation/native';
import {exitRN} from '@krn/bridge';
import CheckReason from 'components/KYC/checkReason';
import {TouchableOpacity} from 'react-native';
import useTracker from 'hooks/useTracker';

const ConvertView = styled.SafeAreaView`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const HeaderClose = styled.Image`
  width: 20px;
  height: 20px;
`;
export const MHeader = styled(Header)`
  background-color: ${({theme}) => theme.colorV2.overlay};
`;
const CheckReasonPage = ({route}) => {
  const navigation = useNavigation();
  const {currentTheme} = useUIContext();
  const {onPageExpose, onClickTrack} = useTracker();
  const onPress = () => {
    navigation.canGoBack() ? navigation.goBack() : exitRN();
    onClickTrack({
      blockId: 'Exit',
      locationId: '1',
    });
  };

  React.useEffect(() => {
    onPageExpose();
  }, []);
  return (
    <ConvertView>
      <MHeader
        leftSlot={null}
        rightSlot={
          <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
            <HeaderClose
              source={
                currentTheme === 'light'
                  ? require('assets/light/close.png')
                  : require('assets/dark/close.png')
              }
            />
          </TouchableOpacity>
        }
      />
      <CheckReason pressCallback={onPress} />
    </ConvertView>
  );
};
export default CheckReasonPage;
