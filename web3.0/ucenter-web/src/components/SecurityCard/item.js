/**
 * Owner: sean.shi@kupotech.com
 */
import { useOauthLogin } from '@kucoin-biz/hooks';
import { InfoIcon, SuccessIcon } from '@kux/iconpack';
import { useResponsive } from '@kux/mui';
import { defaultExternalList } from 'components/ExternalBindingsDialog/config';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import { externalBindingsId } from './config';
import {
  BtnWrapper,
  SecIcon,
  SecName,
  SecOptItemLeft,
  SecOptItemRight,
  SecTip,
  SecurityItemContent,
  SecurityItemWrapper,
  SettingContent,
} from './styled';

export const SecurityItem = (props) => {
  const {
    id,
    renderTag,
    isSetting,
    name,
    renderDesc,
    icon,
    path,
    renderOperate,
    isDouble,
    settingContent,
    notSettingContent,
  } = props;
  const rv = useResponsive();
  const oauthLogin = useOauthLogin(defaultExternalList.map((i) => i.extPlatform).join(','));
  const lg = !rv?.lg;
  const sm = !rv?.sm;

  const handleNext = (currentPath = path) => {
    if (currentPath) {
      push(currentPath);
    }
  };

  // 若所有三方登录sdk都未加载完成，则不显示三方登录
  if (
    externalBindingsId === id &&
    defaultExternalList.every((i) => !oauthLogin?.[i.extPlatform]?.ready)
  ) {
    return null;
  }

  return (
    <SecurityItemWrapper data-inspector={id}>
      <SecurityItemContent>
        <SecOptItemLeft>
          <SecIcon>{icon}</SecIcon>
          <div>
            <SecName>
              <span>{name}</span>
              {renderTag && renderTag({ isSetting })}
            </SecName>
            <SecTip>{renderDesc()}</SecTip>
            {(lg || sm) && isDouble ? (
              <SettingContent isSetting={isSetting}>
                {isSetting ? (
                  <SuccessIcon size={16} />
                ) : (
                  <InfoIcon className="not-setting" size={16} />
                )}
                <span>
                  {isSetting
                    ? settingContent || _t('enabled')
                    : notSettingContent || _t('fiat.withdraw.security.status.unset')}
                </span>
              </SettingContent>
            ) : null}
            {sm ? (
              <BtnWrapper>{renderOperate && renderOperate({ item: props, handleNext })}</BtnWrapper>
            ) : null}
          </div>
        </SecOptItemLeft>

        <SecOptItemRight>
          {lg || sm
            ? null
            : isDouble && (
                <SettingContent isSetting={isSetting}>
                  {isSetting ? (
                    <SuccessIcon size={16} />
                  ) : (
                    <InfoIcon className="not-setting" size={16} />
                  )}
                  <span>
                    {isSetting
                      ? settingContent || _t('enabled')
                      : notSettingContent || _t('fiat.withdraw.security.status.unset')}
                  </span>
                </SettingContent>
              )}
          {!sm ? (
            <BtnWrapper>{renderOperate && renderOperate({ item: props, handleNext })}</BtnWrapper>
          ) : null}
        </SecOptItemRight>
      </SecurityItemContent>
    </SecurityItemWrapper>
  );
};
