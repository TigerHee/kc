/**
 * Owner: solar@kupotech.com
 */
import { moduleFederation } from '@kucoin-biz/common-base';
import { styled } from '@kux/mui';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Account from './components/Account';
import Currency from './components/Currency';
import Title from './components/Title';
import { TYPES, TypeWrapper } from './components/TypeWrapper';

const { init } = moduleFederation;
init({
  //当前消费者的名称
  name: 'ucenter-web',
  // 依赖的远程模块列表
  remotes: [
    {
      // 生产者名字
      name: 'assets-web',
      // 生产者的模块联邦map文件
      entry: process.env.APP_MF_ASSETS_WEB_MAP,
      // 是否需要预加载资源，默认是false，可不填
      preload: false,
    },
  ],
});

const StyledSubAccount = styled.div`
  padding: 26px 0;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 26px 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 16px 0;
  }
`;
export default function () {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch({
        type: 'MF_assets_web_subAssets/resetState',
      });
    };
  }, [dispatch]);
  return (
    <StyledSubAccount data-inspector="account_sub_assets_page">
      <Title />
      <TypeWrapper>
        {(type) => {
          return (
            <>
              {type === TYPES.CURRENCY && <Currency />}
              {type === TYPES.ACCOUNT && <Account />}
            </>
          );
        }}
      </TypeWrapper>
    </StyledSubAccount>
  );
}
