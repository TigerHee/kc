import {Button, useTheme} from '@krn/ui';
import React from 'react';
import styled from '@emotion/native';
import {openNative} from '@krn/bridge';
import {Platform} from 'react-native';
import useTracker from 'hooks/useTracker';
import ActionSheet from 'components/Common/ActionSheet';

const ExDrawer = styled(ActionSheet)``;

const DrawerContent = styled.View`
  padding: 16px;
`;

const DrawerContentText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text60};
  font-weight: normal;
  line-height: 21px;
`;

const DrawerButtonBox = styled.View`
  margin-top: 24px;
`;

export default ({showDrawer, setShowDrawer, notice, bizType}) => {
  const theme = useTheme();
  const {onCustomEvent} = useTracker();

  const handleClose = () => {
    setShowDrawer(false);
  };
  const handleJump = () => {
    if (notice?.buttonAgreeAppUrl) {
      onCustomEvent('publicGuideEvent', {
        blockId: 'topMessageNew',
        locationId: '1',
        properties: {
          guideType: bizType,
          name: 'title_popup',
          reportType: 'click',
          guideColor: notice?.displayType,
        },
      });
      handleClose();
      setTimeout(() => {
        openNative(notice.buttonAgreeAppUrl);
      }, 200);
    }
  };

  return (
    <ExDrawer
      id="restrict-drawer"
      show={showDrawer}
      onClose={handleClose}
      overlayColor={theme.colorV2.mask}
      title={notice?.title}>
      <DrawerContent isIOS={Platform.OS === 'ios'}>
        <DrawerContentText>{notice?.topMessage}</DrawerContentText>
        {notice?.buttonAgree ? (
          <DrawerButtonBox>
            <Button size="large" onPress={handleJump}>
              {notice.buttonAgree}
            </Button>
          </DrawerButtonBox>
        ) : (
          <DrawerButtonBox />
        )}
      </DrawerContent>
    </ExDrawer>
  );
};
