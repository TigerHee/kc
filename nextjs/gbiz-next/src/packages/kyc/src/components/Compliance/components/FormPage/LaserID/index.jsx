import { useEffect, useState, useRef } from 'react';
import { Input, styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
`;
export const Label = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 4px;
  color: ${({ error }) => (error ? 'var(--color-secondary)' : 'var(--color-text)')};
`;
export const InputBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  .divide {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    margin: 0 8px;
    color: var(--color-text);
  }
  .KuxInput-root {
    flex-grow: 1;
  }
  .input1,
  .input3 {
    flex: 1;
  }
  .input2 {
    flex: 2;
  }
`;

export default (props) => {
  const { label, size, value, onChange, error } = props;
  const needInitRef = useRef(true);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');

  useEffect(() => {
    if (value && needInitRef.current && !(val1 && val2 && val3)) {
      needInitRef.current = false;
      const arr = value.split('-');
      setVal1(arr[0] || '');
      setVal2(arr[1] || '');
      setVal3(arr[2] || '');
    }
  }, [value, val1, val2, val3]);

  useEffect(() => {
    if (val1 && val2 && val3) {
      needInitRef.current = false;
      const newVal = `${val1}-${val2}-${val3}`;
      onChange(newVal);
    }
  }, [val1, val2, val3]);

  const handleSetSelectionRange = (el, val) => {
    const rangeLength = val.length || 0;
    setTimeout(() => {
      el?.setSelectionRange(rangeLength, rangeLength);
    }, 10);
  };

  return (
    <Wrapper>
      <Label error={error}>{label}</Label>
      <InputBox>
        <Input
          className="input1"
          size={size}
          value={val1}
          onChange={(e) => {
            const val = e.target.value.slice(0, 3);
            setVal1(val);
            if (val.length === 3) {
              inputRef2.current.focus();
              handleSetSelectionRange(inputRef2.current, val2);
            }
          }}
          ref={inputRef1}
          error={error}
        />
        <span className="divide">-</span>
        <Input
          className="input2"
          inputProps={{ inputMode: 'numeric' }}
          size={size}
          value={val2}
          onChange={(e) => {
            const val = e.target.value?.replace(/[^0-9]/g, '')?.slice(0, 7);
            setVal2(val);
            if (val.length === 7) {
              inputRef3.current.focus();
              handleSetSelectionRange(inputRef3.current, val3);
            }
            if (val.length === 0) {
              inputRef1.current.focus();
              handleSetSelectionRange(inputRef1.current, val1);
            }
          }}
          ref={inputRef2}
          error={error}
        />
        <span className="divide">-</span>
        <Input
          className="input3"
          inputProps={{ inputMode: 'numeric' }}
          size={size}
          value={val3}
          onChange={(e) => {
            const val = e.target.value?.replace(/[^0-9]/g, '')?.slice(0, 2);
            setVal3(val);
            if (val.length === 0) {
              inputRef2.current.focus();
              handleSetSelectionRange(inputRef2.current, val2);
            }
          }}
          ref={inputRef3}
          error={error}
        />
      </InputBox>
    </Wrapper>
  );
};
