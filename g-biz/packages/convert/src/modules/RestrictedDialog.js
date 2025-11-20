/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useEventCallback } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import addLangToPath from '@tools/addLangToPath';
import { BaseDialog } from '@packages/userRestrictedCommon';
import { NAMESPACE } from '../config';

const RestrictedDialog = (props) => {
  const {
    title,
    content,
    buttonAgree,
    buttonRefuse,
    buttonAgreeWebUrl,
    buttonRefuseWebUrl,
  } = props;
  const dispatch = useDispatch();
  const { t: _t } = useTranslation('convert');

  const onOk = useEventCallback(() => {
    if (buttonAgreeWebUrl) {
      window.location.href = addLangToPath(buttonAgreeWebUrl);
    } else {
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          kyc3TradeLimitInfo: null,
        },
      });
    }
  });

  const onCancel = useEventCallback(() => {
    if (buttonRefuseWebUrl) {
      window.location.href = addLangToPath(buttonRefuseWebUrl);
    } else {
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          kyc3TradeLimitInfo: null,
        },
      });
    }
  });

  return (
    <BaseDialog
      onOk={onOk}
      title={title}
      content={content}
      onCancel={onCancel}
      visible={Boolean(title)}
      buttonAgree={buttonAgree}
      buttonRefuse={buttonRefuse || _t('cancel')}
    />
  );
};

export default React.memo(RestrictedDialog);
