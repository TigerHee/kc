/**
 * Owner: willen@kupotech.com
 */
import { Input, styled } from '@kufox/mui';
import useDebounceValue from 'hooks/useDebounceValue';
import { forwardRef, useCallback, useState } from 'react';
import useUpdateEffect from 'src/hooks/useUpdateEffect';
import { ReactComponent as SearchIcon } from 'static/markets/Search.svg';
import { _t } from 'tools/i18n';

const SearchIconNormal = styled(SearchIcon)`
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.colors.text40};
`;

const InputBar = styled.div`
  display: flex;
  height: 40px;
  width: 190px;
  align-items: center;
  border-radius: 4px;
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-basis: 100%;
    width: 100%;
  }
  input {
    ::placeholder {
      color: ${(props) => props.theme.colors.text40};
      font-size: 14px;
      line-height: 22px;
    }
  }
`;

const SearchBar = ({ handleSearch, defaultValue = '' }, ref) => {
  const [value, setValue] = useState(defaultValue);

  const debouncedValue = useDebounceValue(value, 1000);

  useUpdateEffect(() => {
    handleSearch && handleSearch(debouncedValue);
  }, [debouncedValue, handleSearch]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return (
    <InputBar>
      <Input
        value={value}
        placeholder={_t('market.all.crypto.search')}
        onChange={handleChange}
        prefix={<SearchIconNormal />}
        onEnterPress={(evt) => handleSearch(evt.target.value)}
        allowClear
        ref={ref}
      />
    </InputBar>
  );
};
export default forwardRef(SearchBar);
