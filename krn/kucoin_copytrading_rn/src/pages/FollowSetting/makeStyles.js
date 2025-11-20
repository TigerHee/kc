import {useMemo} from 'react';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

const makeUserInfoStyles = theme => ({
  card: css`
    padding: 12px 16px;
    background-color: ${theme.colorV2.background};
    padding-bottom: 12px;
  `,
  avatar: css`
    width: 32px;
    height: 32px;
    margin-right: 2px;
  `,
});

export const useMakeStyles = () => {
  const theme = useTheme();
  const styles = useMemo(
    () => ({
      userInfoStyles: makeUserInfoStyles(theme),
    }),
    [theme],
  );

  return styles;
};
