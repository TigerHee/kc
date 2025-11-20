/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { debounce } from 'lodash';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'dva';
import { px2rem } from '@kufox/mui/utils';
import { _t } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import { LANDING_HOST } from 'utils/siteConfig';
import H5HeaderNew from 'components/H5HeaderNew';

// --- 样式start ---
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const List = styled.ul`
  margin-top: ${px2rem(24)};
  padding: 0 ${px2rem(24)};
  list-style: none;
  li {
    margin-bottom: ${px2rem(24)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
    width: 100%;
    span {
      display: block;
      word-break: break-all;
    }
  }
`;
// --- 样式end ---
export default React.memo(props => {
  const { isInApp } = useSelector(state => state.app);
  const {
    activityConfig = {}, // 活动配置
  } = useSelector(state => {
    return state.prediction;
  });
  const { guessLimit, futureAmount, spotAmount } = activityConfig;
  const { push } = useHistory();
  const appUrl = `${LANDING_HOST}/prediction`;
  const url = `/prediction`;
  const dispatch = useDispatch();
  // 获取数据
  useEffect(
    () => {
      dispatch({
        type: 'prediction/getConfig',
      });
    },
    [dispatch],
  );
  // 回到Home
  const backHome = useCallback(
    debounce(
      () => {
        // 跳转
        if (isInApp) {
          const _url = `/link?url=${encodeURIComponent(appUrl)}`;
          JsBridge.open({
            type: 'jump',
            params: {
              url: _url,
            },
          });
        } else {
          push(url);
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [appUrl, url],
  );
  return (
    <Wrapper>
      <H5HeaderNew isInApp={isInApp} onClickBack={backHome} title={_t('prediction.entrance.rule')} />
      <List>
        <li>{_t('prediction.rule1')}</li>
        <li>
          <span>{_t('prediction.rule2')}</span>

          <span>{_t('prediction.rule3')}</span>

          <span>{_t('prediction.rule4', { a: guessLimit, b: spotAmount, c: futureAmount })}</span>
          <span>{_t('prediction.rule5')}</span>

          <span>{_t('prediction.rule6')}</span>
        </li>

        <li>
          <span>{_t('prediction.rule7')}</span>

          <span>{_t('prediction.rule8')}</span>

          <span>{_t('prediction.rule9')}</span>

          <span>{_t('prediction.rule10')}</span>

          <span> {_t('prediction.rule11')}</span>

        </li>
        <li>
          <span>{_t('prediction.rule13')}</span>

          <span> {_t('prediction.rule14')}</span>

          <span>{_t('prediction.rule15')}</span>

          <span>{_t('prediction.rule16')}</span>

          <span>{_t('uxphWQNFtzvQJW6zgwWqE2')}</span>
        </li>
      </List>
    </Wrapper>
  );
});
