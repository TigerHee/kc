import React from "react";
import { Confirm, Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [show, setShow] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setShow(true)}>显示弹窗</Button>
      <Confirm
        show={show}
        title="标题内容标题内容标题内容标题内容标题"
        message="弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容"
        cancelText="取消"
        confirmText="确认"
        onClose={() => setShow(false)}
      />
    </View>
  );
};
