/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import { ForgetPwd, ForgetPwdDrawer } from '@kc/entrance/lib/componentsBundle';

const { Logo, BackgroundStyle, Text, RightHeader } = ForgetPwd.LayoutSlots;

export default () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <ForgetPwd>
        <ForgetPwd.LayoutSlots>
          <Logo>
            <span
              onClick={() => {
                setShow(true);
              }}
            >
              我是Logo啊234
            </span>
          </Logo>
          <BackgroundStyle>{{ background: 'red' }}</BackgroundStyle>
          <Text>我是定制文字啊</Text>
          <RightHeader>没账户？快速注册</RightHeader>
        </ForgetPwd.LayoutSlots>
      </ForgetPwd>
      <ForgetPwdDrawer
        anchor="right"
        open={show}
        onClose={() => {
          setShow(false);
        }}
      />
    </>
  );
};
