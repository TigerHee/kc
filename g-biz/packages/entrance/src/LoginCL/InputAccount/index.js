/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import noop from 'lodash/noop';
import { useDispatch } from 'react-redux';
import { Box, styled, useResponsive } from '@kux/mui';
import { kcsensorsManualTrack } from '@utils/sensors';
import { useTranslation } from '@tools/i18n';
import AccountLogin from './AccountLogin';
import { useLang } from '../../hookTool';
import { NAMESPACE, ACCOUNT_LOGIN_TAB_KEY } from '../constants';
import { NoSSG } from '../../common/tools';

const TitleContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 31px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: ${(props) => (props.withDrawer ? '36px' : '40px')};
  line-height: 130%;
  margin-top: 0;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  margin-top: 12px;
  margin-bottom: 9px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

function InputAccount(props = {}) {
  const {
    classes = {},
    onSuccess = noop,
    onForgetPwdClick = noop,
    signOrDownClick,
    customTitle,
    withDrawer,
  } = props;
  const rv = useResponsive();
  const isSm = !rv?.sm;
  const { t } = useLang();
  const { t: _t } = useTranslation('entrance');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        scanLoginShow: false,
      },
    });
  }, [dispatch]);

  // 登陆组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['signinLogin', '1'],
    });
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box style={{ flex: 1, minHeight: '400px' }}>
        <TitleContainer>
          {customTitle || (
            <Title className={classes.title} withDrawer={withDrawer}>
              {t('7515c185883e4000afec')}
            </Title>
          )}
          {<SubTitle withDrawer={withDrawer}>{_t('76acb52a6c9b4000a583')}</SubTitle>}
        </TitleContainer>
        {/* 大屏不确定用户应该显示二维码还是账号登录，生成ssg可能会导致闪烁，所以禁用ssg */}
        {/* 小屏禁用扫码登录，始终使用账号登录，可以生成ssg模板 */}
        <NoSSG byPass={isSm}>
          <AccountLogin
            tabKey={ACCOUNT_LOGIN_TAB_KEY}
            onSuccess={onSuccess}
            onForgetPwdClick={onForgetPwdClick}
            signOrDownClick={signOrDownClick}
            withDrawer={withDrawer}
          />
        </NoSSG>
      </Box>
    </Box>
  );
}

export default InputAccount;
