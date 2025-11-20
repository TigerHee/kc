import React from "react";
import { FallbackPage } from "@krn/ui";
import { exitRN, showToast } from "@krn/bridge";
import { useNavigation } from "@react-navigation/native";

export default () => {
  const navigation = useNavigation();
  return (
    <FallbackPage
      buttonText="重新加载"
      title="连接超时，无法打开网页"
      description="网络异常，您可稍后尝试重新加载该网页"
      onPressBack={() => {
        if (navigation.canGoBack()) navigation.goBack();
        else exitRN();
      }}
      onPressButton={() => showToast("onPressButton")}
    />
  );
};
