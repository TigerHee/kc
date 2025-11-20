import React from 'react';
import { Confirm, Button } from '@krn/ui';
import { View } from 'react-native';
import bannerImg from './img/header.png';

export default () => {
  const [show, setShow] = React.useState(false);

  return (
    <View>
      <Button onPress={() => setShow(true)}>带图弹窗</Button>
      <Confirm
        show={show}
        title="带图弹窗标题"
        message="弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容"
        cancelText="取消"
        confirmText="确认"
        onClose={() => setShow(false)}
        onConfirm={() => setShow(false)}
        bannerImg={bannerImg}
        footerDirection="column"
      />
    </View>
  );
};
