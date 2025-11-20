/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Radio } from '@kux/mui';
import CoinSelector from 'components/common/NewCoinSelector/kuxIndex';
import KCRangePicker from 'components/common/NewKCRangePicker';
import { withResponsive } from '@kux/mui';
import clsx from 'clsx';

import { styled } from '@kux/mui/emotion';

const NewFilter = styled.div`
  width: 100%;
  padding: 8px 16px;
  background-color: ${({ theme }) =>
    theme.currentTheme === 'light' ? theme.colors.overlay : theme.colors.cover2};
  border-radius: 2px;
  margin-bottom: 10px;
  tbody tr {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 8px 0;
  }
  .ant-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .ant-calendar-picker {
    width: 92px;
    .ant-calendar-picker-icon {
      display: none;
    }
  }
  .label {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    min-width: 62px;
    max-width: 100px;
    height: 40px;
    padding-right: 16px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 13px;
    line-height: 13px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding-right: 2px;
    }
  }
  .radioButton {
    .KuxRadio-wrapper {
      margin: 0 8px 8px 0;
    }
  }
  .type {
    height: 32px;
  }
  .coinSelector {
    min-width: 350px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      min-width: 252px;
    }
  }
  .miniDivider {
    display: inline-block;
    width: 8px;
    height: 1px;
    margin: 0 4px;
    background: ${({ theme }) => theme.colors.cover4};
  }
  .tag {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px;
    cursor: pointer;
  }
`;

@withResponsive
class Filters extends React.Component {
  onSelectChange = (value) => {
    this.props.onFilterChange({ currency: value });
  };

  onRadioChange = (key, e) => {
    this.props.onFilterChange({ [key]: e.target.value });
  };

  onDateChange = (date) => {
    const [startAt, endAt] = date;
    this.props.onFilterChange({
      startAt,
      endAt,
    });
  };

  render() {
    const { currency, startAt, endAt, type, typeMap, _t, responsive } = this.props;
    return (
      <NewFilter>
        <table>
          <tbody>
            <tr>
              <td className={'label'}>{_t('time')} :</td>
              <td>
                <KCRangePicker
                  value={[startAt, endAt]}
                  onChange={this.onDateChange}
                  classNames={'datepicker'}
                />
              </td>
            </tr>
            <tr>
              <td className={clsx('label', 'type')}>{_t('type')} :</td>
              <td className={'radioButton'}>
                <Radio.Group
                  buttonStyle="solid"
                  value={type || ''}
                  onChange={this.onRadioChange.bind(this, 'type')}
                >
                  <Radio.Button value="">{_t('all')}</Radio.Button>
                  {typeMap.map(({ label, value }) => {
                    return (
                      <Radio.Button value={value} key={value}>
                        {label}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </td>
            </tr>
            <tr>
              <td className={'label'}>{_t('vote.coin-type')} :</td>
              <td>
                <div className={'coinSelector'}>
                  <CoinSelector
                    showAll
                    needAll
                    value={currency}
                    fullWidth={true}
                    handleCoinChange={this.onSelectChange}
                    textOverflow={!responsive.lg && !responsive.md ? 'info' : null}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </NewFilter>
    );
  }
}

export default Filters;
