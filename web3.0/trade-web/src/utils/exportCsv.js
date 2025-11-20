/**
 * Owner: borden@kupotech.com
 */
/* eslint-disable */

import renderText from './getTextFromComponent';

const noop = v => v;
const newLine = '\r\n';
const appendLine = (content, row, { separator, quoted }) => {
  const line = row.map((data) => {
    if (!quoted) return data;
    data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
    return `"${data}"`;
  });
  content.push(line.join(separator));
};

const defaults = {
  separator: ',',
  quoted: false,
};

const has = (browser) => {
  const ua = navigator.userAgent;
  if (browser === 'ie') {
    const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(ua);
      return parseFloat(RegExp.$1);
    } else {
      return false;
    }
  } else {
    return ua.indexOf(browser) > -1;
  }
};
const isEdge = () => {
  return /Edge/.test(navigator.userAgent);
};

const isIE11 = () => {
  let iev = 0;
  const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
  const trident = !!navigator.userAgent.match(/Trident\/7.0/);
  const rv = navigator.userAgent.indexOf('rv:11.0');
  if (ieold) {
    iev = Number(RegExp.$1);
  }
  if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
    iev = 10;
  }
  if (trident && rv !== -1) {
    iev = 11;
  }
  return iev === 11;
};

const getDownloadUrl = (text) => {
  const BOM = '\uFEFF';
  if (window.Blob && window.URL && window.URL.createObjectURL) {
    const csvData = new Blob([BOM + text], { type: 'text/csv' });
    return URL.createObjectURL(csvData);
  } else {
    return `data:attachment/csv;charset=utf-8,${BOM + encodeURIComponent(text)}`;
  }
};
const download = (filename, text) => {
  if (has('ie') && has('ie') < 10) {
    const oWin = window.top.open('about:blank', '_blank');
    oWin.document.charset = 'utf-8';
    oWin.document.write(text);
    oWin.document.close();
    oWin.document.execCommand('SaveAs', filename);
    oWin.close();
  } else if (has('ie') === 10 || isIE11() || isEdge()) {
    const BOM = '\uFEFF';
    const csvData = new Blob([BOM + text], { type: 'text/csv' });
    navigator.msSaveBlob(csvData, filename);
  } else {
    const link = document.createElement('a');
    link.download = filename;
    link.href = getDownloadUrl(text);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
const CreteCsvData = async (columns, dataSource, options, noHeader = false) => {
  options = Object.assign({}, defaults, options);
  let columnOrder;
  const content = [];
  const column = [];
  const columnMap = {};
  if (columns) {
    columnOrder = columns.map((v) => {
      if (typeof v === 'string') return v;
      if (!noHeader) {
        column.push(typeof v.title !== 'undefined' ? v.title : v.dataIndex);
      }
      columnMap[v.dataIndex] = v.render ? v.render : noop;
      return v.dataIndex;
    });
    if (column.length > 0) {
      appendLine(content, column, options);
    }
  } else {
    columnOrder = [];
    dataSource.forEach((v) => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });
    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
      if (!noHeader) appendLine(content, columnOrder, options);
    }
  }
  if (Array.isArray(dataSource)) {
    const leng = dataSource.length;
    for (let i = 0; i < leng; i++) {
      const row = dataSource[i];
      const newRow = [];
      for (const k in columnMap) {
        if (columnMap.hasOwnProperty.call(columnMap, k)) {
          const value = row[k];
          const renderFn = columnMap[k];
          const renderValue = renderFn(value);
          const finalValue = await renderText(renderValue);
          newRow.push(String(finalValue));
        }
      }
      appendLine(content, newRow, options);
    }
  }
  return content.join(newLine);
};

const exportCsv = async (params) => {
  if (params.fileName) {
    if (params.fileName.indexOf('.csv') === -1) {
      params.fileName += '.csv';
    }
  } else {
    params.fileName = 'table.csv';
  }
  const { columns = [], dataSource = [], noHeader = false } = params;
  const data = await CreteCsvData(columns, dataSource, params, noHeader);
  if (params.callback) {
    params.callback(data);
  } else {
    download(params.fileName, data);
  }
};

export default exportCsv;
