/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { separateNumber } from 'helper';
import { _t, _tHTML } from 'src/utils/lang';
import {
  Content,
  Header,
  BodyWrapper,
  ResultItem,
  ResultContent,
  ResultLabel,
  ResultIcon,
  ResultText,
} from './StyledComps';
import PrizePool from './PrizePool';
import Status from './Status';
import { getUtcZeroTime } from '../selector';

import END_RESULT_ANSWER from 'assets/prediction/end-result-answer.svg';
import END_RESULT_USER from 'assets/prediction/end-result-user.svg';
import END_RESULT_NUMBER from 'assets/prediction/end-result-number.svg';
import ARROW_GRAY from 'assets/prediction/arrow-gray.svg';

// 结束卡片
const EndCard = ({ round = {}, onShowTipDialog, onShowWinner }) => {
  const {
    hasResult,
    showUserName,
    createdAt,
    winningNum,
    closePrize,
    closeTimeText,
    bigPrize,
  } = round;
  return (
    <Content className="end">
      <Header className="statusHeader">
        <Status
          time={closeTimeText}
          onTipClick={onShowTipDialog}
          text={hasResult ? _t('prediction.isEnd') : _t('prediction.waiting')}
        />
        <Fragment>
          {hasResult ? (
            <div className="opt" onClick={() => onShowWinner()}>
              <span>{_t('prediction.currentWinner')}</span>
              <img src={ARROW_GRAY} alt="" />
            </div>
          ) : (
            ''
          )}
        </Fragment>
      </Header>
      <BodyWrapper className="endWrapper">
        <PrizePool number={separateNumber(bigPrize.amount || 0)} />
        <ResultItem>
          <ResultIcon className="resultIcon">
            <img src={END_RESULT_NUMBER} alt="ResultIcon1" />
          </ResultIcon>
          <ResultContent>
            <ResultLabel>
              <div className="result-text">{_tHTML('prediction.endPriceUsdt')}</div>
              <div className="result-round">
                {' '}
                <span>{closeTimeText}</span>
              </div>
            </ResultLabel>
            <ResultText>{hasResult ? closePrize : _t('prediction.waiting')}</ResultText>
          </ResultContent>
        </ResultItem>
        <ResultItem>
          <ResultIcon>
            <img src={END_RESULT_USER} alt="ResultIcon2" />
          </ResultIcon>
          <ResultContent>
            <ResultLabel>
              <div className="result-text">{_t('prediction.bigPrizeWinner')}</div>
            </ResultLabel>
            <ResultText>{hasResult ? showUserName : _t('prediction.waiting')}</ResultText>
          </ResultContent>
        </ResultItem>
        <ResultItem>
          <ResultIcon>
            <img src={END_RESULT_ANSWER} alt="ResultIcon3" />
          </ResultIcon>
          <ResultContent>
            <ResultLabel>
              <div className="result-text">{_tHTML('prediction.winnerNum')}</div>
            </ResultLabel>
            <>
              {hasResult ? (
                <ResultText>
                  <div>{winningNum}</div>
                  <div className="gray" style={{ color: '#00142A' }}>
                    {getUtcZeroTime(createdAt, 'HH:mm:ss')}
                  </div>
                </ResultText>
              ) : (
                <ResultText>{_t('prediction.waiting')}</ResultText>
              )}
            </>
          </ResultContent>
        </ResultItem>
      </BodyWrapper>
    </Content>
  );
};

EndCard.propTypes = {
  round: PropTypes.object, // 场次数据
  onShowTipDialog: PropTypes.func.isRequired, // 点击小问号时的回调
  onShowWinner: PropTypes.func.isRequired, // 点击展示获奖名单
};

EndCard.defaultProps = {
  round: {},
  onShowTipDialog: () => {},
  onShowWinner: () => {},
};

export default EndCard;
