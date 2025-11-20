/**
 * Owner: tiger@kupotech.com
 */
import { ICSecurityOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'tools/i18n';

const ReTag = styled.div`
  padding: 4px 9px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  width: fit-content;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primary8};
  span {
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 100%;
  }
`;
const Icon = styled(ICSecurityOutlined)`
  font-size: 14px;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default () => {
  return (
    <ReTag>
      <Icon />
      <span>{_t('verified')}</span>
    </ReTag>
  );
};
