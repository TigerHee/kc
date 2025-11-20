/**
 * Owner: june.lee@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowLeft2Outlined, ICArrowRight2Outlined } from '@kux/icons';
import { _t } from 'src/tools/i18n';
import { StyledMoreButton } from '../../styledComponents';

export function MoreButton(props) {
  const { isRTL } = useLocale();
  const ArrowIcon = isRTL ? ICArrowLeft2Outlined : ICArrowRight2Outlined;
  return (
    <StyledMoreButton {...props}>
      {_t('more')} <ArrowIcon size={16} />
    </StyledMoreButton>
  );
}
