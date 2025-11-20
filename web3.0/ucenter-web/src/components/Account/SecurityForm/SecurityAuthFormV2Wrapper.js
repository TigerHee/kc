/**
 * Owner: eli.xiang@kupotech.com
 */
import { Spin } from '@kux/mui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SecurityAuthFormV2 from 'components/Account/SecurityForm/SecurityAuthFormV2';

export default function SecurityAuthFormV2Wrapper({
  bizType,
  onSuccess,
  submitBtnTxt,
  showTitle = false,
}) {
  const loading = useSelector((state) => state.loading.effects['security_new/get_verify_type']);
  const [allowTypes, setAllowTypes] = useState([]);

  const dispatch = useDispatch();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const getAuthType = useCallback(
    async (bizType) => {
      try {
        const allowTypes = await dispatch({
          type: 'security_new/get_verify_type',
          payload: { bizType },
        });
        // 检测到不需要验证，或者验证类型为空的时候，直接进入下一步
        if (allowTypes && allowTypes.length === 0) {
          onSuccessRef.current?.();
          return;
        }
        setAllowTypes(allowTypes || []);
      } catch (e) {
        console.error(e);
      } finally {
      }
    },
    [dispatch],
  );

  useEffect(() => {
    getAuthType(bizType);
  }, [getAuthType, bizType]);

  return (
    <Spin spinning={loading} data-testid="passkey-security-spinner">
      <SecurityAuthFormV2
        allowTypes={allowTypes}
        bizType={bizType}
        onSuccess={onSuccess}
        submitBtnTxt={submitBtnTxt}
        showTitle={showTitle}
      />
    </Spin>
  );
}
