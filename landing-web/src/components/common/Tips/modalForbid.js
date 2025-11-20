/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import HOST from 'utils/siteConfig';
import systemDynamic from 'utils/systemDynamic';

const ModalForbid = systemDynamic('@remote/entrance', 'ModalForbid');

const Index = props => {
  const { onCancel = () => {} } = props || {};
  const { currentLang } = useSelector(state => state.app);

  return <ModalForbid onCancel={onCancel} currentLang={currentLang} HOST={HOST} />;
};

export default Index;
