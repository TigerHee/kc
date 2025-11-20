/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat, styled, Table } from '@kux/mui';
import { divide } from 'helper';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';

const Wrapper = styled.div`
  width: 100%;
`;

const Items = styled.div`
  margin-bottom: 60px;
  table {
    th {
      padding: 16px 12px;
      background: rgba(225, 232, 245, 0.04);
    }
    td {
      padding: 24px 12px;
      border-bottom: 1px solid rgba(225, 232, 245, 0.04);
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 40px;
    table {
      th {
        padding: 10px 6px;
        font-size: 12px !important;
        line-height: 16px !important;
        background: rgba(225, 232, 245, 0.04);
      }
      td {
        padding: 10px 6px;
        font-size: 12px !important;
        line-height: 16px !important;
      }
    }
  }
`;

const LightText = styled.div`
  color: rgba(225, 232, 245, 0.4);
  word-break: break-word;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;
  color: #e1e8f5;
  margin-bottom: 20px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 20px;
    line-height: 26px;
  }
`;

const TokenReleaseSchedule = () => {
  const { currentLang } = useLocale();
  const { releaseSchedule = [] } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);
  const renderFormattedNumber = useCallback(
    (num, props) => {
      return (
        <NumberFormat lang={currentLang} {...props}>
          {num}
        </NumberFormat>
      );
    },
    [currentLang],
  );
  const columns = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'title',
        key: 'title',
        render: (value) => <LightText>{value}</LightText>,
      },
      {
        title: 'Amount',
        dataIndex: 'number',
        key: 'number',
        render: (value) => renderFormattedNumber(value.replace(/,/g, '')),
      },
      {
        title: 'Share',
        dataIndex: 'percentage',
        key: 'percentage',
        render: (value) => (
          <>{renderFormattedNumber(divide(value || '0', 100), { options: { style: 'percent' } })}</>
        ),
      },
      {
        title: 'Lock-up Schedule',
        dataIndex: 'schedule',
        key: 'schedule',
        render: (value) => <LightText>{value}</LightText>,
      },
    ],
    [],
  );

  return !releaseSchedule?.length ? null : (
    <Wrapper>
      <Title>{_t('4rbchWDJVprnzxfV9kNfoq')}</Title>
      <Items>
        <Table dataSource={releaseSchedule} columns={columns} rowKey="key" />
      </Items>
    </Wrapper>
  );
};

export default memo(TokenReleaseSchedule);
