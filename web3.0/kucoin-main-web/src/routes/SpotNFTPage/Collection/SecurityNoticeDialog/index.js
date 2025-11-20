/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { Form } from '@kc/ui';
import { Spin } from '@kufox/mui';
import { useSnackbar } from '@kufox/mui';
import CustomDialog from 'components/SpotNFT/CustomDialog';
import { _t } from 'tools/i18n';
import { generateUuid } from 'helper';
import style from './style.less';
import SecForm from 'src/components/CommonSecurity';

const SecurityNoticeDialog = (props) => {
  const bizType = 'WITHDRAWAL';
  const { message } = useSnackbar();
  const { open, onCancel, onOk, info, formValue, form, dispatch, safeImgData } = props;
  const { securtyStatus } = useSelector((state) => ({ ...state.user }));
  const { WITHDRAW_PASSWORD, EMAIL, GOOGLE2FA, SMS } = securtyStatus;
  const [updateKey, setUpdateKey] = useState(generateUuid());
  const [allowTypes, setAllowTypes] = useState([]);
  const isLoadingSecForm = useSelector(
    (state) => state.loading.effects['security_new/get_verify_type'],
  );

  const clear = () => {
    setUpdateKey(generateUuid()); // reset form
  };

  const handleConfirm = useCallback(
    async (verifyRes) => {
      const memo = '';
      const currency = info.nftCurrency;
      const amount = 1;
      if (verifyRes && verifyRes.code === '200') {
        // 提现
        const withDrawRes = await dispatch({
          type: 'spot_nft_collection/withdraw',
          payload: {
            address: formValue.address,
            remark: '',
            memo,
            currency,
            amount,
            securityId: safeImgData.id,
            tokenId: info.nftId,
            // verificationCode: values.verificationCode, // 可删 提现业务已经不传了
          },
        });
        if (withDrawRes?.code === '200') {
          clear();
          message.success(_t('operation.succeed'));
          onOk();
        } else {
          message.error(withDrawRes.msg);
        }
      } else {
        message.error(verifyRes.msg);
      }
    },
    [dispatch, formValue, onOk, info, safeImgData],
  );

  const handleCancel = () => {
    clear();
    onCancel();
  };

  const getVerifyType = async () => {
    let verifyType = [];

    verifyType = await dispatch({
      type: 'security_new/get_verify_type',
      payload: {
        bizType,
      },
    });

    // 接口判断无需校验时 手动设置校验方式
    if (verifyType && verifyType.length === 0) {
      if (WITHDRAW_PASSWORD && EMAIL && GOOGLE2FA) {
        verifyType.push(['withdraw_password', 'my_email', 'google_2fa']);
      }

      if (WITHDRAW_PASSWORD && SMS) {
        verifyType.push(['withdraw_password', 'my_sms']);
      }
    }

    return verifyType;
  };

  useEffect(() => {
    if (open) {
      getVerifyType().then((verifyType) => {
        setAllowTypes(verifyType);
      });
    }
  }, [open]);

  if (!info) {
    return null;
  }
  return (
    <CustomDialog
      key={updateKey}
      className={style.securityNoticeDialog}
      title={_t('security.verify')}
      titleAlignMobile={'left'}
      open={open}
      showCloseX
      cancelText=""
      footer={null}
      onCancel={handleCancel}
    >
      <Form>
        <Spin spinning={isLoadingSecForm}>
          <SecForm
            allowTypes={allowTypes}
            form={form}
            submitBtnTxt={_t('submit')}
            bizType={bizType}
            callback={handleConfirm}
            formItemClas={style.secFormItem}
          />
        </Spin>
      </Form>
    </CustomDialog>
  );
};

export default connect()(Form.create()(SecurityNoticeDialog));
