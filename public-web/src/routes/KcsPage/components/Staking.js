/**
 * Owner: chris@kupotech.com
 */
import { Button, Divider, styled } from '@kux/mui';
import { Link } from 'components/Router';
import { divide } from 'helper';
import { useSelector } from 'src/hooks/useSelector';
import sensors from 'src/tools/ext/kc-sensors';
import siteCfg from 'src/utils/siteConfig';
import { ReactComponent as KcsIcon } from 'static/kcs-intro/kcs_icon.svg';
import { _t } from 'tools/i18n';
import { levelConfigMap, totalLevel } from '../config';
import { getScene, getUpgradeLevelText, numberFormat, percentFormat } from '../utils';
import BuyCoin from './BuyCoin';
import Tooltip from './Tooltip';

const { POOLX_HOST, MAIN_HOST } = siteCfg;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
  padding-top: 68px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 48px 24px 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 0px;
  }
`;
const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 36px;
  font-weight: 600;
  line-height: 130%;
  width: 100%;
  text-align: center;
  margin-bottom: 0px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;
const SubTitle = styled.h3`
  margin-top: 24px;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 20px;
  font-weight: 400;
  line-height: 150%;
  text-align: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 24px;
    margin-bottom: 24px;
    font-size: 20px;
    font-size: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 14px;
    text-align: left;
  }
`;
const Content = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  background: ${({ theme }) => theme.colors.cover4};
  display: flex;
  padding: 32px;
  flex-direction: column;
  align-items: flex-start;
  // gap: 32px;
  align-self: stretch;
  .divider {
    width: calc(100% + 64px);
    margin: 0px 0px 32px;
    transform: translateX(-32px);
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    // gap: 16px;
    padding: 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
    border-radius: 12px;
    .divider {
      width: calc(100% + 32px);
      margin: 0px 0px 16px;
      transform: translateX(-16px);
    }
  }
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;
  // border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  width: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 16px;
  }
`;
const Bottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Desc = styled.div`
  flex: 1;
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 24px;
    line-height: 130%;
  }
  p {
    margin-top: 8px;
    color: ${({ theme }) => theme.colors.text40};
    font-size: 14px;
    line-height: 150%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    h1 {
      font-size: 16px;
    }
  }
`;
const ButtonWrap = styled.div`
  margin-left: 24px;
  button {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background: ${({ theme }) => theme.colors.text};
    &:hover {
      color: ${({ theme }) => theme.colors.textEmphasis};
      background: ${({ theme }) => theme.colors.text};
    }
  }
`;
const Item = styled.div`
  .label {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
  }
  .lh1 {
    line-height: 1;
  }
  .con {
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 16px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      font-size: 16px;
    }
  }
  .flexEnd {
    justify-content: flex-end;
  }
  .textRight {
    text-align: right;
  }
  .primary {
    color: ${({ theme }) => theme.colors.primary};
    text-align: right;
  }
  .currency {
    display: flex;
    align-items: center;
    .imgWrap {
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
`;
const BottomWrap = styled.div`
  width: 100%;
  .currency {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 16px;
    .imgWrap {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
`;
const BottomItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  .label {
    color: ${({ theme }) => theme.colors.text40};
    font-size: 14px;
    line-height: 150%;
  }
  .con {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 14px;
  }
  .primary {
    color: ${({ theme }) => theme.colors.primary};
    text-align: right;
  }
`;
const ButtonSm = styled(Button)`
  width: 100%;
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.textEmphasis};
  background: ${({ theme }) => theme.colors.text};
  &:hover {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background: ${({ theme }) => theme.colors.text};
  }
`;
const Staking = ({
  overview,
  totalKcs,
  isSm,
  userLevel,
  currentLevel,
  getTotalKcs,
  isLogin,
  originalLevel,
  goUpgradeHandle: goUpgradeHandleProps,
}) => {
  const currency = 'KCS';
  const categories = useSelector((state) => state?.categories);
  const { currencyName = '', precision = 8 } = categories[currency] || {};

  const goUpgradeHandle = () => {
    sensors.trackClick([`StakingBtn`, '1'], {
      kcs_level: userLevel,
      pagePosition: `${currentLevel}`,
      ...getScene(),
    });
    goUpgradeHandleProps();
  };

  const {
    income_release_amount,
    apr,
    lock_amount,
    kcs_assets_ratio,
    demand_apr,
    demand_kcs_rights_bonus,
  } = overview || {};
  const { rate_ratio } = demand_kcs_rights_bonus || {};
  const { hintColor, bgColor } = levelConfigMap[currentLevel] || {};
  const { upgradeColor } = levelConfigMap[userLevel] || {};
  const btnStyle =
    currentLevel !== 0
      ? {
          background: bgColor,
          color: hintColor,
        }
      : {};

  const aprStyle = currentLevel !== 0 && isLogin ? { color: upgradeColor } : {};

  const BottomSm = () => {
    return (
      <BottomWrap>
        <BottomItem className="currency">
          <KcsIcon className="imgWrap" />
          <div>
            <div className="label">{_t('b7abfc6b61504000a62f')}</div>
            <div className="con flex-center lh1">
              <span>
                {isLogin && totalKcs
                  ? ` ${numberFormat(totalKcs, precision)} ${currencyName}`
                  : '--'}
              </span>
              {isLogin && (
                <BuyCoin
                  userLevel={userLevel}
                  currentLevel={currentLevel}
                  isSm={isSm}
                  currency={currency}
                  getTotalKcs={getTotalKcs}
                />
              )}
            </div>
          </div>
        </BottomItem>
        <BottomItem>
          <div className="label">{_t('9cc18212eb354000a565')}</div>
          <div className="con">
            {isLogin && lock_amount
              ? ` ${numberFormat(lock_amount, precision)} ${currencyName}`
              : '--'}
          </div>
        </BottomItem>
        <BottomItem>
          <div className="label">{_t('c8368e3564c74000ad5a')}</div>
          <div className="con">
            {isLogin && income_release_amount
              ? ` ${numberFormat(income_release_amount, precision)} ${currencyName}`
              : '--'}
          </div>
        </BottomItem>
        <BottomItem>
          <div className="label">{_t('vvXZY3b1tK86CB9zw9D59j')}</div>
          <div className="con flex-center flexEnd">
            <span style={aprStyle}>
              {demand_apr ? percentFormat(divide(demand_apr, 100)) : '--'}
            </span>
            {bagIcon && demand_kcs_rights_bonus && (
              <Tooltip
                title={_t('5f2c19294dfe4000a020', {
                  level: `K${userLevel}`,
                  number: rate_ratio,
                })}
              >
                <img width={20} className="ml-4 help" src={bagIcon} alt="bag" />
              </Tooltip>
            )}
          </div>
        </BottomItem>
        <ButtonSm style={btnStyle} onClick={goUpgradeHandle}>
          {_t('4f4809f8748c4000a982')}
        </ButtonSm>
      </BottomWrap>
    );
  };

  const isLastLevel = userLevel === totalLevel;
  const isK0 = originalLevel === 0;
  const _level = currentLevel <= userLevel ? userLevel + 1 : currentLevel;
  const levelText = `K${_level}`;

  const bagIcon = levelConfigMap[userLevel]?.bagSource;

  return (
    <Wrapper data-inspector="kcs_staking">
      <Title>
        {isK0
          ? _t('22de3622ee5d4000a0a8')
          : isLastLevel
          ? _t('548cded61bd14000a17a')
          : _t('25ab81ec48834000acf5', { level: levelText })}
      </Title>
      <SubTitle>
        {isK0 ? (
          _t('bf2bdf50d1774000af17', { amount: '≥ 1' })
        ) : isLastLevel ? (
          _t('824bc2ebafdc4000af55')
        ) : (
          <span>
            {_t('faad5fd2d38f4000af60', { ...getUpgradeLevelText(_level, true), level: levelText })}
          </span>
        )}
      </SubTitle>
      <Content>
        <Top>
          <Desc>
            <h1>{_t('ebee8d20ab8a4000aad3')}</h1>
            <p>{_t('78024c5208c34000aa24')}</p>
          </Desc>
          {!isSm && (
            <ButtonWrap>
              <Link dontGoWithHref href={`${POOLX_HOST}/kcs`}>
                <Button style={btnStyle} onClick={goUpgradeHandle}>
                  {_t('4f4809f8748c4000a982')}
                </Button>
              </Link>
            </ButtonWrap>
          )}
        </Top>
        <Divider className="divider" />
        {!isSm ? (
          <Bottom>
            <Item>
              <div className="currency">
                <KcsIcon className="imgWrap" />
                <div>
                  <div className="label">{_t('b7abfc6b61504000a62f')}</div>
                  <div className="con flex-center lh1">
                    <span>
                      {isLogin && totalKcs
                        ? ` ${numberFormat(totalKcs, precision)} ${currencyName}`
                        : '--'}
                    </span>
                    {isLogin && (
                      <BuyCoin
                        userLevel={userLevel}
                        currentLevel={currentLevel}
                        currency={currency}
                        getTotalKcs={getTotalKcs}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Item>
            <Item>
              <div className="label">{_t('9cc18212eb354000a565')}</div>
              <div className="con">
                {isLogin && lock_amount
                  ? ` ${numberFormat(lock_amount, precision)} ${currencyName}`
                  : '--'}
              </div>
            </Item>
            <Item>
              <div className="label">{_t('c8368e3564c74000ad5a')}</div>
              <div className="con">
                {isLogin && income_release_amount
                  ? ` ${numberFormat(income_release_amount, precision)} ${currencyName}`
                  : '--'}
              </div>
            </Item>
            <Item>
              <div className="label textRight">{_t('vvXZY3b1tK86CB9zw9D59j')}</div>
              <div className="con flex-center flexEnd">
                <span style={aprStyle}>
                  {demand_apr ? percentFormat(divide(demand_apr, 100)) : '--'}
                </span>
                {bagIcon && demand_kcs_rights_bonus && (
                  <Tooltip
                    title={_t('5f2c19294dfe4000a020', {
                      level: `K${userLevel}`,
                      number: rate_ratio,
                    })}
                  >
                    <img width={20} className="ml-4 help" src={bagIcon} alt="bag" />
                  </Tooltip>
                )}
              </div>
            </Item>
          </Bottom>
        ) : (
          <BottomSm overview={overview} kcsBalance={totalKcs} />
        )}
      </Content>
    </Wrapper>
  );
};

export default Staking;
