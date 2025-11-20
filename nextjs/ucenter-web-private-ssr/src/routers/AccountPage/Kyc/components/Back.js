import { ICArrowRight2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';
import useTranslation from '@/hooks/useTranslation';

const Back = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  .ICArrowRight2_svg__icon {
    transform: scaleX(-1);
  }
`;

export default ({ onBack }) => {
  const { t: _t } = useTranslation();
  return (
    <Back onClick={onBack} data-testid="back">
      <ICArrowRight2Outlined size={16} />
      <span>{_t('back')}</span>
    </Back>
  );
};
