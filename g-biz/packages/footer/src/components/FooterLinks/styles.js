import { css } from '@kux/mui';

export const useStyles = ({ theme }) => {
  return {
    newFooterLinks: css({
      display: 'flex',
      flexWrap: 'wrap',
      '&:after': {
        width: '50%',
        [theme.breakpoints.down('sm')]: {
          width: 0,
        },
        content: `' '`,
      },
    }),
    ukLastGroup: css({
      paddingBottom: 28,
      [theme.breakpoints.down('sm')]: {
        paddingBottom: 28,
      },
    }),
    ukFooterLinks: css({
      justifyContent: 'flex-start',
    }),
    mergeNavTitle: css({
      marginTop: 56,
    }),
    association: css({
      width: '20%',
    }),
    associationTitle: css({
      [theme.breakpoints.down('sm')]: {
        marginBottom: 28,
      },
    }),
    newFooterAssociationList: css({
      display: 'flex !important',
      flexWrap: 'wrap',
      listStyle: 'none',
    }),
    associationHoverMenu: css({
      left: 16,
    }),
    noMarginBottom: css({
      marginBottom: 0,
    }),
    newFooterAssociationItem: css({
      transform: 'translateY(0)',
      width: '32px !important',
      height: '32px !important',
      // textAlign: 'center',
      marginRight: 16,
      marginLeft: 0,
      marginBottom: 16,
      transition: 'all .3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
      '[dir="rtl"] &': {
        marginRight: 0,
        marginLeft: 21,
      },
      'img': {
        width: 24,
        height: 24,
      },
    }),
    newFooterReddit: css({
      '@media screen and (max-width: 1024px)': {
        left: 60,
        '&::after': {
          left: 74,
          '[dir="rtl"] &': {
            left: 'unset',
            right: 74,
          },
        },
      },
    }),
    newFooterFacebook: css({
      '@media screen and (max-width: 1024px)': {
        left: 90,
        '&::after': {
          left: 50,
          '[dir="rtl"] &': {
            left: 'unset',
            right: 50,
          },
        },
      },
      [theme.breakpoints.down('sm')]: {
        bottom: 38,
        '&::after': {
          left: 20,
          '[dir="rtl"] &': {
            left: 'unset',
            right: 20,
          },
        },
      },
    }),
    newFooterTwitter: css({
      '@media screen and (max-width: 1024px)': {
        left: 70,
        '&::after': {
          left: 70,
          '[dir="rtl"] &': {
            left: 'unset',
            right: 70,
          },
        },
      },
    }),
    pureA: css({
      color: 'inherit',
      textDecoration: 'none',
      pointerEvents: 'none',
      '&:hover': {
        color: 'inherit',
        textDecoration: 'none',
      },
    }),
  };
};
