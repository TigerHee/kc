/**
 * Owner: chris@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';
import { Dialog, MDialog, styled } from '@kux/mui';
import clsx from 'clsx';
import { _t } from 'src/tools/i18n';
import { ReactComponent as IcShare } from 'static/kcs-intro/ic_share2.svg';
import AssetsProportion from '../components/Banner/AssetsProportion';
import { levelConfigMap, totalLevel } from '../config';
import { getUpgradeLevelText } from '../utils';

const Content = styled.div`
  position: relative;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  .levelIcon {
    width: 28px;
  }
  .reverse {
    transform: scaleX(-1);
  }
  .upgradeText {
    display: inline-block;
    margin-top: 10px;
    padding: 2px 4px;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    background: ${({ upgradeTipBgColor }) => upgradeTipBgColor};
    border-radius: 4px;
  }
  .upgradeContent {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-top: 32px;
    padding: 0px;
    .divider {
      display: none;
    }
    .field {
      display: block;
      width: 50%;
      margin: 0px;
    }
    & > .field:nth-child(2) {
      .value,
      .label {
        text-align: left;
      }
    }
    & > .field:nth-child(3) {
      .value,
      .label {
        text-align: right;
      }
    }
    .tipBtm {
      box-sizing: border-box;
      max-height: 18px;
      line-height: 1.3;
    }
    .value {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      font-size: 20px;
      line-height: 130%;
    }
    & > .field:last-child {
      .value,
      .label {
        text-align: right;
      }
    }
  }
  .tipContent {
    margin-top: 32px;
    padding-top: 16px;
    color: ${({ theme }) => theme.colors.text40};
    border-top: 1px solid ${({ theme }) => theme.colors.cover8};
    .tipTitle {
      margin-bottom: 8px;
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 500;
      font-size: 12px;
      line-height: 130%;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 0px;
    .tipContent {
      margin-top: 16px;
      font-size: 12px;
    }
  }
`;

const Dialogs = styled(Dialog)`
  button {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background: ${({ theme }) => theme.colors.text};
  }
  button:hover {
    background: ${({ theme }) => theme.colors.text};
  }
`;

const MDialogs = styled(MDialog)`
  .KuxModalFooter-root {
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 20px);
  }
`;

function UpgradeModal({
  upgradeHandle,
  upgradeVisible,
  userLevel,
  currentLevel,
  currentScreen,
  goUpgradeHandle,
}) {
  const { isRTL } = useLocale();
  const isSm = currentScreen === 'xs';
  const Component = isSm ? MDialogs : Dialogs;
  if (userLevel === 0) return null;

  const { bagSource: from } = levelConfigMap[userLevel] || {};
  const {
    bagSource: to,
    upgradeColor,
    hintColor,
    bgColor,
    upgradeBgColor,
    upgradeTipBgColor,
  } = levelConfigMap[currentLevel] || {};
  const props = isSm
    ? {
        show: upgradeVisible,
        back: false,
        onClose: upgradeHandle,
        maskClosable: true,
        okButtonProps: {
          type: 'default',
          style: { background: bgColor, color: hintColor },
          fullWidth: true,
        },
      }
    : {
        open: upgradeVisible,
        onOk: upgradeHandle,
        onCancel: upgradeHandle,
        size: 'medium',
        okButtonProps: {
          type: 'default',
          style: { background: bgColor, color: hintColor },
          fullWidth: true,
        },
        maskClosable: true,
      };

  const isLastLevel = userLevel === totalLevel;
  return (
    <Component
      title={isLastLevel ? _t('79f6c4adf4a34000a375') : _t('c3a7ca96665b4000af41')}
      cancelText={null}
      okText={isLastLevel ? _t('43be8ba0ff1d4000ad18') : _t('2a8e7d140b304000a352')}
      {...props}
      onOk={() => {
        upgradeHandle();
        goUpgradeHandle();
      }}
    >
      <Content upgradeTipBgColor={upgradeTipBgColor}>
        {isLastLevel ? (
          <div className="flex-center">
            <img className="levelIcon" src={from} alt="from" />
          </div>
        ) : (
          <div className="flex-center">
            <img className="levelIcon" src={from} alt="from" />
            <IcShare
              className={clsx('ml-4 mr-4', {
                ['reverse']: isRTL,
              })}
            />
            <img className="levelIcon" src={to} alt="to" />
          </div>
        )}
        <AssetsProportion className="upgradeContent" />
        <div className="upgradeText" style={{ color: upgradeColor }}>
          {isLastLevel ? (
            <div>🎉 {_t('824bc2ebafdc4000af55')}</div>
          ) : (
            <span>
              {_t('fe785272fa954000a373')}
              {getUpgradeLevelText(currentLevel)}
            </span>
          )}
        </div>
        <div className="tipContent">
          <div className="tipTitle">{_t('75e60ca8b0a24000a4a6')}</div>
          <div>
            <div>{_t('35b7e590e2b64000ac53')}</div>
            <div>{_t('8f544654a8be4000a732')}</div>
          </div>
        </div>
      </Content>
    </Component>
  );
}
export default UpgradeModal;
