import React from "react";
import { Radio } from "@krn/ui";

export default () => {
  const [checked, setChecked] = React.useState(1);
  return (
    <Radio.Group
      value={checked}
      onChange={setChecked}
      style={{ flexDirection: "row" }}
    >
      <Radio value={1}>张三</Radio>
      <Radio value={2} style={{ marginLeft: 10 }}>
        李四
      </Radio>
    </Radio.Group>
  );
};
