/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowLeft2Outlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { _t } from 'tools/i18n';

const StyledWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;

const StyledText = styled.span`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-left: 8px;
`;

const Back = ({ onClick, ...props }) => {
  useLocale();

  const isInApp = JsBridge.isApp();

  const handleBack = () => {
    if (isInApp) {
      if (document.referrer) {
        window.location.replace(document.referrer);
      } else {
        JsBridge.open({
          type: 'func',
          params: { name: 'exit' },
        });
      }
    } else {
      if (onClick && typeof onClick === 'function') {
        onClick();
      } else {
        window.history.go(-1);
      }
    }
  };

  const theme = useTheme();

  return (
    <StyledWrap onClick={handleBack} {...props}>
      <ICArrowLeft2Outlined size="16" color={theme.colors.text60} />
      <StyledText>{_t('back')}</StyledText>
    </StyledWrap>
  );
};

export default Back;
