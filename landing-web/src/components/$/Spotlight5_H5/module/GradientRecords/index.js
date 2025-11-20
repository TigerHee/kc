/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import GradientCard from '../GradientCard';
import BaseTable from '../BaseTable';
import Empty from './Empty';
import Title from './Title';
import style from './style.less';

export default class GradientRecords extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    // title: PropTypes.any.isRequired,
    empty: PropTypes.any.isRequired,
    records: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
  };

  render() {
    const { title, empty, loading, records, columns, panelStyle, ...otherProps } = this.props;

    const hasRecords = !loading && records.length > 0;
    return (
      <React.Fragment>
        {title ? <Title title={title} /> : null}
        <GradientCard className={`${style.records} ${hasRecords ? style.hasRecord : ''}`} panelStyle={panelStyle}>
          {loading ? (
            <Spin />
          ) : (
            hasRecords ? (
              <BaseTable
                dataSource={records}
                columns={columns}
                baseTableClassName={style.table}
                {...otherProps}
              />
            ) : (
              <Empty empty={empty} />
            )
          )}
        </GradientCard>
      </React.Fragment >
    );
  }
}
