/**
 * Owner: tom@kupotech.com
 */
import { css, Global } from '@kufox/mui/emotion';
import useMediaQuery from '@kufox/mui/hooks/useMediaQuery';
import systemDynamic from 'utils/systemDynamic';
import { _tHTML } from 'utils/lang';

const SignUpDrawer = systemDynamic('@remote/entrance', 'SignUpDrawer');

function DrawerSignUp({ BoxProps, anchor = 'right', onClose, open = false, ...restProps } = {}) {
  const isSm = useMediaQuery('(max-width:768px)');

  const getBoxProps = () => {
    if (BoxProps) {
      return BoxProps;
    }
    if (isSm) {
      return {
        width: '100vw !important;',
        padding: '64px 24px 40px !important;',
        height: '100%',
        overflowY: 'auto',
      };
    }
    return {
      height: '100%',
      overflowY: 'auto',
    };
  };

  return (
    <>
      <Global
        styles={css`
          .aff-page-drawer {
            &.isSm {
              padding: 0;
            }
            .signUpDrawer-closeIcon {
              background-color: rgba(1, 8, 30, 0.04);
            }
          }
        `}
      />
      <SignUpDrawer
        agreeJSX={_tHTML('term.user.agree')}
        BoxProps={getBoxProps()}
        anchor={anchor}
        onClose={onClose}
        open={open}
        show={open}
        className={`aff-page-drawer ${isSm ? 'isSm' : ''}`}
        {...restProps}
      />
    </>
  );
}

export default DrawerSignUp;
