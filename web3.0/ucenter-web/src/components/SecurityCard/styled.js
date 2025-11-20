import styled from '@emotion/styled';
import { Button } from '@kux/design';

const ButtonWrapper = styled(Button)`
  &.kux-button.kux-button-outlined {
    height: 32px;
    border-radius: 25px;

    & .kux-button-content {
      font-size: 12px;
      line-height: 130%;
    }
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 40px 16px 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 0px 0;
  }
`;
const TitleWrapper = styled.div`
  width: 100%;
  padding: 0 32px;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
const Title = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const Subtitle = styled.div`
  width: 100%;
  font-weight: 400;
  font-size: 12px;
  margin-top: 8px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
`;
const ContentWrapper = styled.div`
  width: 100%;
  margin-bottom: 48px;
`;
const SecurityItemWrapper = styled.div`
  width: 100%;
  padding: 0 16px;
  :hover {
    background: ${({ theme }) => theme.colors.cover2};
    border-radius: 12px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
const SecurityItemContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 26px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 26px 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 0;
  }
`;
const SecOptItemLeft = styled.div`
  display: flex;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-items: flex-start;
  }
`;
const SecIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: 20px;
  background: var(--kux-cover4);
  border-radius: 50%;
  flex-shrink: 0;
  img {
    width: ${({ theme }) => (theme.currentTheme === 'light' ? '36px' : '48px')};
    height: ${({ theme }) => (theme.currentTheme === 'light' ? '36px' : '48px')};
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-right: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    img {
      width: ${({ theme }) => (theme.currentTheme === 'light' ? '30px' : '40px')};
      height: ${({ theme }) => (theme.currentTheme === 'light' ? '30px' : '40px')};
    }
  }

  .icon {
    color: var(--kux-buttonColorPrimary);
  }
`;
const SecName = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;
const SecNameLabel = styled.span`
  div {
    line-height: 20px;
  }
`;
const SecTip = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-top: 2px;
  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SettingContent = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 56px;
  svg {
    color: ${({ theme, isSetting }) =>
      isSetting ? theme.colors.primary : theme.colors.complementary};
  }
  span {
    margin-left: 4px;
  }
  & .not-setting {
    color: var(--kux-icon60);
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 8px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
`;

const SecOptItemRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 56px;
  width: 450px;
  flex-shrink: 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    min-width: 200px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: none;
  }
`;
const BtnWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  & .rightBtn {
    margin-left: 12px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: flex-start;
    margin-top: 16px;
  }
`;

export {
  ButtonWrapper,
  Wrapper,
  TitleWrapper,
  Title,
  Subtitle,
  ContentWrapper,
  SecurityItemWrapper,
  SecurityItemContent,
  SecOptItemLeft,
  SecOptItemRight,
  BtnWrapper,
  SecIcon,
  SecName,
  SecNameLabel,
  SecTip,
  SettingContent,
};
