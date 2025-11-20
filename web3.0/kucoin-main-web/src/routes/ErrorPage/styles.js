/**
 * Owner: victor.ren@kupotech.com
 */
import { css } from '@kux/mui';

export const useStyles = ({ theme }) => {
  return {
    error: css({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 24px 0',
    }),
    box: css({
      maxWidth: 1200,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }),
    img: {
      width: '100%',
      maxWidth: 360,
    },
    title: {
      marginTop: 24,
      fontSize: 28,
      fontWeight: 600,
      color: theme.colors.text,
    },
    description: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: 400,
      color: theme.colors.text40,
    },
    button: {
      marginTop: 32,
    },
  };
};
