/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { Alert } from '@kux/mui';
import { useSelector } from 'react-redux';
import { NAMESPACE } from '../../config';

const PriceNotice = (props) => {
  const formStatus = useSelector((state) => state[NAMESPACE].formStatus);

  if (!formStatus) return null;
  return (
    <Alert
      showIcon
      type="warning"
      title={formStatus}
      style={{ marginTop: 16, fontWeight: 400 }}
      {...props}
    />
  );
};

export default PriceNotice;
