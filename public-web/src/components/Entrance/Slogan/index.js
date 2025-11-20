/**
 * Owner: willen@kupotech.com
 */
import { Box } from '@kufox/mui';

import { useQueryParams } from '../hookTool';

import { useLocale } from '@kucoin-base/i18n';
import { isPropValid, styled, useTheme } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { getSloganStyle } from './util';

const SloganText = styled('p', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, isSignupPage, currentLang, isZh }) => {
  return {
    color: theme.colors.base,
    fontWeight: '500',
    position: 'relative',
    lineHeight: '56px',
    marginBottom: isSignupPage ? '8px' : '1em',
    ...getSloganStyle('slogan', currentLang),
    '.subSloganDesc': {
      lineHeight: isZh ? '56px' : '32px',
      color: theme.colors.base,
      fontWeight: '500',
      display: 'block',
      marginTop: 16,
      ...getSloganStyle('subSloganDesc', currentLang),
    },
  };
});

const SubSlogan = styled('p', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ isSignupPage, theme, isZh }) => {
  return {
    ontSize: '16px',
    lineHeight: '24px',
    fontSize: isSignupPage ? '24px' : '34px',
    lineHeight: isZh ? '56px' : '32px',
    color: theme.colors.base,
  };
});

function Slogan({ isSignupPage }) {
  const { currentLang } = useLocale();
  const isZh = currentLang === 'zh_CN' || currentLang === 'zh_HK';

  useLocale();
  const theme = useTheme();
  const { isPoolx } = useQueryParams();
  let slogan = 'banner.safe';

  if (isSignupPage) {
    slogan = 'newcomer.signUp.kcWelcome';
  }
  if (isPoolx) {
    slogan = 'poolx.desc';
  }
  return (
    <Box
      padding="0px 25% 0 90px"
      display="flex"
      justifyContent="center"
      style={{
        position: 'absolute',
        top: '140px',
        wordBreak: 'break-word',
      }}
    >
      {!isSignupPage ? (
        <Box>
          <SloganText
            isZh={isZh}
            theme={theme}
            isSignupPage={isSignupPage}
            currentLang={currentLang}
          >
            {isZh ? '' : _t(slogan)}
            <span className="subSloganDesc" style={isZh ? { color: '#fff' } : null}>
              {_t('banner.choice')}
            </span>
          </SloganText>
        </Box>
      ) : (
        <Box>
          <SloganText
            isZh={isZh}
            theme={theme}
            isSignupPage={isSignupPage}
            currentLang={currentLang}
          >
            {_t(slogan)}
          </SloganText>
          <SubSlogan theme={theme} isZh={isZh} isSignupPage={isSignupPage}>
            {_t('newcomer.signUp.signUpDecs')}
          </SubSlogan>
        </Box>
      )}
    </Box>
  );
}

export default Slogan;
