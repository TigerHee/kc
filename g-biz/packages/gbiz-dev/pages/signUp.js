/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import { SignUp, SignUpDrawer } from '@kc/entrance/lib/componentsBundle';
import SignUpPng from './signUp.png';

const { Logo, BackgroundImg, RightHeader } = SignUp.LayoutSlots;

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SignUp
        agreeJSX="我已阅读并同意隐私保护政策,风险披露声明,使用条款"
        forgetLeft={<div>AAAA</div>}
      >
        <SignUp.LayoutSlots>
          <Logo>
            <span
              onClick={() => {
                setOpen(true);
              }}
            >
              我是Logo啊234
            </span>
          </Logo>
          {/* <BackgroundUrl>123</BackgroundUrl>
          <Text>我是定制文字啊</Text> */}
          <BackgroundImg src={SignUpPng} />
          <RightHeader>没账户？快速注册</RightHeader>
        </SignUp.LayoutSlots>
      </SignUp>
      <SignUpDrawer
        agreeJSX="我已阅读并同意隐私保护政策,风险披露声明,使用条款"
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
