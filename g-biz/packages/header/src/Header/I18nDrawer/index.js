/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Drawer, styled } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import I18nBox from '../I18nBox';

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

export default function I18nDrawer({
  show,
  type = 'lang',
  onClose,
  keepMounted,
  currentLang,
  ...rest
}) {
  const isRTL = isRTLLanguage(currentLang);

  return (
    <CusDrawer
      headerProps={{ close: false }}
      show={show}
      anchor={isRTL ? 'left' : 'right'}
      onClose={onClose}
      headerBorder={false}
      onBack={onClose}
      keepMounted={keepMounted}
    >
      {show ? (
        <I18nBox
          inDrawer
          type={type}
          {...rest}
          closeI18nDrawer={onClose}
          currentLang={currentLang}
        />
      ) : (
        <span />
      )}
    </CusDrawer>
  );
}
