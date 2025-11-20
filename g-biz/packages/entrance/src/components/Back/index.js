import { styled } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useLang } from '../../hookTool';

const Container = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: -16px;
    margin-bottom: 24px;
  }
  span {
    margin-left: 7px;
  }
  svg {
    transform: rotate(180deg);
  }
`;

export const Back = ({ onBack }) => {
  const { t } = useLang();
  return (
    <Container onClick={onBack}>
      <ICArrowRight2Outlined size="16" />
      <span>{t('8RcupwHqYraGhrjT8kAzG7')}</span>
    </Container>
  );
};
