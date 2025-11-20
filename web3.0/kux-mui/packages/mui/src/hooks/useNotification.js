/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { NotificationContext } from 'context/index';

const useNotification = () => {
  return React.useContext(NotificationContext);
};

export default useNotification;
