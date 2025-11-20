/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import FAQList from 'components/$/DepositFAQ';

const FAQPage = () => {
  return (
    <div data-inspector="withdrawQuestionPage">
      <FAQList viewType="withdraw" />
    </div>
  );
};

export default brandCheckHoc(FAQPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
