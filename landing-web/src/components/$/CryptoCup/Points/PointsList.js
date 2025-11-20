/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { useDispatch, useSelector } from 'dva';
import { Spin } from '@kufox/mui';
import { _t } from 'src/utils/lang';
import { isNilOrEmpty } from 'src/helper';
import empty from 'assets/cryptoCup/empty.svg';
import tabBg from 'assets/cryptoCup/tabBg.svg';
import no1 from 'assets/cryptoCup/no1-s.svg';
import no2 from 'assets/cryptoCup/no2-s.svg';
import no3 from 'assets/cryptoCup/no3-s.svg';
import AntiDuplication from 'components/common/AntiDuplication';

import BlockTitle from '../common/BlockTitle';
import { GreenBorderBox, CupMain } from '../common/StyledComps';
import { POINTS_LIST_TABS } from '../config';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  margin-top: 24px;
`;

const Main = styled(GreenBorderBox)`
  margin: 16px auto 24px;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
`;

const BlockTitleDesc = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(0, 13, 29, 0.4);
`;

const TabWrapper = styled.div`
  background: #e9feed;
  border: 0.4px solid #88dd98;
  border-radius: 90px;
  display: flex;
  height: 38px;
  align-items: center;
  padding: 0 4px;
`;

const Tab = styled.div`
  font-weight: 700;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${props => (props.isActive ? '#00142A;' : ' #399875;')};
  /* transform: matrix(0.98, 0, -0.19, 1, 0, 0); */
  width: 25%;
  background: #75fbaf;
  border-radius: 90px;
  line-height: 30px;
  font-style: italic;
  background-color: ${props => (props.isActive ? '#75FBAF;' : 'unset')};
  background-image: ${props => (props.isActive ? `url(${tabBg})` : 'unset')};
  background-repeat: no-repeat;
  background-position: top right;
`;

const Tips = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(0, 13, 29, 0.4);
  margin: 12px 0 16px;
`;

const THead = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: rgba(0, 13, 29, 0.4);
  margin-bottom: 8px;
  display: flex;
`;

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  min-height: 400px;
  flex-direction: column;
  color: rgba(0, 20, 42, 0.4);
`;

const EmptyImg = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => `url(${empty}) no-repeat`};
  background-size: 100% 100%;
  margin-bottom: 8px;
`;

const TBody = styled.div`
  overflow-y: auto;
  height: 400px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TRow = styled.div`
  font-weight: 500;
  font-size: 14px;
  height: 40px;
  align-items: center;
  color: #000d1d;
  display: flex;
  flex-wrap: nowrap;
  background: ${props => {
    let color = 'unset';
    if (props.index === 0) {
      color = 'linear-gradient(269.9deg, #FFFFFF 3.79%, #FFFCE8 93.1%);';
    } else if (props.index === 1) {
      color = 'linear-gradient(269.87deg, #FEFEFE 5.06%, #F1F1F1 94.63%);';
    } else if (props.index === 2) {
      color = 'linear-gradient(269.72deg, #FFFDFC 3.46%, #FFF1E7 97.84%);';
    }
    return color;
  }};
`;

const TailLine = styled.div`
  background: #e9feed;
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: rgba(0, 13, 29, 0.68);
`;

const ColOne = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  text-align: center;

  &::before {
    display: none;
    content: '';
    width: 26px;
    height: 26px;
    .CryptoCupPointsList-1 & {
      display: block;
      background: ${props => `url(${no1}) no-repeat`};
      background-size: 100% 100%;
    }
    .CryptoCupPointsList-2 & {
      display: block;
      background: ${props => `url(${no2}) no-repeat`};
      background-size: 100% 100%;
    }
    .CryptoCupPointsList-3 & {
      display: block;
      background: ${props => `url(${no3}) no-repeat`};
      background-size: 100% 100%;
    }
  }
`;

const ColOneText = styled.div`
  min-width: 26px;
  display: flex;
  justify-content: center;
  color: rgba(0, 13, 29, 0.68);
`;

const ColTwo = styled.div`
  width: 45%;
  line-height: 40px;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  /* display: flex; */
  /* align-items: center; */
  .CryptoCup-TailLine & {
    color: #000d1d;
  }
  .CryptoCup-THead & {
    line-height: unset;
  }
`;

const ColThreeText = styled.div`
  color: rgba(0, 13, 29, 0.68);
`;

const ColThree = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .CryptoCup-TailLine & {
    color: rgba(0, 13, 29, 0.68);
  }

  .CryptoCupPointsList-1 & {
    color: #ffc700;
  }
  .CryptoCupPointsList-2 & {
    color: #b2b2b2;
  }
  .CryptoCupPointsList-3 & {
    color: #e7974d;
  }
`;

const TableMain = styled(CupMain)`
  flex-direction: row;
`;

function PointsList() {
  const dispatch = useDispatch();
  const { showName = '' } = useSelector(state => state.kcCommon);
  const { pointsListTabIndex, pointRanking } = useSelector(state => state.cryptoCup);
  const loading = useSelector(state => state.loading.effects[`cryptoCup/getRanking`]);
  const curTabObj = POINTS_LIST_TABS[pointsListTabIndex] || {};

  useEffect(
    () => {
      // 前端index映射为后端type
      const rankTypeMap = {
        0: 0,
        1: 3,
        2: 2,
        3: 1,
      };

      dispatch({
        type: 'cryptoCup/getRanking',
        payload: {
          rankType: rankTypeMap[pointsListTabIndex] || 0,
        },
      });
    },
    [dispatch, pointsListTabIndex],
  );

  const renderContents = () => {
    if (loading) {
      return null;
    }
    if (isNilOrEmpty(pointRanking)) {
      return (
        <Empty>
          <EmptyImg />
          <>{_t('bJrQPiN6iGLBKVuSCzBJst')}</>
        </Empty>
      );
    }

    return (
      <>
        {(pointRanking || []).map((el, i) => (
          <TRow index={i} className={`CryptoCupPointsList-${i + 1}`} key={i}>
            <TableMain>
              <ColOne>
                <>{i >= 3 && <ColOneText>{el?.rank || '--'}</ColOneText>}</>
              </ColOne>
              <ColTwo>{el.identity}</ColTwo>
              <ColThree>
                <ColThreeText>{el.point}</ColThreeText>
              </ColThree>
            </TableMain>
          </TRow>
        ))}
      </>
    );
  };

  const myObject = (pointRanking || []).find(el => el.myself);

  return (
    <Wrapper>
      <BlockTitle
        name={_t('pkjjxNatihDTYdeVbUXfxh')}
        renderRight={() => {
          return <BlockTitleDesc>{_t('dL19wwFb7x4iPPqP8jMDsA')}</BlockTitleDesc>;
        }}
      />
      <Main>
        <CupMain>
          <TabWrapper>
            {POINTS_LIST_TABS.map((el, i) => {
              return (
                <AntiDuplication key={el.title()}>
                  <Tab
                    isActive={i === pointsListTabIndex}
                    onClick={() => {
                      dispatch({
                        type: 'cryptoCup/update',
                        payload: { pointsListTabIndex: i },
                      });
                    }}
                  >
                    {el.title()}
                  </Tab>
                </AntiDuplication>
              );
            })}
          </TabWrapper>
          <Tips>
            *<>{curTabObj.getDesc()}</>
          </Tips>
          <THead className="CryptoCup-THead">
            <ColOne>{_t('win.gameCenter.rank.no')}</ColOne>
            <ColTwo>{_t('qrnjNWRpB4oLNPDvFTDmTa')}</ColTwo>
            <ColThree>{_t('wsW58YPZzTBSuHcLgvS75g')}</ColThree>
          </THead>
        </CupMain>
        <Spin spinning={!!loading} tip="Loading...">
          <TBody>{renderContents()}</TBody>
        </Spin>
        <>
          {!isNilOrEmpty(myObject) && (
            <TailLine className="CryptoCup-TailLine">
              <TableMain>
                <ColOne>
                  <ColOneText>{myObject?.rank > 999 ? '999+' : myObject?.rank}</ColOneText>
                </ColOne>
                <ColTwo>{myObject?.identity || showName || '--'}</ColTwo>
                <ColThree>{myObject?.point || 0}</ColThree>
              </TableMain>
            </TailLine>
          )}
        </>
      </Main>
    </Wrapper>
  );
}

export default PointsList;
