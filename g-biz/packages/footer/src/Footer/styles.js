import { css } from '@kux/mui';

export const useStyles = ({ theme }) => {
  return {
    cFooter: css({
      padding: '0 24px',
      'ul': {
        margin: '0px',
        padding: '0px',
      },
      'dd': {
        margin: '0px',
        padding: '0px',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0 16px',
      },
      'a': {
        display: 'block',
        width: 'fit-content',
        padding: '4px 0',
        fontSize: 14,
        textDecoration: 'none !important',
        wordBreak: 'break-all',
        cursor: 'pointer',
        color: theme.colors.text60,
        '&:hover': {
          color: theme.colors.text,
        },
      },
    }),
    footerMain: css({
      maxWidth: 1200,
      margin: '0 auto',
      paddingTop: 80,
      [theme.breakpoints.down('sm')]: {
        paddingTop: 48,
      },
    }),
    divider: css({
      height: 1,
      border: 'none',
      borderBottom: '1px solid',
      borderBottomColor: theme.colors.divider8,
      [theme.breakpoints.down('sm')]: {
        marginTop: -24,
      },
    }),
    copyright: css({
      padding: '20px 0px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    }),
    copyrightOneCol: css({
      padding: '20px 0px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    }),
    newCopyright: css({
      fontSize: 14,
      lineHeight: '130%',
      color: theme.colors.text40,
      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        marginBottom: 4,
      },
    }),
    servertime: css({
      display: 'flex',
    }),
    smCopyRight: css({
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    }),
    disclaimerDesc: css({
      marginTop: '20px',
      color: theme.colors.text40,
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '140%',
      whiteSpace: 'pre-line',
      'a': {
        display: 'inline-block',
        fontSize: '12px',
        padding: '0px',
        color: '#01BC8D',
      },
    }),
    highRiskDesc: css({
      marginBottom: '48px',
      padding: '8px 16px',
      fontSize: '14px',
      lineHeight: '1.6',
      color: theme.colors.text60,
      backgroundColor: theme.colors.cover2,
      borderRadius: '6px',
      textAlign: 'center',
    }),
  };
};
