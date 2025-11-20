/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Field, FieldContext, ListContext } from 'rc-field-form';
import { clx } from '@/common/style';
import { IFormItemProps } from '../types';
import { FormContext, FormNoStyleItemContext } from '../context/form-context';
import { getFieldId } from '../utils/field-id';
import { toArray } from '../utils/array-utils';
import useFrameState from '../hooks/use-frame-state';
import useDebounce from '../hooks/use-debounce';
import useItemRef from '../hooks/use-item-ref';

function genEmptyMeta() {
  return {
    errors: [] as string[],
    warnings: [] as string[],
    touched: false,
    validating: false,
    name: [] as string[],
  };
}

const NAME_SPLIT = '__SPLIT__';

function hasValidName(name: string | string[] | undefined): boolean {
  if (name === null) {
    console.warn('Form.Item', '`null` is passed as `name` property');
  }
  return !(name === undefined || name === null);
}

export const FormItem: React.FC<IFormItemProps> = (props) => {
  const {
    children,
    label,
    wrapperCol,
    noStyle,
    help,
    validateTrigger,
    trigger = 'onChange',
    name,
    className,
    keepHelpMounted = true,
    layout = 'vertical',
  } = props;

  const hasName = hasValidName(name);
  const { name: formName } = useContext(FormContext);
  const notifyParentMetaChange = useContext(FormNoStyleItemContext);
  const { validateTrigger: contextValidateTrigger } = useContext(FieldContext);
  const mergedValidateTrigger = validateTrigger !== undefined ? validateTrigger : contextValidateTrigger;
  const { wrapperCol: wrapperColContext, layout: contextLayout } = useContext(FormContext) || {};
  const listContext = useContext(ListContext);
  const fieldKeyPathRef = React.useRef<string[]>();

  const [subFieldErrors, setSubFieldErrors] = useFrameState<Record<string, any>>({});
  const [meta, setMeta] = useState(() => genEmptyMeta());

  const onMetaChange = useCallback((nextMeta: any) => {
    const keyInfo = listContext?.getKey(nextMeta.name);

    setMeta(nextMeta.destroy ? genEmptyMeta() : nextMeta);

    if (noStyle && notifyParentMetaChange?.notifyParentMetaChange) {
      let namePath = nextMeta.name;

      if (!nextMeta.destroy) {
        if (keyInfo !== undefined) {
          const [fieldKey, ...restPath] = keyInfo;
          namePath = [fieldKey, ...restPath];
          fieldKeyPathRef.current = namePath;
        }
      } else {
        namePath = fieldKeyPathRef.current || namePath;
      }
      notifyParentMetaChange.notifyParentMetaChange(nextMeta, namePath);
    }
  }, [noStyle, notifyParentMetaChange, listContext]);

  const onSubItemMetaChange = useCallback((subMeta: any, uniqueKeys: string[]) => {
    setSubFieldErrors((prevSubFieldErrors) => {
      const clone = { ...prevSubFieldErrors };
      const mergedNamePath = [...subMeta.name.slice(0, -1), ...uniqueKeys];
      const mergedNameKey = mergedNamePath.join(NAME_SPLIT);

      if (subMeta.destroy) {
        delete clone[mergedNameKey];
      } else {
        clone[mergedNameKey] = subMeta;
      }

      return clone;
    });
  }, []);

  const mergedErrors = useMemo(() => {
    const errorList = [...meta.errors];

    Object.values(subFieldErrors).forEach((subFieldError) => {
      if (subFieldError.errors && Array.isArray(subFieldError.errors)) {
        errorList.push(...(subFieldError.errors as string[]));
      }
    });

    return errorList;
  }, [subFieldErrors, meta.errors]);

  const debounceErrors = useDebounce(mergedErrors);
  const getItemRef = useItemRef();

  const itemClassName = clx(
    'kux-form__item',
    {
      'kux-form__item--error': debounceErrors.length > 0,
    },
    className
  );

  const containerClassName = clx(
    'kux-form__item-container',
    `kux-form__item-container--${layout || contextLayout || 'vertical'}`
  );

  const colClassName = clx(
    'kux-form__col',
    `kux-form__col--${layout || contextLayout || 'vertical'}`
  );

  const renderHelpNode = useCallback(
    ({ error }: { error: boolean }) => {
      const innerError = debounceErrors && debounceErrors?.length ? debounceErrors[0] : help;
      if (!keepHelpMounted && !innerError) {
        return null;
      }
      return (
        <div className="kux-form__helper-wrapper">
          <div className={clx('kux-form__error', { 'kux-form__error--visible': !!(error || help) })}>
            {debounceErrors && debounceErrors?.length ? debounceErrors[0] : help}
          </div>
        </div>
      );
    },
    [debounceErrors, help, keepHelpMounted]
  );

  const renderDom = useCallback((childNode: React.ReactElement) => {
    if (noStyle) {
      return childNode;
    }

    const error = debounceErrors.length > 0;
    const mergedWrapperCol = wrapperCol || wrapperColContext;

    return (
      <div className={itemClassName}>
        <div className={containerClassName}>
          <div className={colClassName} {...mergedWrapperCol}>
            <FormNoStyleItemContext.Provider value={{ notifyParentMetaChange: onSubItemMetaChange }}>
              {childNode}
            </FormNoStyleItemContext.Provider>
            {renderHelpNode({ error })}
          </div>
        </div>
      </div>
    );
  }, [
    noStyle,
    debounceErrors.length,
    wrapperCol,
    wrapperColContext,
    itemClassName,
    containerClassName,
    colClassName,
    onSubItemMetaChange,
    renderHelpNode
  ]);

  if (!hasName) {
    return renderDom(children);
  }

  return (
    <Field
      {...props}
      trigger={trigger}
      validateTrigger={mergedValidateTrigger}
      onMetaChange={onMetaChange}
    >
      {(control, renderMeta) => {
        const mergedName = toArray(props.name).length && renderMeta ? renderMeta.name : [];
        const namePath = Array.isArray(mergedName) ? mergedName.map(String) : [];
        const fieldId = getFieldId(namePath, formName) || '';

        const mergedControl = { ...control };
        const { errors } = renderMeta;
        const error = errors.length > 0;
        const childProps: any = { ...children.props, ...mergedControl, error };
        
        if (!childProps.id) {
          childProps.id = fieldId || undefined;
        }

        if ((children as any).ref) {
          childProps.ref = getItemRef(namePath, children);
        }

        const triggers = new Set([...toArray(trigger), ...toArray(mergedValidateTrigger)]);

        triggers.forEach((eventName) => {
          childProps[eventName] = (...args: any[]) => {
            mergedControl[eventName]?.(...args);
            (children.props as any)[eventName]?.(...args);
          };
        });

        childProps.label = label;

        const childNode = React.cloneElement(children, childProps);

        return <>{renderDom(childNode)}</>;
      }}
    </Field>
  );
};

FormItem.displayName = 'FormItem'; 