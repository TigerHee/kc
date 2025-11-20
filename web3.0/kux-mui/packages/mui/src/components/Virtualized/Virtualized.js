/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import AutoSizer from './AutoSizer';
import VariableSizeList from './VariableSizeList';
import VariableSizeGrid from './VariableSizeGrid';
import FixedSizeList from './FixedSizeList';
import FixedSizeGrid from './FixedSizeGrid';

class Virtualized extends React.Component {
  static AutoSizer = AutoSizer;

  static VariableSizeList = VariableSizeList;

  static VariableSizeGrid = VariableSizeGrid;

  static FixedSizeList = FixedSizeList;

  static FixedSizeGrid = FixedSizeGrid;

  render() {
    return null;
  }
}

export default Virtualized;
