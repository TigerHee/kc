/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { noop } from 'lodash';
import { _t } from 'src/utils/lang';

import { Row, DisplayInput, HiddenInput, Password } from './style';

const InputsNums = [1, 2, 3, 4, 5, 6];

const defaultValueRender = (val, idx) => (val[idx - 1] ? <Password>*</Password> : '');

const InputPwd = React.memo(({
  clearFlag,
  close = true,
  onChange = noop,
  autoFocus = true,
  valueRender = defaultValueRender,
}) => {
  const [pwd, setPwd] = useState('');
  const [curIdx, setCurIdx] = useState(0);
  const [focused, setFocused] = useState(false);


  const inputRef = useRef(null);
  const flagRef = useRef(null);

  /**
   * 密码校验已经聚焦显示移位
   *
   * @param   {[type]}  e  [e description]
   *
   * @return  {[type]}     [return description]
   */
  const handlePwdChange = useCallback((e) => {
    const value = (e.target.value || '').replace(/[^\d]/g, '');
    const len = value.toString().length;
    if (len > 6) {
      return;
    }
    setPwd(value);
    onChange(value);
  }, []);

  /**
   * 点击任意框的时候，使输入框聚焦
   *
   * @return  {[type]}  [return description]
   */
  const handlePwdBoxClick = useCallback(
    (e) => {
      e.persist();
      const isbox = e.target.classList.contains('trade-pwd-box');
      if (isbox) {
        inputRef.current.focus();
        setCurIdx(pwd.length + 1);
        setFocused(true);
      }
      // setTimeout(() => {
      //   flagRef.current.scrollIntoView();
      // }, 100);
    },
    [pwd],
  );

  const handlePwdBlur = useCallback(() => {
    setFocused(false);
  }, []);

  /**
   * 根据密码长度来移动聚焦框
   */
  useEffect(() => {
    setCurIdx(pwd.length + 1);
  }, [pwd]);

   /**
   * 清除输入
   */
   useEffect(() => {
    if (clearFlag) {
      setPwd('');
      inputRef.current.value = '';
    }
  }, [clearFlag]);

  /**
   * 唤起时自动聚焦
   */
  useEffect(() => {
    if (autoFocus) {
      const u = navigator.userAgent;
      if (!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        if (inputRef.current) inputRef.current.focus();
        setFocused(true);
      }
    }
  }, []);

  return (
    <div>
      <Row onClick={handlePwdBoxClick}>
        {InputsNums.map((idx) => {
          const isActive = (curIdx < 6 ? curIdx === idx : idx > 5) && focused;
          return (
            <DisplayInput key={idx} className="trade-pwd-box" isActive={isActive}>
              {close ? valueRender(pwd, idx) : (pwd[idx - 1] || '')}
            </DisplayInput>
          );
        })}
      </Row>
      <HiddenInput
        id="pwdInput"
        name="newpassword"
        maxLength={6}
        type="number"
        autoComplete="off"
        ref={inputRef}
        onChange={handlePwdChange}
        onBlur={handlePwdBlur}
      />
      <div ref={flagRef} />
    </div>
  );
});

export default InputPwd;
