/*
 * @Owner: Clyne@kupotech.com
 */
import React, { useEffect } from 'react';
import Form from '@mui/Form';
import Input from '@mui/Input';
import { _t, _tHTML } from 'utils/lang';
import { ICSearchOutlined } from '@kux/icons';
import { useTheme } from '@emotion/react';
import { SearchWrapper } from './style';
import { useChange } from './useChange';
import { SEARCH_FORM_EVENT, SEARCH_KEY, namespace } from '../../config';
import { event } from 'src/trade4.0/utils/event';
import { useSelector } from 'dva';

const { useForm, FormItem } = Form;

const Search = () => {
  const [form] = useForm();
  const theme = useTheme();
  const { onChange } = useChange();
  const keyword = useSelector((state) => state[namespace].keyword);
  useEffect(() => {
    const handle = (value) => {
      const values = { [SEARCH_KEY]: value };
      form.setFieldsValue(values);
      onChange(values);
    };
    event.on(SEARCH_FORM_EVENT, handle);
    return () => {
      event.off(SEARCH_FORM_EVENT, handle);
    };
  }, [form, onChange]);
  return (
    <SearchWrapper className="market-search pl-12 pr-12 mt-12">
      <Form form={form} onValuesChange={onChange}>
        <FormItem name={SEARCH_KEY} initialValue={keyword}>
          <Input
            className="search-input"
            size="small"
            allowClear
            placeholder={_t('t9sd5TvoKs1RGkncbLRrti')}
            variant={'filled'}
            prefix={<ICSearchOutlined size={12} color={theme.colors.icon} />}
          />
        </FormItem>
      </Form>
    </SearchWrapper>
  );
};

export default Search;
