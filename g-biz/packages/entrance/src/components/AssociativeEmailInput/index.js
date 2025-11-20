/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { map } from 'lodash';
import { Input, useTheme, styled } from '@kux/mui';

const Container = styled.div`
  position: relative;
  z-index: 1;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  margin: 0 0 0;
  padding: 0;
  width: 100%;
  max-height: 336px;
  overflow-y: auto;
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
`;

const DeopdownMenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 56px;
  padding: 0px 16px;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  list-style: none;
  color: ${(props) => props.theme.colors.text40};
  cursor: pointer;
  word-wrap: break-word;
  direction: ltr;
  [dir='rtl'] & {
    justify-content: flex-end;
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.cover2};
  }
`;

const SuffixText = styled.span`
  direction: ltr;
  color: ${(props) => props.theme.colors.text};
`;

const AssociativeEmailInput = (props) => {
  const { namespace, onInput, onBlur, onChange } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { emailSuffixes } = useSelector((state) => state[namespace]);
  const seperatorIndex = inputValue.indexOf('@'); // 分隔符索引
  const seperatorPos = seperatorIndex > -1 ? seperatorIndex : inputValue.length;
  const prefix = inputValue.slice(0, seperatorPos); // 前缀部分

  // 针对当前输入匹配后缀
  const matchedSuffixes = useMemo(() => {
    if (seperatorIndex === -1) return emailSuffixes;
    const _suffix = inputValue.slice(seperatorIndex + 1);
    // eslint-disable-next-line consistent-return, array-callback-return
    return emailSuffixes.filter((item) => {
      if (item.startsWith(_suffix)) return item;
    });
  }, [seperatorIndex, emailSuffixes, inputValue]);

  // 是否有匹配的后缀：没有时不弹出下拉框
  const hasMatchedSuffix = (v) => {
    if (typeof v === 'string') {
      if (v === '') return false;
      const _index = v.indexOf('@');
      if (_index === -1) return true;
      const inputSuffix = v.slice(_index + 1);
      return emailSuffixes.some((item) => item.startsWith(inputSuffix));
    }
    return false;
  };

  const handleInput = (e) => {
    const _value = e.target.value;
    setInputValue(_value);
    setShowDropdown(hasMatchedSuffix(_value));
    typeof onInput === 'function' && onInput(_value);
  };

  const handleChoose = (suffix) => {
    const _full = `${prefix}@${suffix}`;
    setShowDropdown(false);
    typeof onChange === 'function' && onChange(_full);
  };

  const handleBlur = () => {
    typeof onBlur === 'function' && onBlur();
    setShowDropdown(false);
  };

  useEffect(() => {
    if (emailSuffixes?.length > 0) {
      return;
    }
    dispatch({ type: `${namespace}/getEmailSuffixes` });
  }, [emailSuffixes?.length, namespace, dispatch]);

  return (
    <Container>
      <Input {...props} onInput={handleInput} onBlur={handleBlur} ref={inputRef} allowClear />
      {showDropdown ? (
        <DropdownMenu theme={theme}>
          {map(matchedSuffixes, (item) => (
            <DeopdownMenuItem
              style={{ direction: 'ltr' }}
              key={item}
              theme={theme}
              onMouseDown={() => handleChoose(item)}
            >
              {`${prefix}@`}
              <SuffixText theme={theme}>{item}</SuffixText>
            </DeopdownMenuItem>
          ))}
        </DropdownMenu>
      ) : null}
    </Container>
  );
};

export default AssociativeEmailInput;
