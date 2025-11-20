/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat, styled, Table } from '@kux/mui';
import { divide } from 'helper';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import chartSvg from 'static/spotlight7/chart.svg';
import { _t } from 'tools/i18n';
import Title from './Title';

const Wrapper = styled.section`
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const Items = styled.div`
  table {
    th {
      padding: 11px 16px !important;
      color: ${(props) => props.theme.colors.text30};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      background-color: ${(props) => props.theme.colors.cover2};
    }
    td {
      padding: 22px 16px !important;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;
      border: none;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    table {
      th {
        padding: 8px 4px !important;
        font-size: 12px;
        background-color: transparent;
        &:first-of-type {
          padding-left: 0 !important;
        }
        &:last-of-type {
          padding-right: 0 !important;
        }
      }
      td {
        padding: 12px 4px !important;
        font-size: 12px;
        &:first-of-type {
          padding-left: 0 !important;
        }
        &:last-of-type {
          padding-right: 0 !important;
        }
      }
    }
  }
`;

const LightText = styled.div`
  color: rgba(225, 232, 245, 0.4);
  word-break: break-word;
`;

const TokenReleaseSchedule = () => {
  const { currentLang } = useLocale();
  const { releaseSchedule = [] } = useSelector(
    (state) => state.spotlight7.detailInfo,
    shallowEqual,
  );
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
        title: _t('7eb3ca83f2ed4000a8d8'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: _t('57011f39d5014000a8aa'),
        dataIndex: 'number',
        key: 'number',
        render: (value) => renderFormattedNumber(value.replace(/,/g, '')),
      },
      {
        title: _t('88fa29600a3a4000a666'),
        dataIndex: 'percentage',
        key: 'percentage',
        render: (value) => (
          <>{renderFormattedNumber(divide(value || '0', 100), { options: { style: 'percent' } })}</>
        ),
      },
      {
        title: _t('57ce072d0aef4000a4ee'),
        dataIndex: 'schedule',
        key: 'schedule',
        align: 'right',
      },
    ],
    [],
  );

  return !releaseSchedule?.length ? null : (
    <Wrapper>
      <Title title={_t('4rbchWDJVprnzxfV9kNfoq')} icon={chartSvg} />
      <Items>
        <Table dataSource={releaseSchedule} columns={columns} rowKey="key" />
      </Items>
    </Wrapper>
  );
};

export default memo(TokenReleaseSchedule);
