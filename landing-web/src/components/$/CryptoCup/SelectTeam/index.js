/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { styled } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import AntiDuplication from 'components/common/AntiDuplication';
import add from 'assets/cryptoCup/add.png';
import no3 from 'assets/cryptoCup/no3.png';
import no2 from 'assets/cryptoCup/no2.png';
import no1 from 'assets/cryptoCup/no1-select.png';
import light from 'assets/cryptoCup/light.svg';
import teamword from 'assets/cryptoCup/team-word.svg';
import teamfinalword from 'assets/cryptoCup/team-final-word.svg';
import question from 'assets/cryptoCup/icon-question.svg';
import teamBg from 'assets/cryptoCup/match-bg-select-2.png';
import { useLogin } from 'src/hooks';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import { openPage } from 'helper';
import BlockTitle from '../common/BlockTitle';
import useGetCurrentSchedule from '../hooks/useGetCurrentSchedule';
import useGetSelectedSeason from '../hooks/useGetSelectedSeason';
import useGetCoinImg from '../hooks/useGetCoinImg';
import { GreenBorderBox, BlockAnchor } from '../common/StyledComps';
import Toast from '../common/Toast';
import {
  cryptoCupTrackClick,
  getRuleUrl,
  cryptoCupExpose,
  convertIndex,
  getAppLoginParams,
} from '../config';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Main = styled(GreenBorderBox)`
  margin: 18px auto 0;
  padding: 18px 18px 0;
  display: flex;
  flex-wrap: wrap;
  background-image: ${props =>
    props.showTeamfinalword ? `url(${teamfinalword})` : `url(${teamword})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  min-height: 361px;
  &.semifinal {
    padding: 67px 18px 70px;
  }
`;

const FinalWrap = styled.div`
  margin: 18px auto 0;
  display: flex;
  padding: 0;
  background-size: 100% 100%;
  position: relative;
`;

const FinalWrapCover = styled.img`
  width: 100%;
  min-height: 143px;
`;

const FinalItemWrap = styled.div`
  position: absolute;
  top: 50%;
  margin-top: -46px;
  ${props => (props.isLeft ? `left: 38px;` : `right: 38px;`)}
`;

const FinalItemText = styled.div`
  font-weight: 900;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  color: #00142a;
  -webkit-text-stroke: 1px #fff;
  margin: 7px 0 0 0;
`;

const FinalItemImgWrap = styled.div`
  width: 68px;
  height: 61px;
`;

const FinalItemImgFullText = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 90px;
  font-weight: 500;
  font-size: 14px;
  bottom: -2px;
  left: 0px;
  height: 23px;
  line-height: 23px;
  position: absolute;
  text-align: center;
  color: #fff;
`;

const FinalItemImg = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => `url(${no1}) no-repeat`};
  background-size: cover;
  position: relative;
  z-index: 3;

  &::before {
    display: ${props => (props.isFull ? 'none' : 'block')};
    content: '';
    width: 20px;
    height: 20px;
    background: ${props => `url(${add}) no-repeat`};
    background-size: 100% 100%;
    position: absolute;
    right: 3px;
    bottom: 0px;
  }
`;

const FinalItemImgIn = styled.div`
  position: absolute;
  width: 55px;
  height: 55px;
  background: ${props => `url(${props.iconUrl}) no-repeat`};
  background-size: cover;
  border-radius: 50%;
  top: 3px;
  left: 7px;
  z-index: 2;
`;

const Couple = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin: 0 0 30px 0;
`;

const CoupleRight = styled(Couple)`
  align-items: flex-end;
`;

const CoupleItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  &:nth-of-type(1) {
    margin-bottom: 21px;
    .semifinal & {
      margin-bottom: 102px;
    }
  }
`;

const CoupleItemBox = styled.div`
  position: absolute;
  width: 70px;
  height: 80px;
  .semifinal & {
    height: 169px;
  }
  border: 1px solid #d4e8df;
  left: 42px;
  position: absolute;
  top: 24px;
  border-left: none;

  .cup-right-couple & {
    border-left: 1px solid #d4e8df;
    border-right: none;
    left: auto;
    right: 42px;
  }
`;

const CoupleItemBoxIn = styled.div`
  width: 48px;
  position: absolute;
  right: 0;
  top: 14px;
  .semifinal & {
    top: 63px;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -24px;

  .cup-right-couple & {
    right: auto;
    left: -24px;
  }
`;

const CoupleItemBoxImg = styled.div`
  width: 48px;
  height: 42px;
  background: ${props => `url(${props.no}) no-repeat`};
  background-size: contain;
`;

const CoupleItemBoxDesc = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: #00142a;
  margin-top: 2px;
`;

const CoupleItemContent = styled.div`
  width: 42px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const CoupleItemInFullText = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 90px;
  font-weight: 500;
  font-size: 10px;
  bottom: -4px;
  left: 0;
  height: 18px;
  line-height: 18px;
  position: absolute;
  text-align: center;
  color: #fff;
`;

const CoupleItemIn = styled.div`
  width: 100%;
  height: 42px;
  display: flex;
  position: relative;
  background: ${props => `url(${props.teamImg}) no-repeat`};
  background-size: 100% 100%;
  background-color: rgb(237, 239, 240);
  border-radius: 50%;

  &::before {
    display: ${props => (props.isFull ? 'none' : 'block')};
    content: '';
    width: 18px;
    height: 18px;
    background: ${props => `url(${add}) no-repeat`};
    background-size: 100% 100%;
    position: absolute;
    right: -4px;
    bottom: -2px;
  }
`;

const CoupleItemName = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: #00142a;
  margin-top: 5px;
`;

const TipLine = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  width: max-content;
  max-width: 100%;
  /* min-height: 22px; */
  line-height: 16px;
  display: flex;
  align-items: center;
  /* text-transform: uppercase; */
  color: #2dc985;
  background: #ffffff;
  border-radius: 90px;
  padding: 3px 8px;
  margin: 12px 0 0 0;

  &::before {
    display: block;
    content: '';
    width: 17px;
    height: 17px;
    background: ${props => `url(${light}) no-repeat`};
    background-size: 100% 100%;
    margin: 0 3px 0 0;
  }
  &::after {
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    background: ${props => `url(${question}) no-repeat`};
    background-size: 100% 100%;
    margin: 0 0 0 6px;
  }
`;

const isFullTeam = item => item?.count >= item?.limit;

function SelectTeam() {
  const { getIconUrl } = useGetCoinImg();
  const { isInApp, currentLang } = useSelector(state => state.app);
  const { isLogin, handleLogin } = useLogin();
  const [fullTeamTipVisible, setfullTeamTipVisible] = useState(false);
  const [confirmTeamAlert, setConfirmTeamAlert] = useState({});
  const dispatch = useDispatch();
  const { campaigns } = useSelector(state => state.cryptoCup);
  const currentSchedule = useGetCurrentSchedule();
  const { curSelectedSeasonTeams } = useGetSelectedSeason();
  // const currentSchedule = 'semifinal';
  const groupedTeams = useMemo(
    () => {
      return groupBy(curSelectedSeasonTeams, 'groupCode');
    },
    [curSelectedSeasonTeams],
  );

  const goRule = useCallback(
    () => {
      openPage(isInApp, getRuleUrl(currentLang));
      cryptoCupTrackClick(['tips', '1']);
    },
    [isInApp, currentLang],
  );

  const boxImg = currentSchedule === 'semifinal' ? no2 : no3;

  const handleJoinTeam = async elTeam => {
    if (!isLogin) {
      handleLogin(getAppLoginParams());
      return;
    }
    if (isFullTeam(elTeam)) {
      setfullTeamTipVisible(true);
      return;
    }

    setConfirmTeamAlert(elTeam);
    // 二次确认加入主队按钮曝光
    cryptoCupExpose(['SCteam', '1']);
  };

  const renderItemContent = item => {
    const iconUrl = getIconUrl(item?.code);

    return (
      <AntiDuplication>
        <CoupleItemContent onClick={() => handleJoinTeam(item)}>
          <CoupleItemIn isFull={isFullTeam(item)} teamImg={iconUrl}>
            <>
              {!!isFullTeam(item) && (
                <CoupleItemInFullText>{_t('qm9L15CAQHsGnMHvR6ki7q')}</CoupleItemInFullText>
              )}
            </>
          </CoupleItemIn>
          <CoupleItemName>{item?.code}</CoupleItemName>
        </CoupleItemContent>
      </AntiDuplication>
    );
  };

  const renderFinalItem = (isLeft, el) => {
    const iconUrl = getIconUrl(el?.code);

    return (
      <FinalItemWrap isLeft={isLeft}>
        <AntiDuplication>
          <FinalItemImgWrap onClick={() => handleJoinTeam(el)}>
            <FinalItemImg isFull={isFullTeam(el)}>
              <>
                {!!isFullTeam(el) && (
                  <FinalItemImgFullText>{_t('qm9L15CAQHsGnMHvR6ki7q')}</FinalItemImgFullText>
                )}
              </>
            </FinalItemImg>
            <FinalItemImgIn iconUrl={iconUrl} />
          </FinalItemImgWrap>
        </AntiDuplication>
        <FinalItemText>{el.code || '--'}</FinalItemText>
      </FinalItemWrap>
    );
  };

  const renderMain = () => {
    let groups = Object.values(groupedTeams).filter(el => el.length === 2);

    // 决赛
    if (currentSchedule === 'finals') {
      return groups.slice(0, 1).map((el, index) => {
        const [leftEl, rightEl] = el || [];

        return (
          <FinalWrap key={index}>
            <FinalWrapCover src={teamBg} />
            <>{renderFinalItem(true, leftEl)}</>
            <>{renderFinalItem(false, rightEl)}</>
          </FinalWrap>
        );
      });
    }

    if (currentSchedule === 'semifinal') {
      groups = groups.slice(0, 2);
    }

    const finalgroups = convertIndex(groups);

    return (
      <Main
        showTeamfinalword={currentSchedule !== 'other'}
        className={`selectTeam-box ${currentSchedule}`}
      >
        <>
          {finalgroups.map((el, index) => {
            const finalEl = sortBy(el, ['campaignIndex']);
            const isRight = index % 2 === 1;
            const [one, two] = finalEl;
            const content = (
              <>
                {/* 第1个 */}
                <CoupleItem>
                  {/* 框框盒子 start*/}
                  <CoupleItemBox>
                    <CoupleItemBoxIn>
                      <CoupleItemBoxImg no={boxImg} />
                      <CoupleItemBoxDesc>{_t('kxUuUWR4AEabuoPriC6f85')}</CoupleItemBoxDesc>
                    </CoupleItemBoxIn>
                  </CoupleItemBox>
                  <>{/* 框框盒子 end*/}</>
                  <>{renderItemContent(one)}</>
                </CoupleItem>
                {/* 第2个 */}
                <CoupleItem>{renderItemContent(two)}</CoupleItem>
              </>
            );

            if (isRight) {
              return (
                <CoupleRight key={index} className="cup-right-couple">
                  {content}
                </CoupleRight>
              );
            }

            return <Couple key={index}>{content}</Couple>;
          })}
        </>
      </Main>
    );
  };

  return (
    <Wrapper id="CryptoCup-SelectTeam">
      <BlockAnchor id="CryptoCup-SelectTeam-Anchor" isInApp={isInApp} />
      <BlockTitle name={_t('1hJ1BZnT5dGXGvZLDHLmMk')} />
      <AntiDuplication>
        <TipLine onClick={goRule}>{_t('rLmdi9huyAWPBHvGMhRpRb')}</TipLine>
      </AntiDuplication>
      <>{renderMain()}</>
      {/* 该队伍已满员 */}
      <CupCommonDialog
        okText={_t('nftInfo.tabs.modalBtn')}
        title={_t('47gxeTMArA8xs47SApkwZ4')}
        onOk={() => {
          setfullTeamTipVisible(false);
        }}
        onCancel={() => setfullTeamTipVisible(false)}
        showCloseX={false}
        open={fullTeamTipVisible}
      >
        <div>{_t('vDWwd6XnJMunMPpSmpEuyL')}</div>
      </CupCommonDialog>
      {/* 确认加入战队吗？ */}
      <CupCommonDialog
        showCloseX={false}
        okText={_t('nttSEYKRx3nJFK4EHASaqx')}
        showCancelText={_t('kucoinWin.lottery.shoppingCart.del.cancel')}
        title={_t('6nkRXYPyXVcAz9XN9Eshto', { code: confirmTeamAlert?.code || '--' })}
        onOk={async () => {
          cryptoCupTrackClick(['SCteam', '1']);
          const success = await dispatch({
            type: 'cryptoCup/joinTeam',
            payload: {
              campaignId: campaigns?.id,
              seasonId: campaigns?.currentSeasonId,
              teamId: confirmTeamAlert?.id,
            },
          });
          if (success) {
            Toast(_t('p1dvbMa9cEThtWP7b6i66x'));
            // 报名成功后调报名信息接口
            dispatch({
              type: 'cryptoCup/getRegistInfo',
              payload: {
                campaignId: campaigns?.id,
                seasonIds: [campaigns?.currentSeasonId],
              },
            });
          }
          setConfirmTeamAlert({});
        }}
        onCancel={() => {
          setConfirmTeamAlert({});
        }}
        open={confirmTeamAlert && !isEmpty(confirmTeamAlert)}
      >
        <div>{_t('iR8exRB2EmhBGTWc4E3Nuk')}</div>
      </CupCommonDialog>
    </Wrapper>
  );
}

export default SelectTeam;
