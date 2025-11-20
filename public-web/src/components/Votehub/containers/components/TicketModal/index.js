/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Input, useSnackbar } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../../../hooks';
import { ContentWrapper, DialogWrapper } from './styledComponents';

// const { FormItem, useForm } = Form;

const TicketModal = () => {
  const ticketModal = useSelector((state) => state.votehub.ticketModal);
  const detailInfo = useSelector((state) => state.votehub.detailInfo, shallowEqual);
  const votesNum = useSelector((state) => state.votehub.votesNum);
  const remainingVotesNum = useSelector((state) => state.votehub.remainingVotesNum);
  const loading = useSelector((state) => state.loading.effects['votehub/postVoteProject']);

  const [num, setNum] = useState();
  const [error, setError] = useState(false);
  const { message } = useSnackbar();

  // const [form] = useForm();
  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const size = useResponsiveSize();

  const { activityId, projectId, id } = detailInfo || {};

  useEffect(() => {
    if (ticketModal) {
      dispatch({
        type: 'votehub/pullRemainingVotes',
        payload: {
          activityDetailId: id,
        },
      });
    }
  }, [dispatch, ticketModal, id]);

  const handleClose = useCallback(() => {
    setNum();
    dispatch({
      type: 'votehub/update',
      payload: {
        ticketModal: false,
        detailInfo: {},
      },
    });
  }, [dispatch]);

  const handleTicket = useCallback(async () => {
    // 判断错误
    if (num > votesNum || num > remainingVotesNum || +num === 0) {
      setError(true);
      return;
    }

    if (activityId && projectId && num) {
      const data = await dispatch({
        type: 'votehub/postVoteProject',
        payload: {
          activityId,
          projectId,
          voteNum: num,
        },
      });

      if (data) {
        message.success(_t('nhAsvVs1VavDv3PTkjj31Z'));
        handleClose();
      }
    }
  }, [dispatch, handleClose, projectId, activityId, num, message, remainingVotesNum, votesNum]);

  const handleFill = useCallback(() => {
    // if (remainingVotesNum > 0) {
    //   setError(false);
    // } else {
    //   setError(true);
    // }
    setError(false);
    setNum((remainingVotesNum > votesNum ? votesNum : remainingVotesNum) || 0);
  }, [remainingVotesNum, votesNum]);

  const handleChange = useCallback((e) => {
    const value = e?.target?.value?.replace(/[^0-9]/g, '');
    // if (+value > votesNum || +value > remainingVotesNum || +value === 0) {
    //   setError(true);
    // } else {
    //   setError(false);
    // }
    // 输入过程中都是绿色
    setError(false);
    setNum(value);
  }, []);

  const tipComp = useMemo(() => {
    if (!error) {
      return (
        <div className="tip">
          {_t('2sJvxm8a44BqyCafzrw1Gk', {
            num: +votesNum ? numberFormat({ lang: currentLang, number: votesNum }) : '0',
          })}
        </div>
      );
    } else if (num < 1) {
      return (
        <div className="tip errorTip">
          {_t('8MaLkvcnhdN63TZdCeVPPs', {
            num: '1',
          })}
        </div>
      );
    } else {
      const _num = remainingVotesNum > votesNum ? votesNum : remainingVotesNum;
      return (
        <div className="tip errorTip">
          {_t('bxcctjz6idATLZqBUkcKDm', {
            num: +_num ? numberFormat({ lang: currentLang, number: _num }) : '0',
          })}
        </div>
      );
    }
  }, [error, num, currentLang, votesNum, remainingVotesNum]);

  return (
    <DialogWrapper
      title={_t('ch4Z9guhKrnzcpXvp1xi4d')}
      open={ticketModal}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={handleTicket}
      okText={_t('submit')}
      cancelText={_t('cancel')}
      centeredFooterButton
      showCloseX={size !== 'sm'}
      okLoading={loading}
    >
      <ContentWrapper>
        <div className="desc">{_t('eiFKHndg1Ma6J8aPLheUku')}</div>

        <Input
          placeholder={_t('bxcctjz6idATLZqBUkcKDm', {
            num: +remainingVotesNum
              ? numberFormat({ lang: currentLang, number: remainingVotesNum })
              : '0',
          })}
          className="currency"
          size="xlarge"
          value={num}
          error={error}
          onChange={handleChange}
          addonAfter={
            <Button variant="text" size="small" onClick={handleFill}>
              {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
            </Button>
          }
        />

        {tipComp}
      </ContentWrapper>
    </DialogWrapper>
  );
};

export default memo(TicketModal);
