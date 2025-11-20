import { useCallback, useEffect, useState } from 'react';
import { styled, useTheme, Button, Box } from '@kux/mui';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import { getExtended, parseExtendedRequestOptionsFromJSON } from '../utils/webauthn-json';
import { getPasskeyInfo, verifyValidationCode } from '../services';

import passkeySrc from '../../static/passkey_loading.svg';
import passkeyDarkSrc from '../../static/passkey_loading.dark.svg';
import passkeyFailedSrc from '../../static/passkey_failed.svg';
import passkeyFailedDarkSrc from '../../static/passkey_failed.dark.svg';
import { METHODS } from '../constants';
import SupplementInfo from './SupplementInfo';
import useLang from '../hooks/useLang';

const STATUS = {
  INIT: 'INIT',
  LOADING: 'LOADING',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Img = styled.img`
  width: 254px;
  align-self: center;
  margin-bottom: 20px;
`;
const Title = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 700;
  line-height: 140%; /* 28px */
  margin-bottom: 8px;
`;
const Desc = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
`;

export default function Passkey({
  bizType,
  transactionId,
  supplement,
  canSwitch,
  onSwitch,
  onTitleChange,
  onSuccess,
}) {
  const theme = useTheme();
  const { _t } = useLang();
  const [status, setStatus] = useState(STATUS.INIT);
  const [showSupplement, setShowSupplement] = useState(false);

  const handleVerify = useCallback(async () => {
    if (status === STATUS.LOADING) {
      return;
    }
    setStatus(STATUS.LOADING);
    try {
      // 调用端上 passkey 的 api 的 options 由后端下发
      const authnOptions = await getPasskeyInfo();
      // 以下为使用浏览器 passkey 的具体实现，参考 passkey 登录的实现
      // 代码源自 packages/entrance/src/hookTool/usePasskeyLogin.js
      const authnData = JSON.parse(authnOptions?.data?.passkeyInfo);
      const request = { publicKey: { ...authnData } };
      const cco = parseExtendedRequestOptionsFromJSON(request);
      const res = await getExtended(cco);
      const jsonRes = res.toJSON();
      const credentialResponse = JSON.stringify(jsonRes);
      // 复用现有的验证接口，新增字段 PK 用于提交签名
      const { data } = await verifyValidationCode({
        bizType,
        validations: { [METHODS.PASSKEY]: credentialResponse },
        transactionId,
      });
      setStatus(STATUS.SUCCESS);
      onSuccess(data.token);
    } catch (error) {
      setStatus(STATUS.FAILED);
      console.error(error);
    }
  }, [status, bizType, transactionId, onSuccess]);

  useEffect(() => {
    if (status === STATUS.INIT) {
      handleVerify();
    }
  }, [status, handleVerify]);

  useEffect(() => {
    onTitleChange(
      showSupplement ? _t('safe_verify_matching_empty_title') : _t('d7df779227394000afd7'),
    );
  }, [showSupplement]);

  return (
    <Container>
      {showSupplement ? (
        <>
          <SupplementInfo supplement={supplement} />
          <ButtonGroup>
            <Button
              size="large"
              onClick={() => {
                window.location.href = addLangToPath(
                  '/account/security',
                  storage.getItem('kucoinv2_lang'),
                );
              }}
            >
              {_t('23d1f3bb2e214800ab9b')}
            </Button>
            <Button
              size="large"
              variant="text"
              onClick={() => {
                setShowSupplement(false);
                handleVerify();
              }}
            >
              {_t('1e7f45951fa74000a188')}
            </Button>
          </ButtonGroup>
        </>
      ) : status === STATUS.FAILED ? (
        <>
          <Img src={theme.currentTheme === 'dark' ? passkeyFailedDarkSrc : passkeyFailedSrc} />
          <Title>{_t('44b85c5826b64800a0c6')}</Title>
          <Desc>{_t('da0dc22804b54000a31f')}</Desc>
          <ButtonGroup>
            <Button size="large" onClick={handleVerify}>
              {_t('0301a3e092e44000ae85')}
            </Button>
            <Button
              size="large"
              variant="text"
              onClick={() => {
                if (canSwitch) {
                  onSwitch();
                } else {
                  setShowSupplement(true);
                }
              }}
            >
              {_t('d10b3b11531e4000ac30')}
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <Img src={status === STATUS.FAILED ? passkeyDarkSrc : passkeySrc} />
          <Desc>{_t('c24efe794fc64000a285')}</Desc>
          <Box size={24} />
        </>
      )}
    </Container>
  );
}
