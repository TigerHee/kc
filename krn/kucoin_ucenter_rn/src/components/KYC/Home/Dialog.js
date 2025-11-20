import React from 'react';
import {Modal} from 'react-native';
import styled from '@emotion/native';
import {Button, useTheme} from '@krn/ui';
import useLang from 'hooks/useLang';

const Title = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 20px;
  font-style: normal;
  font-weight: bold;
  line-height: 26px;
  word-wrap: break-word;
`;
const Layer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  /* background-color: ${props => props.theme.colorV2.mask}; */
`;
const Box = styled.View`
  margin: 28px;
  width: 85%;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${props => props.theme.colorV2.layer};
  padding: 32px 24px;
`;

const Content = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 24px;
  margin-top: 12px;
  margin-bottom: 24px;
`;
const Footer = styled.View`
  flex-direction: row;
`;
const MButton = styled(Button)`
  border-radius: 24px;
  height: 40px;
  flex: 1;
  background-color: ${({theme, type}) => {
    let color = '';
    if (type === 'primary') {
      color = theme.type === 'dark' ? 'primary' : 'cover';
    }
    if (type === 'default') {
      color = theme.type === 'dark' ? 'cover8' : 'cover4';
    }
    return theme.colorV2[color];
  }};
`;
const MMButton = props => {
  const theme = useTheme();
  let color = '';
  if (props.type === 'primary') {
    color = 'textEmphasis';
  }
  if (props.type === 'default') {
    color = 'text';
  }
  return <MButton textStyle={{color: theme.colorV2[color]}} {...props} />;
};
export default ({content, title, onCancel, onConfirm, okText, ...rest}) => {
  const {_t} = useLang();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      {...rest}
      onRequestClose={onCancel}>
      <Layer>
        <Box>
          <Title>{title}</Title>
          <Content>{content}</Content>
          <Footer>
            <MMButton
              type="default"
              onPress={onCancel}
              style={{marginRight: 9}}>
              {_t('cancel')}
            </MMButton>

            <MMButton type="primary" onPress={onConfirm}>
              {okText || _t('confirm')}
            </MMButton>
          </Footer>
        </Box>
      </Layer>
    </Modal>
  );
};
