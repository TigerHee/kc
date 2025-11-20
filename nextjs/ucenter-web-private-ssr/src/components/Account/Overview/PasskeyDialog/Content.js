/**
 * Owner: eli.xiang@kupotech.com
 */

import { Button, styled, useTheme } from '@kux/mui';

import CrossDevice from 'static/ucenter/passkey/crossDevice.svg';
import NoPassword from 'static/ucenter/passkey/noPassword.svg';
import PasskeyDark from 'static/ucenter/passkey/passkey-dialog-dark.png';
import PasskeyLight from 'static/ucenter/passkey/passkey-dialog-light.png';
import SafeCheck from 'static/ucenter/passkey/safeCheck.svg';

import { _t, _tHTML } from 'tools/i18n';

const TopImg = styled.img`
  width: 194px;
  height: 120px;
  object-fit: cover;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 456px;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

const TitleText = styled.div`
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
`;

const ContentText = styled.div`
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const Title = styled(TitleText)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  margin-top: 20px;
`;

const SubTitle = styled(ContentText)`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 16px;
  margin-top: 9px;
`;

const ListTitle = styled(TitleText)`
  color: ${({ theme }) => theme.colors.text};
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 16px;
`;

const ListContent = styled(ContentText)`
  color: ${({ theme }) => theme.colors.text60};
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 14px;
`;

const PasskeyItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const PasskeyItemWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  gap: 28px;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.colors.divider8};
  margin: 32px 0;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 40px;
`;

const FooterTipTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 114.286% */
  margin-top: 24px;
  cursor: pointer;
`;

const FooterTipDesc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 18px */
  margin-top: 8px;
`;

const PasskeyDesc = [
  {
    icon: NoPassword,
    title: _t('defcca9ca94b4000ada3'),
    content: _t('30b6b19f8c774000a1df'),
  },
  {
    icon: CrossDevice,
    title: _t('4d75d3c793ec4000a000'),
    content: _t('ff460e93b6cf4000aebb'),
  },
  {
    icon: SafeCheck,
    title: _t('f774606ffc8c4000acef'),
    content: _t('ac9d7e59e2eb4000a59e'),
  },
];

const StyledButton = styled(Button)`
  border-radius: 90px;
  background: ${({ theme }) => (theme.currentTheme === 'light' ? theme.colors.cover : '#00C288')},
  color: ${({ theme }) => theme.colors.textEmphasis};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 114.286% */

  &:hover {
    background: ${({ theme }) => (theme.currentTheme === 'light' ? theme.colors.cover : '#00C288')},
  }
`;

export default function PasskeyDialogContent({ onOk, onCancel }) {
  const { title } = prompt || {};
  const { currentTheme } = useTheme();

  return (
    <Wrapper>
      <TopImg src={currentTheme === 'light' ? PasskeyLight : PasskeyDark} alt={title} />
      <Title>{_t('6607316fd2944000a6d1')}</Title>
      <SubTitle>{_tHTML('48d779a2c97f4000acdc', { a: '/support/36658009244057' })}</SubTitle>
      <Divider />
      <PasskeyItemWrapper>
        {PasskeyDesc.map(({ icon, title, content }, index) => {
          return (
            <PasskeyItem key={title}>
              <img src={icon} alt={title} />
              <div>
                <ListTitle>{title}</ListTitle>
                <ListContent>{content}</ListContent>
              </div>
            </PasskeyItem>
          );
        })}
      </PasskeyItemWrapper>
      <Footer>
        <StyledButton onClick={onOk}>{_t('370a4aca4bb74000a0b1')}</StyledButton>
        <FooterTipTitle onClick={onCancel}>{_t('c58ed3d15b884000a62f')}</FooterTipTitle>
        <FooterTipDesc>{_t('44cc2d86ce454000a28b')}</FooterTipDesc>
      </Footer>
    </Wrapper>
  );
}
