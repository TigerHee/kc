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
  margin-bottom: 8px;
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
    margin: 0 6px;
    color: var(--color-text);
  }
  .KuxInput-root {
    flex-grow: 1;
  }
  .input {
    flex: 1;
    padding-right: 8px;
    padding-left: 8px;
  }
`;

export default function MultiPartInput({ label, size, value, onChange, error }) {
  const SEGMENTS = 4; // 分段数量
  const needInitRef = useRef(true);
  const inputRefs = useRef([]);
  const [vals, setVals] = useState(Array(SEGMENTS).fill(''));

  // 初始化
  useEffect(() => {
    if (value && needInitRef.current && vals.every(v => !v)) {
      needInitRef.current = false;
      const arr = value.split('-');
      setVals(prev => prev.map((_, i) => arr[i] || ''));
    }
  }, [value, vals]);

  // 拼接并触发外部 onChange
  useEffect(() => {
    if (vals.every(v => Boolean(v))) {
      needInitRef.current = false;
      onChange(vals.join('-'));
    }
  }, [vals]);

  const handleSetSelectionRange = (el, val) => {
    const len = val?.length || 0;
    setTimeout(() => el?.setSelectionRange(len, len), 10);
  };

  const handleChange = (index, e) => {
    const val = e.target.value.slice(0, 4);
    setVals(prev => {
      const newVals = [...prev];
      newVals[index] = val;
      return newVals;
    });

    // 自动跳转焦点
    if (val.length === 4 && index < SEGMENTS - 1) {
      const nextEl = inputRefs.current[index + 1];
      nextEl?.focus();
      handleSetSelectionRange(nextEl, vals[index + 1]);
    } else if (val.length === 0 && index > 0) {
      const prevEl = inputRefs.current[index - 1];
      prevEl?.focus();
      handleSetSelectionRange(prevEl, vals[index - 1]);
    }
  };

  return (
    <Wrapper>
      <Label error={error}>{label}</Label>
      <InputBox>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              className="input"
              size={size}
              value={vals[i]}
              onChange={e => handleChange(i, e)}
              ref={el => (inputRefs.current[i] = el)}
              error={error}
            />
            {i < SEGMENTS - 1 && <span className="divide">-</span>}
          </div>
        ))}
      </InputBox>
    </Wrapper>
  );
}
