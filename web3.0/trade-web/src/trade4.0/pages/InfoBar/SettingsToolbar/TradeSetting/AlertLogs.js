/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useSelector } from 'dva';
import React, { memo, Fragment } from 'react';
import Empty from '@mui/Empty';
import { LogItem, LogItemTime, LogItemTitle } from './style';
import { showDatetime } from 'helper';

/**
 * AlertLogs
 * 监控日志
 */
const AlertLogs = (props) => {
  const { ...restProps } = props;
  const logs = useSelector((state) => state.priceWarn.logs);

  return (
    <Fragment>
      {logs?.length ? (
        logs.map(({ content, sendTime }, i) => (
          <LogItem key={i}>
            <LogItemTitle>{content}</LogItemTitle>
            <LogItemTime>
              {showDatetime(sendTime, 'YYYY/MM/DD HH:mm')}
            </LogItemTime>
          </LogItem>
        ))
      ) : (
        <Empty />
      )}
    </Fragment>
  );
};

export default memo(AlertLogs);
