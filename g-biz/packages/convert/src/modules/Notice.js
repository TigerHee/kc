/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { styled, useTheme, Alert } from '@kux/mui';
import { ICAnnouncementOutlined } from '@kux/icons';
import useContextSelector from '../hooks/common/useContextSelector';

const StyledAlert = styled(Alert)`
  margin-bottom: 16px;
  font-weight: 400;
  padding: 12px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
`;
export const NoticeLink = styled.a`
  color: ${({ theme }) => theme.colors.text60} !important;
  cursor: ${({ href }) => (href ? 'pointer' : 'default')};
`;

const Notice = (props) => {
  const { colors } = useTheme();
  const baseConvertConfig = useContextSelector((state) => state.baseConvertConfig);

  const { message, url } = baseConvertConfig || {};

  if (!message) return null;
  return (
    <StyledAlert
      type="warning"
      icon={<ICAnnouncementOutlined size={16} color={colors.complementary} />}
      title={
        <NoticeLink href={url} target="_blank">
          {message}
        </NoticeLink>
      }
      {...props}
    />
  );
};

export default Notice;
