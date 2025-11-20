/**
 * Owner: chris@kupotech.com
 */

import { Button, styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import sensors from 'tools/ext/kc-sensors';
import { levelConfigMap, totalLevel } from '../config';
import { getScene } from '../utils';

const Container = styled.div`
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  max-width: 1200px;
  margin: 32px auto 50px;
  .bottomContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  button {
    min-width: 168px;
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text};
    &:hover {
      background-color: ${({ theme }) => theme.colors.text};
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    position: fixed;
    bottom: 0px;
    z-index: 100;
    flex-direction: column;
    margin: 0px;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    font-weight: 400;
    font-size: 12px;
    background: ${({ theme }) => theme.colors.overlay};
    border: none;
    border-radius: 16px 16px 0px 0px;
    transform: translateY(100%);
    transition: all 0.27s ease-out;
    ${({ showBottomButton, borderColor }) =>
      showBottomButton && {
        transition: 'all 0.27s ease-in',
        transform: 'translateY(0%)!important',
        'background-image': `linear-gradient(to bottom,${borderColor}66,#1abdb500)`,
      }}
    button {
      width: 100%;
      margin-top: 16px;
    }
    .bottomContent {
      position: relative;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    &:before {
      ${({ showBottomButton }) =>
        showBottomButton && {
          position: 'absolute',
        }}
      top: 1px;
      left: 1px;
      width: calc(100% - 2px);
      height: 100%;
      padding: 1px;
      background: ${({ theme, overlayColor }) => overlayColor || theme.colors.overlay};
      border-radius: 12px;
      border-radius: 16px 16px 0px 0px;
      content: '';
    }
  }
`;

const ButtomButtom = ({
  currentLevel,
  userLevel,
  goUpgradeHandle,
  showBottomButton,
  originalLevel,
}) => {
  const isLastLevel = userLevel === totalLevel;
  const isK0 = originalLevel === 0;
  const { hintColor, bgColor, borderColor } = levelConfigMap[currentLevel] || {};
  const style =
    hintColor && bgColor
      ? {
          color: hintColor,
          background: bgColor,
        }
      : {};

  return (
    <Container borderColor={borderColor} showBottomButton={showBottomButton}>
      <div className="bottomContent">
        <div>{_t('b8a8b7c19c654000aa6a')}</div>
        <Button
          onClick={() => {
            if (isK0) {
              sensors.trackClick([`k0update`, `1`], {
                pagePosition: `${currentLevel}`,
                ...getScene(),
              });
            } else {
              sensors.trackClick([`Update`, `2`], {
                kcs_level: userLevel,
                pagePosition: `${currentLevel}`,
                ...getScene(),
              });
            }

            goUpgradeHandle();
          }}
          style={style}
        >
          {isLastLevel ? _t('43be8ba0ff1d4000ad18') : _t('e00aa1c68b994000a66e')}
        </Button>
      </div>
    </Container>
  );
};

export default ButtomButtom;
