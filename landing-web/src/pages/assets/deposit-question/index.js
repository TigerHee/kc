/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import FAQList from 'components/$/DepositFAQ';
import { tenantConfig } from 'src/config/tenant';

const FAQPage = () => {
  return (
    <div data-inspector="depositQuestionPage">
      <FAQList viewType="deposit" />
    </div>
  );
};

export default brandCheckHoc(FAQPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
