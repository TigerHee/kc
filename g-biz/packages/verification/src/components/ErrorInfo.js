/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import { styled, Button } from '@kux/mui';
import { ICClosePlusOutlined } from '@kux/icons';
import addLangToPath from '@tools/addLangToPath';
import { isEqual } from 'lodash';

import warningSrc from '../../static/warning.svg';
import warningDarkSrc from '../../static/warning.dark.svg';
import useLang from '../hooks/useLang';
import { ERROR_CODE, METHODS } from '../constants';
import plugins from '../plugins';
import SupplementInfo from './SupplementInfo';

const ERROR_SRC = {
  light: warningSrc,
  dark: warningDarkSrc,
};

const ErrorContainer = styled.div`
  padding-top: ${({ showIcon }) => `${showIcon ? 40 : 32}px`};
  text-align: center;
  line-height: 0;
  img {
    margin-bottom: 8px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const ErrorHeader = styled.div`
  margin-bottom: ${({ showIcon }) => `${!showIcon ? 24 : 8}px`};
  display: flex;
  align-items: center;

  ${({ theme, showIcon }) => !showIcon && theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
`;

const ErrorTitle = styled.div`
  font-size: ${({ showIcon }) => `${showIcon ? 24 : 20}px`};
  font-weight: ${({ showIcon }) => (showIcon ? 700 : 600)};
  line-height: 130%;
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  text-align: ${({ showIcon }) => (showIcon ? 'center' : 'left')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ErrorCloseBox = styled.div`
  border-radius: 50%;
  width: 34px;
  height: 34px;
  font-size: 12px;
  display: ${({ showIcon }) => (!showIcon ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.cover8};
  cursor: pointer;
`;

const ErrorContent = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${({ showIcon }) => `${showIcon ? 24 : 32}px`};
  text-align: ${({ showIcon }) => (showIcon ? 'center' : 'left')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorInfo = (props) => {
  const { code, supplement = [] } = props;
  const { currentTheme } = useTheme();
  const { _t, i18n } = useLang();
  const { language } = i18n ?? {};

  const {
    title,
    content,
    showIcon,
    showConfirmBtn,
    confirmText,
    onConfirm,
    showCancelBtn,
    cancelText,
    onCancel,
  } = useMemo(() => {
    const defaultOptions = {
      title: _t('b366f2b9d78c4000aa81'),
      content: _t('e251b3cadd6d4000af2f'),
      showIcon: true,
      confirmText: _t('605e70c9ac094000a1e1'),
      onConfirm: props.onCancel,
      showConfirmBtn: true,
      cancelText: _t('1ffb610866f64000ae3d'),
      onCancel: props.onCancel,
      showCancelBtn: false,
    };

    try {
      switch (code) {
        case ERROR_CODE.RISK_REJECTION:
          return {
            ...defaultOptions,
            title: _t('3b135e45e83d4000a658'),
            content: _t('d292f481d4f54000ab51'),
          };
        case ERROR_CODE.MATCHING_TIMEOUT:
          return {
            ...defaultOptions,
            title: _t('97b3cfcb0ce04000ae58'),
            content: _t('ce11a865f2084000a327'),
          };
        case ERROR_CODE.GO_TO_SECURITY: {
          const _supplement =
            supplement?.filter?.((list) =>
              list.every((key) => {
                return plugins.get(key)?.enable();
              }),
            ) ?? [];
          if (!_supplement?.length) {
            throw new Error('Supplement is illegal !');
          }
          // passkey 一定是第一项
          const hasPasskey = isEqual(_supplement[0], [METHODS.PASSKEY]);
          return {
            ...defaultOptions,
            title: _t('safe_verify_matching_empty_title'),
            content: <SupplementInfo supplement={_supplement} />,
            showIcon: false,
            confirmText: hasPasskey
              ? _t('efc138f869364000af5b')
              : _t('safe_verify_matching_empty_goto_setting'),
            onConfirm: () => {
              window.location.href = addLangToPath(
                hasPasskey ? '/account/security/passkey' : '/account/security',
                language,
              );
            },
            showCancelBtn: hasPasskey,
            cancelText: _t('01687958ad4f4800aa8d'),
            onCancel: () => {
              window.location.href = addLangToPath('/account/security', language);
            },
          };
        }
        default:
          return defaultOptions;
      }
    } catch (err) {
      console.error(err);
      return defaultOptions;
    }
  }, [code, supplement, _t, props, language]);

  return (
    <ErrorContainer showIcon={showIcon}>
      {showIcon ? <img src={ERROR_SRC[currentTheme] || ERROR_SRC.light} alt="icon" /> : null}
      <ErrorHeader showIcon={showIcon}>
        <ErrorTitle showIcon={showIcon}>{title}</ErrorTitle>
        <ErrorCloseBox showIcon={showIcon} onClick={props.onCancel}>
          <ICClosePlusOutlined />
        </ErrorCloseBox>
      </ErrorHeader>
      <ErrorContent showIcon={showIcon}>{content}</ErrorContent>
      <ErrorFooter show={showConfirmBtn || showCancelBtn}>
        {showConfirmBtn ? (
          <Button data-testid="error-dialog-confirm" onClick={onConfirm}>
            {confirmText}
          </Button>
        ) : null}
        {showCancelBtn ? (
          <Button data-testid="error-dialog-cancel" variant="text" onClick={onCancel}>
            {cancelText}
          </Button>
        ) : null}
      </ErrorFooter>
    </ErrorContainer>
  );
};

export default ErrorInfo;
