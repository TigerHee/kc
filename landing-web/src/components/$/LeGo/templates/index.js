/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import Empty from 'components/$/LeGo/components/Empty';
import TemplatesA from 'components/$/LeGo/templates/TemplatesA';

const TEMPLATES_MAP = {
  TemplatesA,
};

const LeGoTemplates = () => {
  const { templateCode } = useSelector(state => state.lego.config);
  const TemplateComponent = TEMPLATES_MAP[`Templates${templateCode}`] || Empty;

  return <TemplateComponent />;
};

export default React.memo(LeGoTemplates);
