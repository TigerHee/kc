/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Box, useResponsive } from '@kux/mui';
import React, { useCallback } from 'react';
import Back from 'src/components/common/Back';
import { addLangToPath } from 'tools/i18n';
import { StyledTitle } from './styled';

// --- 样式 start ---

const PageHeader = ({ title, onClick = () => {} }) => {
  const isApp = JsBridge.isApp();
  const responsive = useResponsive();
  const isH5 = !responsive?.sm;

  const handleBack = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = addLangToPath('/support');
    }
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {!isApp && <Back onClick={handleBack} data-inspector="page_header_back" />}
      {!isApp && <Box style={{ height: isH5 ? '24px' : '52px' }} />}
      <StyledTitle>{title}</StyledTitle>
    </div>
  );
};

export default React.memo(PageHeader);
