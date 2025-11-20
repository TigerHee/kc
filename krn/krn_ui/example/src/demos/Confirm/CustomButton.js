import React from "react";
import { Confirm, Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Button style={{ marginRight: 5 }} onPress={() => setShow(true)}>
          只显示取消
        </Button>
        <Button onPress={() => setShow2(true)}>只显示确认</Button>
      </View>
      <Confirm
        show={show}
        message="弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容"
        cancelText="取消"
        onClose={() => setShow(false)}
      />
      <Confirm
        show={show2}
        message="弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容弹窗内容"
        confirmText="确认"
        onClose={() => setShow2(false)}
        onConfirm={() => setShow2(false)}
      />
    </>
  );
};
