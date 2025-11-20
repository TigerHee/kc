/**
 * Owner: tiger@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import styled from '@emotion/native';
import Button from 'components/Button';
import registerAPI from 'utils/registerAPI';
import { fade } from 'utils/colorManipulator';
import API from './API';

const isDirectionColumn = (v) => v === 'column';

const Wrapper = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const MainBox = styled.View`
  width: 85%;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colorV2.layer};
`;
const BannerImg = styled.Image`
  width: 100%;
  height: 140px;
`;
const Main = styled.View`
  padding: 32px 24px;
`;
const Title = styled.Text`
  font-size: 20px;
  font-style: normal;
  font-weight: bold;
  line-height: 26px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colorV2.text};
`;
const Message = styled.Text`
  font-size: 16px;
  line-height: 24px;
  font-style: normal;
  font-weight: normal;
  color: ${({ theme }) => theme.colorV2.text60};
`;
const Footer = styled.View`
  width: 100%;
  margin-top: 24px;
  ${({ footerDirection }) => {
    if (isDirectionColumn(footerDirection)) {
      return `
        height: 82px;
        flex-direction: column-reverse;
        justify-content: center;
      `;
    }
    return `flex-direction: row;`;
  }}
`;
const MButton = styled(Button)`
  flex: 1;
`;
const TextBtn = styled.Pressable`
  margin-top: 24px;
  justify-content: center;
`;
const TextBtnText = styled.Text`
  line-height: 18px;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  color: ${({ theme }) => theme.colorV2.secondaryButtonText};
`;
const CloseBox = styled.Pressable`
  margin-top: 24px;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  border-color: ${({ theme }) => fade(theme.colorV2.primaryButtonText, 0.5)};
  border-style: solid;
  border-width: 2px;
  position: relative;
`;
const CloseLine = styled.View`
  position: absolute;
  width: 17px;
  height: 2px;
  top: 14px;
  left: 7px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colorV2.primaryButtonText};
`;

const Confirm = ({
  id,
  show,
  onClose,
  style,
  title,
  message,
  cancelText,
  confirmText,
  onConfirm,
  children,
  footerDirection = 'row',
  bannerImg,
  styles,
  showCloseX,
  closeIcon,
}) => {
  useEffect(() => {
    if (show) SheetManager.show(id);
    else SheetManager.hide(id);
  }, [show, id]);

  const isStringTitle = useMemo(() => typeof title === 'string', [title]);
  const isStringMessage = useMemo(() => typeof message === 'string', [message]);
  const cancelBtnStyle = useMemo(() => {
    if (isDirectionColumn(footerDirection)) {
      return {
        marginRight: 0,
        backgroundColor: 'transparent',
      };
    }
    return {
      marginRight: 9,
    };
  }, [footerDirection]);

  return show ? (
    <ActionSheet
      id={id}
      onClose={onClose}
      elevation={0}
      containerStyle={{ backgroundColor: 'transparent' }}
    >
      <Wrapper style={styles.wrapper}>
        {children ? (
          children
        ) : (
          <MainBox style={styles.mainBox}>
            {bannerImg ? <BannerImg source={bannerImg} style={styles.bannerStyle} /> : null}

            <Main bannerImg={bannerImg} style={style}>
              {isStringTitle ? <Title style={styles.title}>{title}</Title> : title}

              {isStringMessage ? <Message style={styles.message}>{message}</Message> : message}

              {cancelText || confirmText ? (
                <Footer footerDirection={footerDirection} style={styles.footer}>
                  {cancelText ? (
                    bannerImg ? (
                      <TextBtn
                        onPress={onClose}
                        type="secondary"
                        style={[cancelBtnStyle, styles.cancelBtn]}
                      >
                        <TextBtnText>{cancelText}</TextBtnText>
                      </TextBtn>
                    ) : (
                      <MButton
                        onPress={onClose}
                        type="secondary"
                        style={[cancelBtnStyle, styles.cancelBtn]}
                      >
                        {cancelText}
                      </MButton>
                    )
                  ) : null}
                  {confirmText ? (
                    <MButton onPress={onConfirm} type="primary" style={styles.okBtn}>
                      {confirmText}
                    </MButton>
                  ) : null}
                </Footer>
              ) : null}
            </Main>
          </MainBox>
        )}
        {showCloseX &&
          (closeIcon ? (
            closeIcon
          ) : (
            <CloseBox onPress={onClose} style={styles.closeBox}>
              <CloseLine style={{ transform: [{ rotate: '-45deg' }] }} />
              <CloseLine style={{ transform: [{ rotate: '45deg' }] }} />
            </CloseBox>
          ))}
      </Wrapper>
    </ActionSheet>
  ) : null;
};

registerAPI(Confirm, API);

export default Confirm;
