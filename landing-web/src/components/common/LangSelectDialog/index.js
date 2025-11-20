/**
 * Owner: jesse.shao@kupotech.com
 */
import { Empty, Input } from '@kufox/mui';
import { useDispatch, useSelector } from 'dva';
import { map } from 'lodash';
import React, { useState, useMemo } from 'react';
import {
  FakeDrag,
  LangSelectModal,
  ModalHeader,
  SearchIcon,
  InputWrapper,
  LangList,
  ItemWrapper,
  CheckedIcon,
} from './StyledComps';

const LangItem = React.memo(({ value, onClose }) => {
  const dispatch = useDispatch();
  const { currentLang } = useSelector(state => state.app);
  const active = currentLang === value?.key;
  const handleLangSelect = () => {
    dispatch({
      type: 'app/selectLang',
      payload: {
        lang: value?.key || window._DEFAULT_LANG_,
      },
    });
    onClose && onClose();
  };
  return (
    <ItemWrapper active={active} onClick={handleLangSelect}>
      <span>{value?.label}</span>
      <>{active && <CheckedIcon />}</>
    </ItemWrapper>
  );
});

const LangSelectDialog = ({ visible, onClose }) => {
  const { langs } = useSelector(state => state.app);
  const [search, setSearch] = useState('');
  const filteredLangs = useMemo(
    () => {
      return langs.filter(lang => lang.label?.toLowerCase().includes(search.toLowerCase()));
    },
    [search, langs],
  );
  const handleInputChange = e => {
    setSearch(e.target.value);
  };
  return (
    <LangSelectModal
      header={null}
      footer={null}
      maskClosable
      open={visible}
      onCancel={onClose}
      classNames={{ content: 'content' }}
      rootProps={{ style: { zIndex: 1080 } }}
    >
      <ModalHeader>
        <FakeDrag onClick={onClose} />
      </ModalHeader>
      <InputWrapper>
        <Input
          prefix={<SearchIcon />}
          classNames={{ container: 'search-input' }}
          value={search}
          onChange={handleInputChange}
        />
      </InputWrapper>
      <LangList>
        {filteredLangs?.length ? (
          map(filteredLangs, lang => <LangItem value={lang} key={lang?.key} onClose={onClose} />)
        ) : (
          <Empty size="small" />
        )}
      </LangList>
    </LangSelectModal>
  );
};

export default React.memo(LangSelectDialog);
