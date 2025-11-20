/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { Alert } from '@kux/mui';
import { MARGIN_MARKS_TIPS } from '../config';
import useEtfTag from '../hooks/form/useEtfTag';

const EtfAlert = (props) => {
  const etfTag = useEtfTag();

  if (!MARGIN_MARKS_TIPS[etfTag]) return null;
  return (
    <Alert
      type="warning"
      showIcon={false}
      title={MARGIN_MARKS_TIPS[etfTag]()}
      style={{ marginTop: 12, fontWeight: 400 }}
      {...props}
    />
  );
};

export default EtfAlert;
