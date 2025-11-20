/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICTriangleBottomOutlined, ICTriangleTopOutlined } from '@kux/icons';
import { numberFormat, styled } from '@kux/mui';

const Wrapper = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  display: flex;
  align-items: center;
  color: ${({ theme, value }) =>
    value > 0 ? theme.colors.primary : value < 0 ? theme.colors.secondary : theme.colors.text60};
`;

const TopIcon = styled(ICTriangleTopOutlined)``;
const BottomIcon = styled(ICTriangleBottomOutlined)``;

const ChangeRate = ({ value, className, hideIcon }) => {
  const { currentLang } = useLocale();
  if (typeof value !== 'number') value = +value;
  if (value + '' === 'NaN') return null;
  return (
    <Wrapper className={className} value={value}>
      {numberFormat({
        options: { style: 'percent', maximumFractionDigits: 2 },
        number: value,
        lang: currentLang,
        isPositive: true,
      })}
      {hideIcon ? null : value > 0 ? <TopIcon /> : value < 0 ? <BottomIcon /> : null}
    </Wrapper>
  );
};
export default ChangeRate;
