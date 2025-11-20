/**
 * Owner: borden@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { kcsensorsManualExpose } from 'src/utils/ga';
import { push } from 'src/utils/router';
import {
  default as deleteOKIcon,
  default as deleteOKIconDark,
} from 'static/account/delete-account-success.svg';
import { _t } from 'tools/i18n';

// --- 样式 start ---
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 80px);
`;

const Content = styled.div`
  margin-top: 80px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 160px;
    height: 160px;
  }
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  margin-top: 32px;
  line-height: 130%; /* 46.8px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const Desc = styled.div`
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  margin-top: 13px;
  line-height: 150%; /* 24px */
`;

const StyledLink = styled.div`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  margin-top: 32px;
  line-height: 130%;
  cursor: pointer;
`;

// --- 样式 end ---

export default ({ onOk, open, ...props }) => {
  const timer = useRef(null);
  const theme = useTheme();
  // 获取email 从 state里
  const {
    user: { email },
  } = useSelector((state) => state.user);
  const [count, setCount] = useState(5);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(timer.current);
      push('/');
    }
    return () => clearInterval(timer.current);
  }, [count]);

  useEffect(() => {
    kcsensorsManualExpose(['Finish', '1']);
  }, []);

  return (
    <Wrapper
      data-inspector="deleteAccount_success"
      open={open}
      title={null}
      cancelText={null}
      onCancel={onOk}
      onOk={onOk}
      okText={_t('account.del.result.ok')}
      {...props}
    >
      <Content>
        <img
          src={theme.currentTheme === 'light' ? deleteOKIcon : deleteOKIconDark}
          alt="delete-icon"
        />
        <Title>{_t('7722660d1ae74000a51f')}</Title>
        <Desc>{_t('9d4d052ddb354000ace8', { email })}</Desc>
        {count !== 0 && (
          <StyledLink onClick={() => push('/')}>
            {_t('503cda4a0ba54000ae9c', { second: count })}
          </StyledLink>
        )}
      </Content>
    </Wrapper>
  );
};
