/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { get } from 'lodash';
import moment from 'moment';
import { styled } from '@kufox/mui/emotion';
import { Empty } from '@kufox/mui';
import { openPage } from 'helper';
import { _t } from 'utils/lang';
import AbsoluteLoading from 'components/AbsoluteLoading';
import { getRuleUrl } from '../config';

const Container = styled.div`
  padding-top: 12px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 12px 5px 8px;
  background: rgba(102, 204, 153, 0.12);
  border-radius: 4px;
`;

const HeadLeft = styled.span`
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.colors.text};
`;

const HeadRight = styled.div`
  font-style: italic;
  font-weight: 700;
  font-size: 18px;
  line-height: 19px;
  text-align: right;
  color: #2dc985;
`;

const Content = styled.div`
  max-height: calc(100vh - 160px);
  margin-top: 12px;
  padding: 12px;
  background: #ffffff;
  border-radius: 12px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    background: transparent;
    width: 2px;
    height: 2px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: rgba(0, 20, 42, 0.2);
  }
`;

const ContentHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentHeadText = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.colors.text40};
`;

const ContentHeadLink = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #2dc985;
  cursor: pointer;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: spce-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 13, 29, 0.08);
`;

const ItemLeft = styled.div`
  flex: 1;
`;

const ItemRight = styled.div`
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  color: #66cc99;
`;

const ItemHead = styled.div`
  display: flex;
  align-items: center;
`;

const ItemName = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 13, 29, 0.68);
`;

const ItemTime = styled.div`
  margin-top: 4px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 13, 29, 0.3);
`;

const LoadingBox = styled.div`
  height: 200px;
`;

const TYPE_CONFIG = {
  1: () => _t('i12aiBLKNexPhYi2oKeCab'),
  2: () => _t('j4ZSF7eMKkNH3Z6NUxJ6jH'),
  3: () => _t('nFTkCDJqhn9czLbo5kkkKx'),
};

const IntegralItem = memo(props => {
  const { createdAt, point, type } = props;
  const typename = get(TYPE_CONFIG, type, () => {});

  return (
    <ItemContainer>
      <ItemLeft>
        <ItemHead>
          <ItemName>{typename()}</ItemName>
        </ItemHead>
        <ItemTime>
          <>
            {_t('bjn5CETzp88gbPmwjTaGpP', {
              data: `${moment.utc(createdAt).format('YYYY-MM-DD HH:mm')} (UTC)`,
            })}
          </>
        </ItemTime>
      </ItemLeft>
      <ItemRight>
        <>+{point}</>
      </ItemRight>
    </ItemContainer>
  );
});

const MyIntegral = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const { scoreData } = useSelector(state => state.cryptoCup);
  const { isInApp, currentLang } = useSelector(state => state.app);
  const loading = useSelector(state => state.loading.effects['cryptoCup/getMyScore']);
  const pointDetailList = scoreData?.pointDetailList || [];

  const goRule = useCallback(
    () => {
      openPage(isInApp, getRuleUrl(currentLang));
    },
    [isInApp, currentLang],
  );

  useEffect(
    () => {
      if (isLogin) {
        // 获取我的积分
        dispatch({
          type: 'cryptoCup/getMyScore',
        });
      }
    },
    [dispatch, isLogin],
  );

  if (loading)
    return (
      <LoadingBox>
        <AbsoluteLoading />
      </LoadingBox>
    );

  return (
    <Container>
      <Head>
        <HeadLeft>{_t('8WwRLHg9fnbc3aZjx4eySj')}</HeadLeft>
        <HeadRight>{scoreData?.totalPoint || 0}</HeadRight>
      </Head>
      <Content>
        <ContentHead>
          <ContentHeadText>{_t('k9R1bmgfX3wKxjaMKCDbSk')}</ContentHeadText>
          <ContentHeadLink onClick={goRule}>{_t('vksL63QDV7TaSLxgWgnrne')}</ContentHeadLink>
        </ContentHead>
        <>
          {pointDetailList.length < 1 ? (
            <Empty size="small" subDescription={_t('dLL7qbXm82g1QRoKfbnLqC')} />
          ) : (
            pointDetailList.map((item, _index) => <IntegralItem key={_index} {...item} />)
          )}
        </>
      </Content>
    </Container>
  );
};

export default MyIntegral;
