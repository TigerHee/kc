/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from '@emotion/native';
import { Platform, TouchableWithoutFeedback } from 'react-native';
import closeIconDark from 'assets/dark/close_common.png';
import closeIconLight from 'assets/light/close_common.png';
import closeIcon from 'assets/common/Drawer/close.png';
import useTheme from 'hooks/useTheme';
import useUIContext from 'hooks/useUIContext';
import registerAPI from 'utils/registerAPI';
import API from './API';

const MainWrapper = styled.View`
  padding-bottom: ${({ ios }) => (ios ? '30px' : 0)};
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background: ${({ theme }) => theme.colorV2.layer};
  padding: 20px 16px 0;
  border-radius: 16px 16px 0 0;
`;
const HeaderLeft = styled.View`
  width: 40px;
`;
const HeaderCenter = styled.View`
  flex: 1;
`;
const HeaderRight = styled.View`
  width: 40px;
`;
const HeaderClose = styled.Image`
  width: 20px;
  height: 20px;
`;
const HeaderTitleText = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: ${({ theme }) => theme.colorV2.text};
  font-weight: 600;
  line-height: 25px;
`;
const HeaderWrapperV2 = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 0;
  border-radius: 16px 16px 0 0;
  background: ${({ theme }) => theme.colorV2.layer};
`;
const HeaderTitle = styled.View`
  flex: 1;
`;
const HeaderTitleTextV2 = styled.Text`
  flex: 1;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  line-height: 23.4px;
  color: ${({ theme }) => theme.colorV2.text};
`;
const HeaderLeftV2 = styled.View``;
const HeaderCloseV2 = styled.Image`
  width: 24px;
  height: 24px;
`;

const NativeHeader = styled.View`
  background: ${({ theme }) => theme.colorV2.layer};
  padding: 12px 16px 0;
`;
const NativeHeaderTitleText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  color: ${({ theme }) => theme.colorV2.text};
`;

const Drawer = ({
  id,
  show,
  onClose,
  children,
  header,
  title,
  leftSlot,
  rightSlot,
  style,
  headerType,
  styles = {},
  ...restProps
}) => {
  const theme = useTheme();
  const { currentTheme } = useUIContext();
  useEffect(() => {
    if (show) SheetManager.show(id);
    else SheetManager.hide(id);
  }, [show, id]);
  return show ? (
    <ActionSheet
      id={id}
      overlayColor={theme.color.mask}
      defaultOverlayOpacity={1}
      closable={!!onClose}
      onClose={onClose}
      containerStyle={{
        backgroundColor: theme.colorV2.layer,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      {...(headerType === 'native'
        ? {
            gestureEnabled: true,
            indicatorStyle: {
              backgroundColor: theme.colorV2.primaryButtonText,
              top: -20,
              height: 4,
              width: 64,
            },
          }
        : {})}
      {...restProps}
    >
      <MainWrapper ios={Platform.OS === 'ios'} style={[style, styles.mainWrapper]}>
        {header ? (
          header
        ) : headerType === 'native' ? (
          <NativeHeader style={styles.nativeHeader}>
            <NativeHeaderTitleText numberOfLines={1} style={styles.nativeHeaderTitleText}>
              {title}
            </NativeHeaderTitleText>
          </NativeHeader>
        ) : rightSlot ? (
          <HeaderWrapper style={styles.headerWrapper}>
            {leftSlot ? (
              leftSlot
            ) : (
              <HeaderLeft style={styles.headerLeft}>
                <TouchableWithoutFeedback onPress={onClose}>
                  <HeaderClose
                    source={currentTheme === 'light' ? closeIconLight : closeIconDark}
                    style={styles.headerClose}
                  />
                </TouchableWithoutFeedback>
              </HeaderLeft>
            )}
            <HeaderCenter style={styles.headerCenter}>
              {typeof title === 'string' ? (
                <HeaderTitleText numberOfLines={1} style={styles.headerTitleText}>
                  {title}
                </HeaderTitleText>
              ) : (
                title
              )}
            </HeaderCenter>
            {rightSlot ? rightSlot : <HeaderRight style={styles.headerRight} />}
          </HeaderWrapper>
        ) : (
          <HeaderWrapperV2 style={styles.headerWrapper}>
            <HeaderTitle style={styles.headerTitle}>
              {typeof title === 'string' ? (
                <HeaderTitleTextV2 numberOfLines={1} style={styles.headerTitleText}>
                  {title}
                </HeaderTitleTextV2>
              ) : (
                title
              )}
            </HeaderTitle>
            {leftSlot ? (
              leftSlot
            ) : (
              <HeaderLeftV2 style={styles.headerLeft}>
                <TouchableWithoutFeedback onPress={onClose}>
                  <HeaderCloseV2 source={closeIcon} style={styles.headerClose} />
                </TouchableWithoutFeedback>
              </HeaderLeftV2>
            )}
          </HeaderWrapperV2>
        )}
        {children}
      </MainWrapper>
    </ActionSheet>
  ) : null;
};

registerAPI(Drawer, API);

export default Drawer;
