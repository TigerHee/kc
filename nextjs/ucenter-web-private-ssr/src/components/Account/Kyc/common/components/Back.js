/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowLeft2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import createResponsiveMarginCss from '../../utils/createResponsiveMarginCss';

const BackWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  gap: 8px;
  width: fit-content;
  align-items: center;
  cursor: pointer;
  margin-top: 32px;
  ${({ theme, hasMarginLeft = true }) => {
    return hasMarginLeft ? createResponsiveMarginCss(theme) : '';
  }};
`;
const BackIcon = styled(ICArrowLeft2Outlined)`
  font-size: 16px;
`;
const Back = ({ onBack, hasMarginLeft, backText, ...props }) => {
  return (
    <BackWrapper data-testid="back" hasMarginLeft={hasMarginLeft} onClick={onBack} {...props}>
      <BackIcon />
      {backText || _t('back')}
    </BackWrapper>
  );
};

export default Back;
