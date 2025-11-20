import LOGO from 'static/global/logo-new.svg';
import { _t, _tHTML } from 'tools/i18n';
import {
  CancelButton,
  CenterWrap,
  CodeRect,
  CodeRectWrap,
  DialogFooter,
  Line,
  LoginSafeWord,
  LogoImg,
  MailDesc,
  MailSafeWord,
  MailTitle,
  SafeWordContainer,
  SafeWordContent,
  SafeWordLogoWrap,
  SafeWordTitle,
  SMSContent,
  SMSSafeWord,
  StyledDialog,
  WithdrawalSafeWord,
} from './styled';

export const ExampleModal = ({ open, onClose }) => {
  return (
    <StyledDialog
      open={open}
      title={_t('7d03ba059aa34000a10a')}
      showCloseX
      onCancel={onClose}
      footer={
        <DialogFooter>
          <CancelButton onClick={onClose}>{_t('a7c3e0a0ae714800a858')}</CancelButton>
        </DialogFooter>
      }
    >
      {/* 登陆安全码 */}
      <SafeWordContainer>
        <SafeWordTitle>{_t('6107028294b64800a297')}</SafeWordTitle>
        <SafeWordLogoWrap>
          <div>
            <LogoImg src={window?._BRAND_LOGO_ || LOGO} alt={window?._BRAND_NAME_ || 'KuCoin'} />
          </div>
        </SafeWordLogoWrap>
        <SafeWordContent>
          <MailTitle />
          <MailDesc width="216px" />
          <CodeRectWrap>
            {
              // eslint-disable-next-line react/no-array-index-key
              new Array(6).fill(0).map((_, idx) => (
                <CodeRect key={idx} />
              ))
            }
          </CodeRectWrap>
          <Line />
          <LoginSafeWord>{_tHTML('9bb8814fddfa4000abc6')}</LoginSafeWord>
          <MailDesc width="100%" marginBottom="15px" />
        </SafeWordContent>
      </SafeWordContainer>
      {/* 邮箱安全码 */}
      <SafeWordContainer>
        <SafeWordTitle>{_t('cbcda6e848174800af3f')}</SafeWordTitle>
        <SafeWordLogoWrap>
          <div>
            <LogoImg src={window?._BRAND_LOGO_ || LOGO} alt={window?._BRAND_NAME_ || 'KuCoin'} />
          </div>
        </SafeWordLogoWrap>
        <SafeWordContent>
          <MailTitle />
          <MailDesc width="216px" />
          <Line />
          <CenterWrap>
            <MailDesc width="64px" marginBottom="6px" />
          </CenterWrap>
          <MailSafeWord>{_tHTML('9bb8814fddfa4000abc6')}</MailSafeWord>
          <CenterWrap>
            <MailDesc width="220px" marginBottom="6px" />
          </CenterWrap>
        </SafeWordContent>
      </SafeWordContainer>
      {/* 短信安全码 */}
      <SafeWordContainer>
        <SafeWordTitle>{_t('d6e3cdd3b6ff4800a94c')}</SafeWordTitle>
        <SafeWordLogoWrap>
          <div>
            <LogoImg src={window?._BRAND_LOGO_ || LOGO} alt={window?._BRAND_NAME_ || 'KuCoin'} />
          </div>
        </SafeWordLogoWrap>
        <SafeWordContent>
          <Line />
          <SMSContent>
            <MailDesc width="100%" marginBottom="6px" />
            <MailDesc width="100%" marginBottom="6px" />
            <MailDesc width="114px" marginBottom="6px" />
            <SMSSafeWord>{_tHTML('9bb8814fddfa4000abc6')}</SMSSafeWord>
          </SMSContent>
        </SafeWordContent>
      </SafeWordContainer>
      {/* 提币安全码 */}
      <SafeWordContainer>
        <SafeWordTitle>{_t('63f604d270524000ad35')}</SafeWordTitle>
        <SafeWordLogoWrap>
          <div>
            <LogoImg src={window?._BRAND_LOGO_ || LOGO} alt={window?._BRAND_NAME_ || 'KuCoin'} />
          </div>
        </SafeWordLogoWrap>
        <SafeWordContent>
          <CenterWrap>
            <MailTitle />
          </CenterWrap>
          <CenterWrap>
            <MailDesc width="216px" />
          </CenterWrap>
          <Line />
          <WithdrawalSafeWord>{_tHTML('9bb8814fddfa4000abc6')}</WithdrawalSafeWord>
          <MailDesc width="100%" marginBottom="6px" />
          <MailDesc width="114px" marginBottom="6px" />
        </SafeWordContent>
      </SafeWordContainer>
    </StyledDialog>
  );
};
