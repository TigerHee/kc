/**
 * Owner: tiger@kupotech.com
 */
import { ICSuccessOutlined } from '@kux/icons';
import { styled, Tag } from '@kux/mui';
import { _t } from 'tools/i18n';

const Icon = styled(ICSuccessOutlined)`
  font-size: 14px;
  margin-right: 4px;
  color: ${(props) => props.theme.colors.primary};
`;

export default () => {
  return (
    <Tag color="primary" size="large">
      <Icon />
      <span>{_t('verified')}</span>
    </Tag>
  );
};
