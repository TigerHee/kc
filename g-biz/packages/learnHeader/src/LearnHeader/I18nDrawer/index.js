/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Drawer, styled, useTheme, useMediaQuery } from '@kux/mui';
import I18nBox from '../I18nBox';
import { SURPORT_LANG } from '../config';

const CusDrawer = styled(Drawer)`
  max-width: 400px;
  width: 100%;
  .KuxDrawer-content {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default function I18nDrawer({ show, type = 'lang', onClose, ...rest }) {
  const isMobile = useMediaQuery('(max-width:400px)');
  const theme = useTheme();
  return (
    <CusDrawer
      headerProps={{ close: false }}
      show={show}
      anchor="right"
      isMobile={isMobile}
      onClose={onClose}
      colors={theme.colors}
      headerBorder={false}
      onBack={onClose}
    >
      <I18nBox
        inDrawer
        type={type}
        {...rest}
        closeI18nDrawer={onClose}
        surportLanguages={SURPORT_LANG}
      />
    </CusDrawer>
  );
}
