/**
 * Owner: willen@kupotech.com
 */
/**
 * Record
 * runtime: browser
 */
import React from 'react';
import { connect } from 'react-redux';

export default ({ namespaceDict }) =>
  (WrappedComponent) => {
    const findNamespace = (key) => {
      const _namespace = namespaceDict[key];
      if (typeof _namespace === 'string') {
        return _namespace;
      }
      return _namespace.value;
    };

    @connect((state) => {
      const _mapProps = {};
      Object.keys(namespaceDict).forEach((key) => {
        const namespace = findNamespace(key);
        _mapProps[key] = state[namespace];
      });
      return _mapProps;
    })
    class Record extends React.PureComponent {
      queryRecords = (key) => {
        const { dispatch } = this.props;
        const namespace = findNamespace(key);
        const namespaceObj = namespaceDict[key];
        if (namespaceObj.polling) {
          dispatch({
            type: `${namespace}/query@polling:cancel`,
          });
        }
        return dispatch({
          type: namespaceObj.polling ? `${namespace}/query@polling` : `${namespace}/query`,
        });
      };

      updateFilters = (filters, key) => {
        const { dispatch } = this.props;
        const namespace = findNamespace(key);
        dispatch({
          type: `${namespace}/updateFilters`,
          payload: {
            ...filters,
          },
        });
      };

      handleFilterChange = (changedValue, key) => {
        const { dispatch } = this.props;
        const namespace = findNamespace(key);
        const namespaceObj = namespaceDict[key];
        dispatch({
          type: `${namespace}/filter`,
          effect: namespaceObj.polling ? `${namespace}/query@polling:restart` : 'query',
          payload: {
            ...changedValue,
          },
        });
      };

      cancelPolling = (key) => {
        const { dispatch } = this.props;
        const namespace = findNamespace(key);
        const namespaceObj = namespaceDict[key];
        if (namespaceObj.polling) {
          dispatch({
            type: `${namespace}/query@polling:cancel`,
          });
        }
      };

      render() {
        return (
          <WrappedComponent
            onFilterChange={this.handleFilterChange}
            queryRecords={this.queryRecords}
            cancelPolling={this.cancelPolling}
            updateFilters={this.updateFilters}
            {...this.props}
          />
        );
      }
    }

    return Record;
  };
