/**
 * Owner: chris@kupotech.com
 */
import { styled, Tab, Tabs } from '@kux/mui';
import { Fragment } from 'react';
import { _t, _tHTML } from 'src/tools/i18n';
import sensors from 'tools/ext/kc-sensors';
import { levelConfigMap } from '../../config';
import { getScene, getUpgradeLevelText } from '../../utils';
import Benefits from './Benefits';

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
`;

const Wrapper = styled.div`
  .reverse {
    transform: scaleX(-1);
  }
`;

const Content = styled.div`
  padding: 0px;
  display: flex;
  flex-wrap: wrap;
  & > .card:nth-child(2n) {
    margin-left: 32px;
  }
  .go {
    margin-left: 12px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    white-space: nowrap;
    cursor: pointer;
  }
  .tip {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
  }
  .card {
    width: calc(50% - 16px);
    margin-bottom: 32px;
    padding: 32px;
    border: 1px solid ${({ theme }) => theme.colors.cover8};
    border-radius: 12px;
    .help {
      cursor: help;
    }
    .label {
      // display: flex;
      // align-items: center;
      margin-bottom: 4px;
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
    }
    .value {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      font-size: 24px;
      line-height: 130%;
    }
    .go {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 400;
      font-size: 16px;
      line-height: 130%;
    }
    .max {
      padding: 2px 4px;
      color: ${({ theme }) => theme.colors.complementary};
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
      background-color: ${({ theme }) => theme.colors.complementary8};
    }
  }
  .cardHover,
  .cardHoverK0 {
    &:hover {
      border-color: ${({ theme }) => theme.colors.text20};
      cursor: pointer;
      .go {
        color: ${({ currentLevel }) => levelConfigMap[currentLevel]?.hoverColor};
        svg {
          opacity: 0.6;
        }
      }
    }
  }
  .cardHoverK0:hover {
    cursor: none;
  }

  .infoWrap {
    display: inline-block;
    svg {
      margin-bottom: -2px;
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0px 32px 0px;
    & > .card:nth-child(2n) {
      margin-left: 0px;
    }
    .card {
      width: 100%;
      margin-bottom: 16px;
      .label {
        margin-bottom: 8px;
        font-size: 13px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px 0px;
    .card {
      padding: 16px;
      .go {
        font-size: 14px;
      }
    }
  }
`;

const BorderTop = styled.div`
  position: relative;
  // height: 78px;
  border-radius: 12px;
  padding-top: 64px;
  text-align: center;
  background-image: linear-gradient(
    to bottom,
    ${({ borderColor }) => `${borderColor}66`},
    #1abdb500
  );
  .levelExplain {
    width: 100%;
    max-width: 1200px;
    margin: 0px auto;
    margin-top: 20px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
  }
  .title {
    position: relative;
    z-index: 1;
    margin-bottom: 48px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
  }
  .level {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 36px;
      height: 36px;
    }
  }
  &:before {
    position: absolute;
    top: 1px;
    left: 1px;
    width: calc(100% - 2px);
    height: 100%;
    padding: 1px;
    background: ${({ theme, overlayColor }) => overlayColor || theme.colors.overlay};
    border-radius: 12px;
    content: '';
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-top: 40px;
    .title {
      margin-bottom: 24px;
      font-size: 20px;
    }
    .levelExplain {
      padding: 0px 32px;
      font-size: 16px;
    }
    .level {
      img {
        width: 28px;
        height: 28px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 24px;
    .title {
      margin-bottom: 16px;
      font-size: 18px;
    }
    .levelExplain {
      margin-top: 16px;
      padding: 0px 16px;
      padding: 0px 16px;
      font-size: 14px;
      text-align: left;
    }
  }
`;

const CusTabs = styled(Tabs)`
  .KuxTab-TabItem {
    margin-left: 24px;
    font-weight: 400;
    transition: none;
    &:first-of-type {
      margin-left: 0px;
    }
  }
  .KuxTabs-Container {
    justify-content: center;
    height: auto;
    padding-top: 15px;
  }
  .KuxTab-selected {
    color: ${({ currentLevel, theme }) =>
      levelConfigMap[currentLevel]?.tabColor || theme.colors.text};
    font-weight: 700;
    -webkit-text-stroke: unset;
  }
  .KuxTab-selected:hover {
    color: ${({ currentLevel, theme }) =>
      levelConfigMap[currentLevel]?.tabColor || theme.colors.text};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxTabs-Container {
      justify-content: flex-start;
      padding: 9px 0px 9px 16px;
    }
  }
`;

const UpgradeTip = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 32px auto;
  border: 1px solid ${({ currentLevel }) => levelConfigMap[currentLevel]?.borderColor2};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  img {
    width: 28px;
    height: 28px;
  }
  .upgradeTips {
    span {
      display: flex;
      align-items: center;
      img {
        margin: 0px 4px;
      }
    }
  }
  .condition {
    padding: 2px 6px;
    color: ${({ currentLevel, theme }) =>
      levelConfigMap[currentLevel]?.tabColor || theme.colors.text};
    background: ${({ currentLevel }) => levelConfigMap[currentLevel]?.upgradeColor6};
    border-radius: 4px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(100% - 64px);
    margin: 24px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 32px);
    margin: 16px;
    .upgradeTips span {
      flex-wrap: wrap;
      text-align: left;
    }
    .condition {
      width: 100%;
      margin-top: 16px;
      text-align: left;
    }
  }
`;

const ExclusiveBenefits = ({
  currentScreen,
  userLevel,
  currentLevel,
  kcsRights,
  goUpgradeHandle,
  isLogin,
  originalLevel,
  updateLevel,
}) => {
  const isSm = currentScreen === 'xs';

  const updateTab = (e, t) => {
    const _level = t + 1;
    sensors.trackClick(['rightlist', `${_level}`], {
      ...getScene(),
    });
    updateLevel(_level);
  };

  const menus = [
    _t('398ec64aa49c4000a2a5', { level: 1 }),
    _t('398ec64aa49c4000a2a5', { level: 2 }),
    _t('398ec64aa49c4000a2a5', { level: 3 }),
    _t('398ec64aa49c4000a2a5', { level: 4 }),
  ];

  const isK0 = originalLevel === 0;

  const { borderColor, overlayColor } = levelConfigMap[currentLevel] || {};
  return (
    <Wrapper>
      <div>
        <BorderTop borderColor={borderColor} overlayColor={overlayColor}>
          <div className="title">
            {isK0 ? (
              <Fragment>
                <CusTabs
                  value={currentLevel - 1}
                  onChange={updateTab}
                  variant="line"
                  indicator={false}
                  showScrollButtons={false}
                  size="large"
                  currentLevel={currentLevel}
                >
                  {menus.map((l, idx) => (
                    <Tab label={l} key={idx} />
                  ))}
                </CusTabs>
                <UpgradeTip currentLevel={currentLevel}>
                  <div className="upgradeTips">
                    {_tHTML('a0f820b43a804000a0fd', {
                      src: levelConfigMap[currentLevel]?.bagSource,
                    })}
                  </div>
                  <span className="condition">{getUpgradeLevelText(currentLevel)}</span>
                </UpgradeTip>
              </Fragment>
            ) : (
              <span className="level">
                {_t('65f270d598d34000a111')}
                <img className="ml-4" src={levelConfigMap[currentLevel]?.bagSource} alt="grade" />
              </span>
            )}

            {!isK0 && <div className="levelExplain">{_t('f9855a6fb6e24000a071')}</div>}
          </div>
        </BorderTop>
      </div>

      <Container>
        <Content currentLevel={currentLevel}>
          <Benefits
            isSm={isSm}
            userLevel={userLevel}
            currentLevel={currentLevel}
            kcsRights={kcsRights}
            goUpgradeHandle={goUpgradeHandle}
            isLogin={isLogin}
            originalLevel={originalLevel}
          />
        </Content>
      </Container>
    </Wrapper>
  );
};

export default ExclusiveBenefits;
