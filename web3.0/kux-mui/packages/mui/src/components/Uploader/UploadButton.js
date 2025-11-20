import React from 'react';
import useTheme from 'hooks/useTheme';
import styled, { isPropValid } from 'emotion/index';
import { ICPlusOutlined } from '@kux/icons';

const UploaderButton = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 16px 0 12px',
  height: 40,
  outline: 'none',
  borderRadius: 8,
  border: `1px dashed ${props.theme.colors.text20}`,
  fontSize: 16,
  fontWeight: 500,
  color: props.theme.colors.text40,
  background: props.theme.colors.cover2,
  fontFamily: props.theme.fonts.family,
  '&:hover': {
    background: props.theme.colors.cover4,
  },
  cursor: 'pointer',
  'svg': {
    margin: '0 8px 0 0',
  },
  '[dir="rtl"] &': {
    padding: '0 12px 0 16px',
    'svg': {
      margin: '0 0 0 8px',
    },
  },
}));

export default function UploadButton({ children, ...props }) {
  const theme = useTheme();
  return (
    <UploaderButton theme={theme} {...props}>
      <ICPlusOutlined size={20} color={theme.colors.icon} />
      {children}
    </UploaderButton>
  );
}
