/**
 * Owner: vijay.zhou@kupotech.com
 * 【状态：认证失败】的高阶组件，封装了通用部分的ui
 */
import { Button, styled, Tooltip, useTheme } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { searchToJson } from 'helper';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import FailureReason from 'src/components/Account/Kyc/KycHome/FailureReason';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const ExBaseAlert = styled(BaseAlert)`
  margin-bottom: 16px;
  user-select: none;
  & span > span {
    text-decoration: underline;
  }
`;

const ButtonBox = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    gap: 32px;
    justify-content: center;
    button {
      padding: 0 34.5px;
    }
  }
`;

const { soure } = searchToJson();

export default function RejectedWrapper(RejectedComp) {
  return function KycStatusRejected({ failureReasonLists, onClickVerify, sensorStatus }) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const props = useMemo(
      () => ({
        reason: (
          <Tooltip
            onOpen={() => {
              trackClick(['FailReason', '1'], {
                soure: soure || '',
                kyc_homepage_status: sensorStatus,
              });
            }}
            title={<FailureReason failureReasonLists={failureReasonLists} />}
          >
            <div style={{ display: 'inline-flex' }}>
              <ExBaseAlert type="error">{_tHTML('4uVfEqapQ5qKnUKYm5176L')}</ExBaseAlert>
            </div>
          </Tooltip>
        ),
        rightImg: (
          <KycIcon src={theme.currentTheme === 'light' ? kyc_unverified : kyc_unverified_dark} />
        ),
        verifyButton: (
          <ButtonBox>
            <VerifyButton onClick={onClickVerify}>{_t('mwdwXUvagzZaLxv8oYUZLr')}</VerifyButton>
            <Button
              variant="text"
              size="large"
              style={{ marginLeft: 32 }}
              onClick={() => dispatch({ type: 'kyc/update', payload: { isRestartOpen: true } })}
            >
              {_t('a15c27c4b6224800a9ea')}
            </Button>
          </ButtonBox>
        ),
      }),
      [sensorStatus, theme, onClickVerify, failureReasonLists],
    );

    return <RejectedComp {...props} />;
  };
}
