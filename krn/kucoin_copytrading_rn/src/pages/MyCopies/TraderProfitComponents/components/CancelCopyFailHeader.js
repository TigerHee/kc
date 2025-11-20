import React, {memo} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import styled, {css} from '@emotion/native';

import Alert from 'components/Common/Alert';
import {ErrorTipIcon} from 'components/Common/SvgIcon';
import {CANCEL_COPY_STATUS} from 'constants/businessType';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {CancelCopyText, FailHeaderCard, FailText} from './styles';

const StyledAlert = styled(Alert)`
  margin-top: 16px;
`;

const {CLOSED_WAIT_CONFIRM, FAILED} = CANCEL_COPY_STATUS;

export const CancelCopyFailHeader = memo(
  ({copyStatus, gotoViewFollowSetting}) => {
    const {_t} = useLang();

    if (copyStatus === CLOSED_WAIT_CONFIRM) {
      return <StyledAlert message={_t('358c56a8eb124000af65')} />;
    }

    if (copyStatus === FAILED) {
      return (
        <FailHeaderCard>
          <RowWrap>
            <ErrorTipIcon />
            <View
              style={css`
                margin-left: 8px;
              `}>
              <FailText>{_t('be8288ecf2324000a4d6')}</FailText>
              <TouchableWithoutFeedback onPress={gotoViewFollowSetting}>
                <CancelCopyText>{_t('8139ed20063e4000ab81')}</CancelCopyText>
              </TouchableWithoutFeedback>
            </View>
          </RowWrap>
        </FailHeaderCard>
      );
    }

    return null;
  },
);
