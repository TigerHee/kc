/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import { _t, _tHTML } from 'src/tools/i18n';
import Benefit1IconDark from 'static/account/kyc/kyb/benefit_1_icon.dark.svg';
import Benefit1Icon from 'static/account/kyc/kyb/benefit_1_icon.svg';
import Benefit2IconDark from 'static/account/kyc/kyb/benefit_2_icon.dark.svg';
import Benefit2Icon from 'static/account/kyc/kyb/benefit_2_icon.svg';
import Benefit3IconDark from 'static/account/kyc/kyb/benefit_3_icon.dark.svg';
import Benefit3Icon from 'static/account/kyc/kyb/benefit_3_icon.svg';
import Benefit4IconDark from 'static/account/kyc/kyb/benefit_4_icon.dark.svg';
import Benefit4Icon from 'static/account/kyc/kyb/benefit_4_icon.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;
const GridItem = styled.div`
  display: flex;
  padding: 20px 24px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;

const MoreBenefits = () => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  return (
    <Container>
      <Title>{_t('6d4f8c979d124000a3d0')}</Title>
      <Grid>
        <GridItem>
          <span>{_tHTML('7da96dc42d0e4000a92d')}</span>
          <img src={isDark ? Benefit1IconDark : Benefit1Icon} alt="benefit" />
        </GridItem>
        <GridItem>
          <span>{_tHTML('67553c0b475c4800a797')}</span>
          <img src={isDark ? Benefit2IconDark : Benefit2Icon} alt="benefit" />
        </GridItem>
        <GridItem>
          <span>{_tHTML('431e19043cbc4000acfb')}</span>
          <img src={isDark ? Benefit3IconDark : Benefit3Icon} alt="benefit" />
        </GridItem>
        <GridItem>
          <span>{_tHTML('82453bb8447c4000aa96')}</span>
          <img src={isDark ? Benefit4IconDark : Benefit4Icon} alt="benefit" />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default MoreBenefits;
