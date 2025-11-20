/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo, useState } from 'react';
import Dialog from '@kufox/mui/Dialog';
import classnames from 'classnames';
import styles from './style.less';
import { Button } from '@kufox/mui';
import { _t } from 'src/utils/lang';

const CupCommonDialog = props => {
  const { children, className, footer, okText, showCancelText, ...restProps } = props;
  const classNamePro = classnames(styles.dialog, className);
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    if (!restProps.onOk) return;

    setLoading(true);
    try {
      await restProps.onOk();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const renderFooter = () => {
    if (footer) return footer;

    return (
      <div className={styles.dialog__btns}>
        <>
          {okText && (
            <Button
              fullWidth
              className={styles.dialog__btns_ok}
              onClick={handleOk}
              loading={loading}
            >
              {okText}
            </Button>
          )}
          <>
            {showCancelText && (
              <Button
                fullWidth
                variant="text"
                className={styles.dialog__btns_cancel}
                onClick={() => {
                  restProps.onCancel && restProps.onCancel();
                }}
              >
                {showCancelText}
              </Button>
            )}
          </>
        </>
      </div>
    );
  };

  const renderCloseNode = () => {
    return <div className={styles.close} />;
  };

  return (
    <Dialog
      cancelText={null}
      {...restProps}
      className={classNamePro}
      footer={renderFooter()}
      closeNode={renderCloseNode()}
    >
      {children}
    </Dialog>
  );
};

export default memo(CupCommonDialog);
