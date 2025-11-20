import { InteractiveElement } from '../types/lark.types';
import { escapeHtml } from './template.utils';

const FileChangeTypeMap = {
  ADDED: {
    symbol: '+',
    color: 'green',
    numberType: 'destination',
  },
  REMOVED: {
    symbol: '-',
    color: 'red',
    numberType: 'source',
  },
};

function bindElementsData(template: InteractiveElement[], values: Record<string, any>): InteractiveElement[] {
  const _template = [];
  template.forEach((element) => {
    if (element._varloop && Array.isArray(element.columns)) {
      const loopKey = element._varloop.replace(/^\$\{(.*?)\}$/, '$1');
      const loopValues = values[loopKey];
      if (Array.isArray(loopValues)) {
        for (const _values of loopValues) {
          const columns = [];
          for (const column of element.columns) {
            const elements = [];
            for (const _elements of column.elements) {
              if (_elements.content) {
                const _content = _elements.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
                  const value = _values[key];
                  return value !== undefined ? value : '';
                });
                elements.push({
                  ..._elements,
                  content: _content,
                });
              } else {
                elements.push(_elements);
              }
            }
            const _column = {
              ...column,
              elements,
            };
            columns.push(_column);
          }
          const e = {
            ...element,
            _varloop: undefined,
            columns,
          };
          _template.push(e);
        }
      } else {
        return _template.push(element);
      }
    } else if (Array.isArray(element.columns)) {
      const e = {
        ...element,
        columns: element.columns.map((column) => {
          return {
            ...column,
            elements: column.elements.map((item) => {
              if (item.content) {
                item.content = item.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
                  const value = values[key];
                  return value !== undefined ? value : '';
                });
              }
              if (item?.text?.content) {
                item.text.content = item.text.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
                  const value = values[key];
                  return value !== undefined ? value : '';
                });
              }
              return item;
            }),
          };
        }),
      };
      _template.push(e);
    } else if (Array.isArray(element.fields)) {
      const e = {
        ...element,
        fields: element.fields.map((field) => {
          if (field?.text?.content) {
            field.text.content = field.text.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
              const value = values[key];
              return value !== undefined ? value : '';
            });
          }
          return field;
        }),
      };
      _template.push(e);
    } else if (Array.isArray(element.actions)) {
      const e = {
        ...element,
        actions: element.actions.map((action) => {
          if (action?.multi_url?.url) {
            return {
              ...action,
              multi_url: {
                ...action.multi_url,
                url: action.multi_url.url.replace(/\$\{([^}]+)\}/g, (_, key) => {
                  const value = values[key];
                  return value !== undefined ? value : '';
                }),
              },
            };
          }
          return action;
        }),
      };
      _template.push(e);
    } else if (element?.text?.content) {
      const _content = element.text.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
        const value = values[key];
        return value !== undefined ? value : '';
      });
      const e = {
        ...element,
        text: {
          ...element.text,
          content: _content,
        },
      };
      _template.push(e);
    } else if (Array.isArray(element?.elements) && element.elements.length > 0) {
      const e = {
        ...element,
        elements: element.elements.map((item) => {
          if (item.content) {
            const _content = item.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
              const value = values[key];
              return value !== undefined ? value : '';
            });
            return {
              ...item,
              content: _content,
            };
          }
          return item;
        }),
      };
      _template.push(e);
    } else if (element.content) {
      element.content = element.content.replace(/\$\{([^}]+)\}/g, (_, key) => {
        const value = values[key];
        return value !== undefined ? value : '';
      });
      _template.push(element);
    } else {
      _template.push(element);
    }
  });

  return _template;
}

const genCodeChangeMarkdown = (data: { line: string }, type: string): string => `
  <font color="${FileChangeTypeMap[type].color}">
  ${data[FileChangeTypeMap[type].numberType]} ${FileChangeTypeMap[type].symbol} ${escapeHtml(data.line)}}
  </font>
`;

export { bindElementsData, genCodeChangeMarkdown };
