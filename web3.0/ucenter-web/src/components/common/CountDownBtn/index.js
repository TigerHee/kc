/**
 * Owner: willen@kupotech.com
 */

import styled from '@emotion/styled';
import { Spin } from '@kux/mui';
import { useEffect, useState } from 'react';
import { _t } from 'tools/i18n';

const CountDownWrapper = styled.div`
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
  color: ${({ disabled, theme }) => (disabled ? theme.colors.text60 : theme.colors.primary)};
  display: flex;
  align-items: center;
  font-weight: 500;
  .KuxSpin-root {
    margin-left: 5px;
  }
`;

let timer = null;

const CounterDownBtn = ({ init: initProp, onEnd, loading, disabled, onClick }) => {
  const [init, setInit] = useState(-1);

  useEffect(() => {
    if (init >= 0) {
      timer = setTimeout(() => {
        let newInit = init - 1;
        if (newInit <= 0) {
          clearTimeout(timer);
          if (onEnd) {
            onEnd();
          }
        } else {
          setInit(newInit);
        }
      }, 1000);
    }
  }, [init]);

  useEffect(() => {
    setInit(initProp);
    return () => {
      timer && clearTimeout(timer);
    };
  }, [initProp]);

  let text = '';
  if (init <= 0) {
    text = _t('26f293c147e54000a9ee');
  } else {
    text = `${init}s`;
  }

  return (
    <CountDownWrapper disabled={disabled} onClick={() => onClick()}>
      {text} {loading && <Spin spinning type="normal" />}
    </CountDownWrapper>
  );
};

export default CounterDownBtn;
