/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React, {useState} from 'react';
import {useTheme} from '@krn/ui';
import useLang from 'hooks/useLang';
import searchImg from 'assets/convert/search.png';
import {Platform} from 'react-native';
import search_clear from 'assets/convert/clear.png';
import {TouchableWithoutFeedback} from 'react-native';

const ClearImg = styled.Image`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;
const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  height: 40px;

  border-radius: 8px;
  padding: 8px 16px;
  margin: 8px 16px 4px;
  align-items: center;
  border-color: ${({theme}) => theme.colorV2.cover12};
  border-width: 1px;
`;
const SearchImg = styled.Image`
  width: 20px;
  height: 20px;
`;
const InputBox = styled.View`
  flex: 1;
  flex-direction: row;
`;
const Input = styled.TextInput`
  font-size: 14px;
  height: 22px;
  padding-left: 8px;
  flex: 1;
  color: ${({theme}) => theme.colorV2.text};
  padding-top: 0;
  padding-bottom: 0;
  top: ${({isIOS}) => (isIOS ? 0 : '2px')};
  text-align: ${({theme}) => (theme.isRTL ? 'right' : 'left')};
`;
export default ({handleSearch}) => {
  const theme = useTheme();
  const {_t} = useLang();

  const [value, setValue] = useState('');
  const clear = () => {
    setValue('');
    typeof handleSearch === 'function' && handleSearch('');
  };
  return (
    <Wrapper>
      <SearchImg source={searchImg} autoRotateDisable />
      <InputBox>
        <Input
          selectionColor={theme.colorV2.primary}
          isIOS={Platform.OS === 'ios'}
          placeholder={_t('7Wqs2BnVWNbuapZkzD8N16')}
          placeholderTextColor={theme.colorV2.text40}
          onChangeText={text => {
            setValue(text);
            typeof handleSearch === 'function' && handleSearch(text);
          }}
          value={value}
        />
      </InputBox>
      {value ? (
        <TouchableWithoutFeedback onPress={clear}>
          <ClearImg source={search_clear} />
        </TouchableWithoutFeedback>
      ) : null}
    </Wrapper>
  );
};
