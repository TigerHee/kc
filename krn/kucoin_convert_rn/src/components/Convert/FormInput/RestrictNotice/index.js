/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useState} from 'react';
import styled from '@emotion/native';
import noticeError from 'assets/convert/notice_error.png';
import noticeWarn from 'assets/convert/notice_warn.png';
import noticeArrow from 'assets/convert/notice_arrow.png';
import dismissCloseIcon from 'assets/convert/dismiss_close_icon.png';
import ScrollingText from 'components/Common/ScrollingText';
import {useTheme} from '@krn/ui';
import {useDispatch} from 'react-redux';
import NoticeDrawer from 'components/Convert/FormInput/RestrictNotice/NoticeDrawer';
import useTracker from 'hooks/useTracker';

const Wrapper = styled.Pressable`
  flex-direction: row;
  align-items: center;
  height: 40px;
  text-align: center;
  background: ${({theme, displayType}) =>
    displayType === 'SUCCESS'
      ? theme.colorV2.primary8
      : displayType === 'WARN'
      ? theme.colorV2.complementary8
      : theme.colorV2.secondary8};
  padding: 0 12px;
`;

const NoticeIconBox = styled.View`
  padding: 1px;
  margin-right: 8px;
`;
const NoticeIcon = styled.Image`
  width: 14px;
  height: 14px;
`;
const ArrowIconBox = styled.View`
  margin-left: 8px;
`;

const CloseIconBox = styled.Pressable`
  height: 16px;
  margin-left: 8px;
  padding-left: 8px;
  border-left-width: 1px;
  border-left-color: ${({theme}) => theme.colorV2.divider8};
  justify-content: center;
`;

const CloseIcon = styled.Image`
  width: 14px;
  height: 14px;
`;

const ScrollingTextView = styled.View`
  flex: 1;
  overflow: hidden;
`;

const Content = styled.Text`
  font-size: 14px;
  font-weight: normal;
  color: ${({theme, displayType}) =>
    displayType === 'SUCCESS'
      ? theme.colorV2.primary
      : displayType === 'WARN'
      ? theme.colorV2.complementary
      : theme.colorV2.secondary};
`;

const ArrowIcon = styled.Image`
  margin-left: 8px;
  width: 16px;
  height: 16px;
`;

export default ({bizType, notice}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const {onCustomEvent} = useTracker();

  useEffect(() => {
    onCustomEvent('publicGuideEvent', {
      blockId: 'topMessageNew',
      locationId: '1',
      properties: {
        guideType: bizType,
        name: 'title_popup',
        reportType: 'show',
        guideColor: notice?.displayType,
      },
    });
  }, [bizType, notice?.displayType]);

  const handleClose = () => {
    onCustomEvent('publicGuideEvent', {
      blockId: 'topMessageNew',
      locationId: '1',
      properties: {
        guideType: bizType,
        name: 'title_popup',
        reportType: 'close',
        guideColor: notice?.displayType,
      },
    });
    dispatch({type: 'dismiss/update', payload: {dismissInfo: {}}});
  };

  return (
    <Wrapper
      displayType={notice?.displayType}
      onPress={() => setShowDrawer(true)}>
      {notice?.displayType !== 'SUCCESS' ? (
        <NoticeIconBox>
          <NoticeIcon
            source={notice?.displayType === 'ERROR' ? noticeError : noticeWarn}
          />
        </NoticeIconBox>
      ) : null}
      <ScrollingTextView>
        {notice?.topMessage?.length > 30 ? (
          <ScrollingText
            speed={30}
            textStyle={{
              fontSize: 14,
              fontWeight: 'normal',
              color:
                notice?.displayType === 'SUCCESS'
                  ? theme.colorV2.primary
                  : notice?.displayType === 'WARN'
                  ? theme.colorV2.complementary
                  : theme.colorV2.secondary,
            }}>
            {notice?.topMessage}
          </ScrollingText>
        ) : (
          <Content
            numberOfLines={1}
            displayType={notice?.displayType}
            ellipsizeMode="clip">
            {notice?.topMessage}
          </Content>
        )}
      </ScrollingTextView>
      <ArrowIconBox>
        <ArrowIcon source={noticeArrow} />
      </ArrowIconBox>
      {/*closable不是boolean类型则默认展示*/}
      {typeof notice?.closable !== 'boolean' || notice?.closable === true ? (
        <CloseIconBox onPress={handleClose}>
          <CloseIcon source={dismissCloseIcon} />
        </CloseIconBox>
      ) : null}
      <NoticeDrawer
        bizType={bizType}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        notice={notice}
      />
    </Wrapper>
  );
};
