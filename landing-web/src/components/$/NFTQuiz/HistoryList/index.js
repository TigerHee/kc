/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { useEventCallback } from '@kufox/mui/hooks';
import { px2rem as _r } from '@kufox/mui/utils';
import { useSelector } from 'dva';
import { map, filter, debounce, isEmpty } from 'lodash';
import Loading from 'components/Loading';
import { Event, getUtcZeroTime, numberFixed } from 'helper';
import { _t, _tHTML } from 'utils/lang';
import { NFT_QUIZ_TYPES as TYPES } from 'config';
import emptyIcon from 'assets/NFTQuiz/empty.png';
import { useQuizContext } from '../context';

const Wrapper = styled.section`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: ${({ first }) => first ? _r(12) : 0 };
`;

const Title = styled.p`
  margin-bottom: ${_r(13)};
  text-align: left;
`;

const Row = styled.p`
  margin-bottom: ${_r(4)};
  display: flex;
  justify-content: space-between;
`;

const Reward = styled.span`
  color: #fff;
`;

const Amout = styled(Reward)`
  color: rgba(255, 255, 255, 0.4);
  .className {
    color: rgba(128, 220, 17, 1);
  }
`;

const Line = styled.p`
  height: 1px;
  background: rgba(188, 200, 224, 0.12);
  margin: ${_r(16)} 0 ${_r(12)} 0;
`;

const Empty = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${_r(120)};
  margin-bottom: 0;
  text-align: center;
  font-weight: 400;
  font-size: ${_r(14)};
  color: rgba(225, 232, 245, 0.4);
  >img {
    width: ${_r(100)};
    height: ${_r(100)};
    border: none;
    margin-bottom: ${_r(12)};
  }
`;

const rowConfig = [
  {
    title: _t('h6wXkgM3X5pcJKVPcC9mQD'),
    render({ correctNum, totalNum } = {}) {
      const ratePrecent = numberFixed(((correctNum / (totalNum || 1)) * 100), 2);
      const rateTxt = `${ratePrecent}%`;
      return _t('kLJnPFNYgYHHjTfeKzF2Kf', {
        CorrectedNumber: correctNum,
        totalNumber: totalNum,
        AccuracyRate: rateTxt,
      });
    }
  },
  {
    title: _t('oWRi4keEjfcQJ3a4LRGtdp'),
    render({ pass } = {}) {
      return pass ? _t('6PnwKLBnt4e53vv8CNCtDm') : _t('oYqFtzwPJeupUTeCnoGqXk')
    }
  },
  {
    title: _t('dq97au8WD7jV7eKwXpPUKT'),
    render({ carveUpAmount, currency } = {}) {
      return <Reward>
        {_t('uU2T9WZfmbuofzbDzDtYgm', {
          NumberAll: carveUpAmount,
          TokenName: currency,
        })}
      </Reward>;
    },
    checkPass: true,
  },
  {
    title: _t('mivLF5UPu5vY78JfYtbCmJ'),
    render({ amount,  pass, currency } = {}) {
      if (!pass) return '';
      if (amount > 0) {
        return (
          <Amout>
            {_tHTML('oiSgqNCUu2v8HbT8jTVgxw', {
              Number1: numberFixed(amount || 0, 4),
              TokenName: currency,
            })}
          </Amout>
        );
      }
      return _t('dHt9NmkSYDrJ6dPMGpNGVj');
    },
    checkPass: true,
  }
]
const HistoryList = () => {
  const loading = useSelector(state => state.loading.effects['nftQuiz/getActivityRecords']);
  const { viewType, dispatch, historyList } = useQuizContext();
  const { items: list } = historyList || {};
  const handlePageScroll = useEventCallback((element) => {
    if (viewType !== TYPES.HIS || loading) return;
    const scrollTop = element?.scrollTop || 0;
    const windowHeight = document?.documentElement?.clientHeight || document.body.clientHeight;
    const scrollHeight = document?.documentElement?.scrollHeight || document.body.scrollHeight;
    if (
      Math.ceil(scrollTop + windowHeight) === parseInt(scrollHeight) &&
      scrollTop != 0
    ) {
      if (loading) return;
      dispatch({
        type: 'nftQuiz/getActivityRecords',
        withNext: true,
      })
    }
  });
  
  useEffect(() => {
    const element = document.documentElement;
    if (!element) return;
    const handler = debounce(() => {
      handlePageScroll(element);
    }, 200);
    Event.addHandler(window, 'scroll', handler);
    Event.addHandler(window, 'resize', handler);
    return () => {
      Event.removeHandler(window, 'scroll', handler);
      Event.removeHandler(window, 'resize', handler);
    }
  }, []);

  const isCurrent = viewType === TYPES.HIS;
  if (!isCurrent) return null;
  return (
    <>
      {loading && <Loading />}
      {(isEmpty(list) && !loading) ? (
        <Empty>
          <img alt="empty-icon" src={emptyIcon} />
          {_t('guardianStar.empty.default')}
        </Empty>
      ) : null}
      {
        map(list, (item, index) => {
          const {
            createdAt,
          } = item || {};
          const filterdConfig = filter(rowConfig, cfg => {
            if (cfg.checkPass && !item.pass) return false;
            return true;
          });
          return (
            <Wrapper key={createdAt} first={index === 0}>
              <Title>{`${getUtcZeroTime(createdAt)} (UTC)`}</Title>
              {
                map(filterdConfig, (config, index) => {
                  return (
                    <Row key={index}>
                      <span>{config.title}</span>
                      <span>{config.render(item)}</span>
                    </Row>
                  )
                })
              }
              <Line />
            </Wrapper>
          );
        })
      }
    </>
  );
};

export default HistoryList;