/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ForgetPwd } from '@kucoin-gbiz-next/entrance';
import { styled, useTheme } from '@kux/mui';
import { useBackground, useBackgroundDark } from 'components/Entrance/hookTool';
import LogoComp from 'components/Entrance/Logo';

const StyledForgetPwd = styled.div`
  flex: 1;
  height: 100%;
  .voiceCodeText {
    color: ${(props) => props.theme.colors.text};
  }
`;

export default (props) => {
  const backgroundProps = useBackground();
  const backgroundPropsDark = useBackgroundDark();
  useLocale();

  const theme = useTheme();
  const { currentTheme } = theme;
  const { LayoutSlots } = ForgetPwd;
  const { Logo, BackgroundStyle } = LayoutSlots;
  return (
    <StyledForgetPwd>
      <ForgetPwd theme={currentTheme} {...props}>
        <LayoutSlots>
          <Logo>
            <LogoComp />
          </Logo>
          <BackgroundStyle>
            {currentTheme === 'dark' ? backgroundPropsDark : backgroundProps}
          </BackgroundStyle>
        </LayoutSlots>
      </ForgetPwd>
    </StyledForgetPwd>
  );
};
