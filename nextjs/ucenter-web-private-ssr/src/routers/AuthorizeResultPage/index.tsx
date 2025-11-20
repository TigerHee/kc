/**
 * Owner: willen@kupotech.com
 */
import Result from 'components/Result';
import requireProps from 'hocs/requireProps';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from '@/tools/i18n';

import FailIcon from 'static/verify-result/fail.svg';
import SuccessIcon from 'static/verify-result/success.svg';

const LOGIN_VERIFY_RESULT = {
  success: {
    icon: SuccessIcon,
    massage: () => _t('cVt7Y6CSjW3KoHDqLvsUpg'),
    describe: () => _t('pWpqpZdDuTeNz8hwByLQwH'),
  },
  failed: {
    icon: FailIcon,
    massage: () => _t('fXmkDpowXU43NwLLvnTHkv'),
    describe: () => _t('tbE9Qnrvx5Uhbqgnnwqidu'),
  },
  expired: {
    icon: FailIcon,
    massage: () => _t('sXBPkpzjzA3vHmNH4sGFHU'),
  },
};

interface AuthorizeResultPageProps {
  loginVerifyResult: 'success' | 'failed' | 'expired';
}

const AuthorizeResultPage = React.memo(({ loginVerifyResult }: AuthorizeResultPageProps) => {
  return <Result describe={''} result={loginVerifyResult} {...LOGIN_VERIFY_RESULT[loginVerifyResult]} />;
});

const Page = connect((state: any) => {
  return {
    loginVerifyResult: state.user.loginVerifyResult,
  };
})(
  requireProps({
    loginVerifyResult(v: string) {
      return !!LOGIN_VERIFY_RESULT[v as keyof typeof LOGIN_VERIFY_RESULT];
    },
  })(AuthorizeResultPage),
);

export default Page;
