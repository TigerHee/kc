/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import Result from 'components/Result';
import requireProps from 'hocs/requireProps';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';

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

const AuthorizeResultPage = React.memo(({ loginVerifyResult }) => {
  useLocale();
  return <Result result={loginVerifyResult} {...LOGIN_VERIFY_RESULT[loginVerifyResult]} />;
});

export default connect((state) => {
  return {
    loginVerifyResult: state.user.loginVerifyResult,
  };
})(
  requireProps({
    loginVerifyResult(v) {
      return !!LOGIN_VERIFY_RESULT[v];
    },
  })(AuthorizeResultPage),
);
