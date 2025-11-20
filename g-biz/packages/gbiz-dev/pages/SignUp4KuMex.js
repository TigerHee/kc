/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
// import { SignUp } from '@kc/entrance/lib/componentsBundle';

import { Signup4KuMEXDrawer, LocaleProvider } from '@kc/entrance/lib/componentsBundle';
// import { formatUtmAndRcodeUrl } from '@kc/entrance';
import zhCN from '@kc/entrance/lib/locale/zh_CN';
// import enUS from '@kc/entrance/lib/locale/en_US';

// const { Logo, BackgroundUrl, Text, RightHeader } = SignUp.LayoutSlots;

// console.log(formatUtmAndRcodeUrl('www.baidu.com'));

export default () => {
  // const handleTabChange = (tabKey) => {
  //   dispatch({
  //     type: `${namespace}/update`,
  //     payload: {
  //       bizType: tabKey,
  //     },
  //   });
  // };

  // const [flag, setFlag] = useState(true);

  // const onChange = (e) => {
  //   console.log(e);
  // };

  // const logo = () => {
  //   return <div>123</div>;
  // };

  const Footer = () => {
    return <div>123</div>;
  };
  const NumberComponent = () => {
    return <div>123456</div>;
  };
  const agreeJSX = () => {
    return <div>712345689</div>;
  };

  // return <Box width={480}>
  //   {/* <h3>{t('sign')}</h3> */}
  //   <Tabs defaultKey={'PHONE_REGISTER'} onChange={handleTabChange}>
  //     <Tabs.TabPane key={'PHONE_REGISTER'} title={'PHONE_REGISTER'}>
  //       <EmailSignForm onChange={onChange} />
  //     </Tabs.TabPane>
  //     <Tabs.TabPane key={'EMAIL_REGISTER'} title={'EMAIL_REGISTER'}>
  //       <PhoneSignForm onChange={onChange} />
  //     </Tabs.TabPane>
  //   </Tabs>
  //   <Snackbar ref={toast} />
  //   <HumanCaptcha bizType={bizType} namespace={namespace} />
  // </Box>
  return (
    <LocaleProvider locale={zhCN}>
      <Signup4KuMEXDrawer
        open
        anchor="right"
        defaultCountryCode="ZZ"
        Footer={Footer()}
        NumberComponent={NumberComponent()}
        agreeJSX={agreeJSX()}
        BoxProps={{ width: '472px', pl: 8, pr: 8 }}
      />
    </LocaleProvider>
  );
};
