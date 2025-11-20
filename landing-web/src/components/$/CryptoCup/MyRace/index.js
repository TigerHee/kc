/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { Empty } from '@kufox/mui';
import { get } from 'lodash';
import { _t } from 'utils/lang';
import AbsoluteLoading from 'components/AbsoluteLoading';
import RaceItem from './RaceItem';
import MatchRulesModal from '../MatchArenaModal/Rules';

const Box = styled.div``;

const LoadingBox = styled.div`
  height: 200px;
`;

const MyRace = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loading = useSelector((state) => state.loading.effects['cryptoCup/getMyRace']);
  const { isLogin } = useSelector((state) => state.user);
  const { raceList = [] } = useSelector((state) => {
    return state.cryptoCup;
  });
  const { campaigns } = useSelector((state) => state.cryptoCup);
  const campaignId = get(campaigns, 'id', undefined);
  const currentSeasonId = get(campaigns, 'currentSeasonId', undefined);

  const handleClose = useCallback(() => {
    setOpen(false);
    dispatch({
      type: 'cryptoCup/update',
      payload: {
        detailTeam: [],
      },
    });
  }, [dispatch]);

  useEffect(() => {
    if (isLogin) {
      // 获取我的比赛
      dispatch({
        type: 'cryptoCup/getMyRace',
        payload: {
          campaignNameEn: 'sjb',
        },
      });
    }
  }, [dispatch, currentSeasonId, campaignId, isLogin]);

  if (loading)
    return (
      <LoadingBox>
        <AbsoluteLoading />
      </LoadingBox>
    );

  if (raceList?.length < 1)
    return <Empty size="small" subDescription={_t('dLL7qbXm82g1QRoKfbnLqC')} />;

  return (
    <Box>
      <>
        {[raceList || []].map((item, index) => (
          <RaceItem
            {...item}
            key={index}
            onSeeScore={() => {
              setOpen(true);
            }}
          />
        ))}
        {/* 放在这，只存在一个实例 */}
        {open && <MatchRulesModal isDetail onClose={handleClose} />}
      </>
    </Box>
  );
};

export default MyRace;
