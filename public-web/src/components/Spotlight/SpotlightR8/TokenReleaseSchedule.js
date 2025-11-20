/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat, styled, Table } from '@kux/mui';
import { divide } from 'helper';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import chartSvg from 'static/spotlight8/chart.svg';
import chartLightSvg from 'static/spotlight8/chartLight.svg';
import { _t } from 'tools/i18n';
import Title from './Title';

const Wrapper = styled.section`
  width: 100%;
  overflow: hidden;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const Items = styled.div`
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.divider4};
  table {
    tbody tr:last-of-type td {
      border-bottom: none;
      &:first-of-type {
        border-radius: 0 0 0 12px;
      }
      &:last-of-type {
        border-right: none;
        border-radius: 0 0 12px 0;
      }
    }

    tbody tr:nth-of-type(2n) td {
      background: ${(props) => props.theme.colors.cover2} !important;
    }

    th {
      padding: 11px 23px !important;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
      background-color: ${(props) => props.theme.colors.cover2};
      border-right: 1px solid ${(props) => props.theme.colors.divider4};

      &:first-of-type {
        border-radius: 12px 0 0 0;
      }
      &:last-of-type {
        border-right: none;
        border-radius: 0 12px 0 0;
      }
    }
    td {
      height: 56px;
      padding: 11px 23px !important;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;
      background: transparent !important;
      border-right: 1px solid ${(props) => props.theme.colors.divider4};
      &:last-of-type {
        border-right: none;
      }
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: calc(100% + 32px);
    margin-left: -16px;
    table {
      th {
        padding: 11px 7px !important;
        font-size: 12px;
        &:first-of-type {
          padding-left: 16px !important;
        }
        &:last-of-type {
          padding-right: 16px !important;
        }
      }
      td {
        padding: 7px !important;
        font-size: 12px;
        &:first-of-type {
          padding-left: 16px !important;
        }
        &:last-of-type {
          padding-right: 16px !important;
        }
      }
    }
  }
`;

const TokenReleaseSchedule = () => {
  const { currentLang } = useLocale();
  const { releaseSchedule = [] } = useSelector(
    (state) => state.spotlight8.detailInfo,
    shallowEqual,
  );
  const currentTheme = useSelector((state) => state.setting.currentTheme);

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
      },
    ],
    [renderFormattedNumber],
  );

  return !releaseSchedule?.length ? null : (
    <Wrapper>
      <Title
        title={_t('4rbchWDJVprnzxfV9kNfoq')}
        icon={currentTheme === 'dark' ? chartSvg : chartLightSvg}
      />
      <Items>
        <Table dataSource={releaseSchedule} columns={columns} rowKey="title" bordered />
      </Items>
    </Wrapper>
  );
};

export default memo(TokenReleaseSchedule);
