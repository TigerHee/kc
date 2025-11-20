/*
 * owner: june.lee@kupotech.com
 */
import React from 'react';
import { useTheme, useResponsive, Input } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { ICSearchOutlined } from '@kux/icons';

const SearchInput = (props) => {
  const theme = useTheme();
  const { sm } = useResponsive();
  const { t: _t } = useTranslation('convert');
  return (
    <Input
      data-inspector="convert_coin_list_search_input"
      allowClear
      size={sm ? 'large' : 'medium'}
      placeholder={_t('9YKMwS9e2v1UX7NMRGYtbA')}
      prefix={<ICSearchOutlined size={sm ? 18 : 16} color={theme.colors.icon60} />}
      {...props}
    />
  );
};

export default React.memo(SearchInput);
