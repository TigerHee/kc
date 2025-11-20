/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { isRTLLanguage } from '@utils';
import { useTranslation } from '@tools/i18n';
import { css, useTheme, Global } from '@kux/mui';

// 全局样式， 可以用className
const GlobalStyle = ({ containerSelector = 'body' }) => {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = isRTLLanguage(i18n.language);

  const style = css`
    ${Boolean(isRTL) &&
      `
      .horizontal-flip-in-arabic {
        transform: scaleX(-1);
      }
    `};
    ${containerSelector} {
      a {
        color: ${colors.primary};
        &:hover {
          color: ${colors.primary};
        }
      }
    }
  `;

  return <Global styles={style} />;
};

export default GlobalStyle;
