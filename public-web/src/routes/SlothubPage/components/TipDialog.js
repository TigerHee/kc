/*
 * owner: borden@kupotech.com
 */
import { Dialog, styled, useResponsive } from '@kux/mui';
import NoSSG from 'components/NoSSG';
import React from 'react';
import { _t } from 'src/tools/i18n';

const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-width: 400px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      max-width: 80%;
      padding-top: 32px;
    }
  }
  .KuxModalHeader-root {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      min-height: unset !important;
      padding: 0 24px 12px !important;
    }
  }
  .KuxDialog-content {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 0 24px;
    }
    ${({ theme }) => theme.breakpoints.up('sm')} {
      ${(props) => (props.title ? '' : 'padding-top: 32px;')}
    }
  }
  .KuxModalFooter-root {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 24px 24px 32px 24px;
    }
  }
`;

const TipDialog = ({
  footerProps,
  okButtonProps,
  title,
  hiddenShowCloseX = false,
  hiddenTitle = false,
  ...otherProps
}) => {
  const { sm } = useResponsive();
  return (
    <NoSSG>
      <StyledDialog
        showCloseX={hiddenShowCloseX ? false : hiddenShowCloseX}
        centeredFooterButton
        title={hiddenTitle ? false : title || _t('hmMdg7DMuLwHvqys1H1QpT')}
        okButtonProps={{ fullWidth: true, ...okButtonProps }}
        {...(!sm ? { header: null } : null)}
        {...otherProps}
      />
    </NoSSG>
  );
};

export default React.memo(TipDialog);
