/*
 * @Date: 2024-05-29 15:08:51
 * Owner: harry.lai@kupotech.com
 * @LastEditors: Please set LastEditors
 */
import { useSnackbar } from '@kux/mui/hooks';
import loadable from '@loadable/component';
import { useMemoizedFn } from 'ahooks';
import copy from 'copy-to-clipboard';
import { pickBy } from 'lodash-es';
import { useState } from 'react';
import useMainHost from 'routes/SlothubPage/hooks/useMainHost';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import { INVITE_ORIGIN_APPEND_PARAM, SENSORS } from 'src/routes/SlothubPage/constant';
import { updateUrlWithParams } from 'src/utils/formatUrlWithLang';
import arrowImg from 'static/slothub/detail-task-icon-right-arrow.svg';
import { _t } from 'tools/i18n';
import { useStore } from '../../../store';
import { HorizontalCenterWrap, VerticalWrap } from './AtomComponents/styled';
import { ArrowIcon, H5ProcessBar, ProcessData, ProcessDesc, ProcessDescItem } from './styled';
import TaskSubmitButton from './TaskSubmitButton';
const InviteRecordDialog = loadable(() =>
  import('src/routes/SlothubPage/Portal/History/InviteRecordDialog'),
);

const SubmitButton = () => {
  const { message } = useSnackbar();
  const { state } = useStore();
  const mainHost = useMainHost();
  const { invitationCode } = state.projectDetail || {};

  const copyInviteCode = useMemoizedFn(() => {
    const url = updateUrlWithParams(
      `${mainHost}/ucenter/signup?${INVITE_ORIGIN_APPEND_PARAM}`,
      pickBy(
        {
          rcode: invitationCode,
        },
        (value) => !!value,
      ),
    );
    copy(url);

    message.success(_t('spea.share.toast'));
  });

  return (
    <TaskSubmitButton onPreClick={SENSORS.basicInvite} toLink={copyInviteCode}>
      {_t('8f95a3e947624000a677')}
    </TaskSubmitButton>
  );
};

export const InviteTaskProcess = (props) => {
  const { state } = useStore();
  const { projectDetail } = state;
  const { invitationPoints } = projectDetail || {};

  const { isH5 } = useDeviceHelper();
  const [visible, setVisible] = useState(false);
  const [isShowPCGainSignProcess, isShowH5GainSignProcess] = [!isH5, isH5];
  const showInviteHistory = invitationPoints > 0;

  const onOpen = () => {
    if (invitationPoints > 0) {
      SENSORS.inviteDetails();
      setVisible(true);
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <VerticalWrap>
      <HorizontalCenterWrap>
        {isShowPCGainSignProcess && (
          <ProcessDescItem>
            <ProcessData>
              <section
                className={`flex-center ${showInviteHistory && 'pointer'}`}
                onClick={onOpen}
                role="button"
                tabIndex="0"
              >
                <span role="button" tabIndex="0" className="green">
                  <NumberFormat>{invitationPoints || 0}</NumberFormat>
                </span>
                {showInviteHistory && (
                  <ArrowIcon
                    className="horizontal-flip-in-arabic"
                    src={arrowImg}
                    alt="arrow-icon"
                  />
                )}
              </section>
            </ProcessData>
            <ProcessDesc>{_t('4aabd394e7c44000af61')}</ProcessDesc>
          </ProcessDescItem>
        )}

        {!isH5 && <SubmitButton />}
      </HorizontalCenterWrap>

      {isShowH5GainSignProcess && (
        <H5ProcessBar>
          <ProcessDesc>
            {_t('4aabd394e7c44000af61')}
            <section className="flex-center pointer" onClick={onOpen} role="button" tabIndex="0">
              <span className="green">
                <NumberFormat>{invitationPoints || 0}</NumberFormat>
              </span>
              {showInviteHistory && <ArrowIcon src={arrowImg} alt="arrow-icon" />}
            </section>
          </ProcessDesc>
          <SubmitButton />
        </H5ProcessBar>
      )}

      <InviteRecordDialog visible={visible} onClose={onClose} />
    </VerticalWrap>
  );
};
