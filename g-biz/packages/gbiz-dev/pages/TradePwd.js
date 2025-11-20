/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';

import {
  SecurityVerify,
  SetTradePwdDrawer,
  SetTradePwd,
  LocaleProvider,
} from '@kc/security/lib/componentsBundle';
// import zhCN from '@kc/entrance/lib/locale/zh_CN';
import { Box, Button } from '@kc/mui';
import secEN from '@kc/security/lib/locale/en_US';

import { useVerify } from '@kc/security';

// import enUS from '@kc/entrance/lib/locale/en_US';

// const { Logo, BackgroundUrl, Text, RightHeader } = SignUp.LayoutSlots;

const TradePwd = () => {
  const securityVerify = useVerify();
  const [open, setOpen] = useState(false);

  return (
    <LocaleProvider locale={secEN}>
      <Box>
        <SecurityVerify />
        <Button
          onClick={() =>
            securityVerify('SET_WITHDRAWAL_PASSWORD', () => {
              setOpen(true);
            })
          }
        >
          Verify
        </Button>
        <SetTradePwdDrawer open={open} />
        <SetTradePwd />
      </Box>
    </LocaleProvider>
  );
};

export default TradePwd;
