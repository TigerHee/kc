/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useState, useCallback} from 'react';
import {Modal, TouchableOpacity, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import {_onClickTrack, FORMAT_TEXT} from 'components/Gembox/config';

const HotView = styled.View`
  font-size: 10px;
  padding: 0 16px;
`;
const QuestionImg = styled.Image`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
`;
const HotText = styled.Text`
  font-weight: normal;
  font-size: 10px;
  color: rgba(0, 20, 42, 0.6);
  margin-right: 4px;
  text-align: left;
`;
const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
`;
const ModalView = styled.View`
  width: 300px;
  border-radius: 4px;
  padding: 24px;
  background: ${({theme}) => theme.color.drawer};
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 5;
`;
const ModalTitle = styled.Text`
  color: ${({theme}) => theme.color.complementary};
  font-weight: bold;
  font-size: 16px;
  text-align: left;
`;
const ModalContent = styled.Text`
  color: ${({theme}) => theme.color.complementary60};
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  margin: 4px 0 16px;
  text-align: left;
`;
const OpenButton = styled.View`
  width: 100%;
  height: 40px;
  background: ${({theme}) => theme.color.primary};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;
const OpenButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
const HotInfoView = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 11px;
`;
const Hot = ({name}) => {
  const {_t} = useLang();
  const [modalVisible, setModalVisible] = useState(false);

  const handleClick = useCallback(() => {
    setModalVisible(true);
    // 点击埋点
    _onClickTrack({
      blockId: 'rankDetail',
      locationId: 1,
    });
  }, []);

  return (
    <HotView>
      {name ? (
        <TouchableOpacity activeOpacity={0.6} onPress={handleClick}>
          <HotInfoView>
            <HotText numberOfLines={1}>{_t('rh3bnja9rkSqhCYZcSGfDr')}</HotText>
            <QuestionImg source={require('assets/gembox/question.png')} />
          </HotInfoView>
        </TouchableOpacity>
      ) : (
        <HotInfoView style={styles.skeletonHotInfo} />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <CenteredView>
          <ModalView>
            <ModalTitle>{_t('rh3bnja9rkSqhCYZcSGfDr')}</ModalTitle>
            <ModalContent>
              {FORMAT_TEXT(_t('we2xCNBqUCtnGEBcfYaaZY'))}
            </ModalContent>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <OpenButton>
                <OpenButtonText>{_t('jKPq6XmVvduriegtqiDfZs')}</OpenButtonText>
              </OpenButton>
            </TouchableOpacity>
          </ModalView>
        </CenteredView>
      </Modal>
    </HotView>
  );
};
const styles = StyleSheet.create({
  skeletonHotInfo: {
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
    width: 54,
  },
});
export default Hot;
