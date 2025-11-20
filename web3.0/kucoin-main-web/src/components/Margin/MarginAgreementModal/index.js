/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { noop, get } from 'lodash';
import { Spin, Checkbox, Dialog, styled } from '@kux/mui';
import Html from 'components/common/Html';
import { useLocale } from '@kucoin-base/i18n';
import { _t } from 'src/tools/i18n';

const DialogPro = styled(Dialog)`
  .KuxDialog-body {
    max-height: 100vh;
  }
`;

const Title = styled.p`
  text-align: center;
`;

export default React.memo(({ display, onConfirm, onClose = noop, showCheckbox = true }) => {
  const { isZh } = useLocale();
  const dispatch = useDispatch();
  const { agreement } = useSelector((state) => state.marginMeta);
  const loading = useSelector((state) => state.loading.effects['marginMeta/pullAgreementContent']);
  const [checked, setChecked] = useState(false);

  const agreementKey = isZh ? 'zh_CN' : 'default';

  const onChange = useCallback((e) => {
    setChecked(e.target.checked);
  }, []);

  const fetchAgreement = useCallback(
    (forceFetch) => {
      dispatch({
        type: 'marginMeta/pullAgreementContent',
        forceFetch,
        payload: {
          isZh,
        },
      });
    },
    [dispatch, isZh],
  );

  useEffect(() => {
    fetchAgreement();
  }, [fetchAgreement, isZh]);

  return (
    <DialogPro
      okText={_t('confirm')}
      cancelText={null}
      size="large"
      onCancel={onClose}
      title={_t('margin.sign.agreement')}
      open={display}
      onOk={onConfirm}
      okButtonProps={{
        disabled: showCheckbox && !checked,
        fullWidth: true,
      }}
    >
      <Spin spinning={loading}>
        <Title>{get(agreement, [agreementKey, 'title'])}</Title>
        <Html>{get(agreement, [agreementKey, 'content'])}</Html>
      </Spin>
      {showCheckbox && (
        <div>
          <Checkbox disabled={loading} onChange={onChange} checked={checked}>
            {_t('margin.read.know.risk')}
          </Checkbox>
        </div>
      )}
    </DialogPro>
  );
});
