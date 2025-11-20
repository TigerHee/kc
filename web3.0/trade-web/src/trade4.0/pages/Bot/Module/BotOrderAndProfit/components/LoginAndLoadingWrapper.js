/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _tHTML } from 'utils/lang';
import getMainsiteLink from 'utils/getMainsiteLink';
import { styled } from '@/style/emotion';
import { useSelector } from 'dva';
import Spin from '@mui/Spin';
import isEmpty from 'lodash/isEmpty';
import Empty from '@mui/Empty';

const FullHeightSpin = styled(Spin)`
  height: calc(100% - 30px);
`;

const FullHeightEmpty = styled.div`
  height: 100%;
`;

export const LoginWrapper = styled.div`
  height: 100%;
  flex: 1;
  padding: 0 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: ${(props) =>
    (props.screen === 'md' || props.screen === 'lg' ? '14px' : '16px')};
  line-height: ${(props) =>
    (props.screen === 'md' || props.screen === 'lg' ? '18px' : '21px')};
  color: ${(props) => props.theme.colors.text};
`;


const { registerUrl } = getMainsiteLink();

/**
 * @description:
 * @param {string} type (OnlyLogin, others)
 * @return {*}
 */
export default function LoginAndLoadingWrapper({
  screen,
  modelConfig = {
    name: '',
    effect: '',
    stateKey: '',
  },
  type,
  children,
}) {
  const isLogin = useSelector((state) => state.user.isLogin);

  const isLoading = useSelector((state) =>
  (type !== 'OnlyLogin'
    ? state.loading.effects[`${modelConfig.name}/${modelConfig.effect}`]
    : false),
  );
  const lists = useSelector((state) =>
    (type !== 'OnlyLogin' ? state[modelConfig.name][modelConfig.stateKey] : []),
  );

  if (!isLogin) {
    return (
      <LoginWrapper screen={screen}>
        {_tHTML('trd.form.login.reg', { registerUrl })}
      </LoginWrapper>
    );
  }

  if (type !== 'OnlyLogin') {
    if (isLoading && isEmpty(lists)) {
      return <FullHeightSpin className="bot-loading" />;
    }
    if (isEmpty(lists)) {
      return <FullHeightEmpty className="bot-empty"><Empty /></FullHeightEmpty>;
    }
  }
  return children;
}
