/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, DateTimeFormat, styled } from '@kux/mui';
import { memo, useCallback } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { transformNumberPrecision } from 'TradeActivity/utils';
import Modal from '../../../../ActivityCommon/Modal';
import { POOL_STATUS, REMARK_STATUS_TEXT } from '../../../config';
import NumFormatComp from '../../../containers/ProjectItem/NumFormatComp';
import { Apr } from '../../../containers/ProjectItem/Apr';

const CotentWrapper = styled.div`
  padding: 16px 0 24px;
  div.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0;
    }

    .label {
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
    .value {
      display: flex;
      align-items: center;
      margin-left: 16px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      .unit {
        margin-left: 4px;
      }

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        object-fit: cover;
        border-radius: 24px;
      }
      .notStart {
        color: ${(props) => props.theme.colors.complementary};
      }

      .inProcess {
        color: ${(props) => props.theme.colors.textPrimary};
      }

      .completed {
        color: ${(props) => props.theme.colors.text60};
      }
    }
  }
`;

const ButtonWrapper = styled.div`
  padding: 0;
`;

const PlaceHolderText = styled.div`
  color: ${(props) => props.theme.colors.text40};
`;

const TaskModal = ({ title, ...item }) => {
  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const symbolInfoModal = useSelector((state) => state.gempool.symbolInfoModal);
  const poolInfo = useSelector((state) => state.gempool.poolInfo, shallowEqual);

  const {
    earnTokenName,
    earnTokenAmount,
    stakingTokenLogo,
    stakingToken,
    stakingStartTime,
    stakingEndTime,
    totalStakingParticipants,
    totalStakingAmount,
    maximumDailyRewards,
    status,
    annualPercentageRate,
    presetStatus,
  } = poolInfo || {};

  const handleClose = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        symbolInfoModal: false,
      },
    });
  }, [dispatch]);

  const isEnd = status === POOL_STATUS.COMPLETED;

  return (
    <Modal
      open={symbolInfoModal}
      onClose={handleClose}
      title={_t('6c7d61047a164000a18b', { currency: stakingToken })}
    >
      <CotentWrapper>
        <div className="item">
          <div className="label">{_t('status')}</div>
          <div className="value">
            {!!REMARK_STATUS_TEXT[status] && (
              <div className={`${status} mark`}>{_t(REMARK_STATUS_TEXT[status])}</div>
            )}
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('bbc5676a4f584000a95f', { currency: stakingToken })}</div>
          <div className="value">
            <NumFormatComp value={earnTokenAmount} />
            <span className="unit">{earnTokenName}</span>
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('7588797493a14000a421')}</div>
          <div className="value">
            <img src={stakingTokenLogo} alt="logo" />
            <span className="name">{stakingToken}</span>
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('b69c52fe138c4000aaf7')}</div>
          <div className="value">
            {stakingStartTime ? (
              <DateTimeFormat
                date={stakingStartTime}
                lang={currentLang}
                options={{ year: undefined, timeZone: 'UTC' }}
              >
                {stakingStartTime}
              </DateTimeFormat>
            ) : (
              <PlaceHolderText>--</PlaceHolderText>
            )}

            <span className="unit">(UTC)</span>
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('3af78054c1a14000a273')}</div>
          <div className="value">
            {stakingEndTime ? (
              <DateTimeFormat
                date={stakingEndTime}
                lang={currentLang}
                options={{ year: undefined, timeZone: 'UTC' }}
              >
                {stakingEndTime}
              </DateTimeFormat>
            ) : (
              <PlaceHolderText>--</PlaceHolderText>
            )}

            <span className="unit">(UTC)</span>
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('3e36a412f0134000ad6c', { currency: earnTokenName })}</div>
          <div className="value">
            {status !== POOL_STATUS.NOT_START ? (
              <>
                <NumFormatComp value={maximumDailyRewards} />
                <span className="unit">{earnTokenName}</span>
              </>
            ) : (
              <PlaceHolderText>--</PlaceHolderText>
            )}
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('ef3eb1706ee44000a42c', { currency: stakingToken })}</div>
          <div className="value">
            <NumFormatComp value={transformNumberPrecision(totalStakingAmount)} />
            <span className="unit">{stakingToken}</span>
          </div>
        </div>
        <div className="item">
          <div className="label">{_t('6952d3eb2aaa4000aad5')}</div>
          <div className="value">
            <NumFormatComp value={totalStakingParticipants} />
          </div>
        </div>
        <Apr className='item' apr={annualPercentageRate} isEnd={isEnd} inline={false} presetStatus={presetStatus} />
      </CotentWrapper>
      <ButtonWrapper>
        <Button fullWidth size="large" type="default" onClick={handleClose}>
          {_t('87135cebc25e4000aaab')}
        </Button>
      </ButtonWrapper>
    </Modal>
  );
};

export default memo(TaskModal);
