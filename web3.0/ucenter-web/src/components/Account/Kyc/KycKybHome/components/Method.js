/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useResponsive } from '@kux/mui';

const Container = styled.div`
  display: flex;
  padding: 36px 32px 40px 32px;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  border: 1px solid ${({ theme, active }) => (active ? theme.colors.text : theme.colors.cover12)};
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px 28px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    .arrow_left {
      display: initial;
    }
  }
`;
const Header = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px;
  }
`;
const Icon = styled.span`
  font-size: 32px;
  display: flex;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;
const TitleContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 22px;
  font-weight: 500;
  line-height: 130%;
  display: flex;
  gap: 8px;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const ArrowIcon = styled(ICArrowRight2Outlined)`
  margin-left: 12px;
  display: none;
  color: ${({ theme }) => theme.colors.text};
  transform: ${({ reflect }) => (reflect ? 'scale(-1)' : 'none')};
`;

const Method = ({ icon, title, description, onClick, ...props }) => {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const { isRTL } = useLocale();

  return (
    <Container {...props} onClick={onClick}>
      <Header>
        {!isH5 ? <Icon>{icon}</Icon> : null}
        <Title>
          <TitleContent>
            {isH5 ? <Icon>{icon}</Icon> : null}
            {title}
          </TitleContent>
          <Desc>{description}</Desc>
        </Title>
        <ArrowIcon size={28} className="arrow_left" reflect={isRTL} />
      </Header>
    </Container>
  );
};

export default Method;
