import React from "react";
import { Header } from "@krn/ui";
import { showToast } from "@krn/bridge";

export default () => {
  return (
    <Header title="Trading" onPressBack={() => showToast("点了一下返回")} />
  );
};
