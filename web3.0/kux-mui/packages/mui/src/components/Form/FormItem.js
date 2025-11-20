/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { Field, FieldContext, ListContext } from 'rc-field-form';
import { warning, supportRef } from 'utils';
import styled, { isPropValid } from 'emotion/index';
import { composeClassNames } from 'styles/index';
import clsx from 'clsx';
import useTheme from 'hooks/useTheme';
import { FormItemLabel, FormItemErrorLabel, HelperWrapper, FormItemContainer } from './styledComps';
import Row from '../Row';
import Col from '../Col';
import Fade from '../Fade';
import { getFieldId, toArray, KuFoxFormContext, KuFoxFormNoStyleItemContext } from './aux';

import useFrameState from './formHooks/useFrameState';
import useDebounce from './formHooks/useDebounce';
import useItemRef from './formHooks/useItemRef';
import getFormClassName from './classNames';

const ColorTypeMap = {
  success: 'primary',
  warning: 'complementary',
  error: 'secondary',
  info: 'text60',
};

const StyledRow = styled(Row)`
  flex-direction: ${(props) => (props.layout === 'vertical' ? 'column' : 'row')};
`;

const StyledLabelCol = styled(Col, {
  shouldForwardProp: (props) => isPropValid(props),
})(({ layout }) => {
  return {
    overflow: 'hidden',
    flexDirection: 'column',
    verticalAlign: 'middle',
    display: 'inline-block',
    ...(layout === 'horizontal' && {
      textAlign: 'right',
      whiteSpace: 'nowrap',
      flexGrow: 0,
    }),
    ...(layout === 'vertical' && {
      paddingBottom: '2px',
      whiteSpace: 'initial',
      textAlign: 'left',
      width: '100%',
    }),
  };
});

const StyledCol = styled(Col, {
  shouldForwardProp: (props) => isPropValid(props),
})(({ layout }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    ...(layout === 'horizontal' && {
      flex: '1 1 0',
    }),
    ...(layout === 'vertical' && {
      width: '100%',
    }),
  };
});

function genEmptyMeta() {
  return {
    errors: [],
    warnings: [],
    touched: false,
    validating: false,
    name: [],
  };
}

const NAME_SPLIT = '__SPLIT__';

function hasValidName(name) {
  if (name === null) {
    warning(false, 'Form.Item', '`null` is passed as `name` property');
  }
  return !(name === undefined || name === null);
}

const useClassNames = (state) => {
  const { classNames: classNamesFromProps, error } = state;
  const slots = {
    item: ['item', error && 'itemError'],
    container: ['itemRowContainer'],
    label: ['itemLabel'],
    error: ['itemError'],
    help: ['itemHelp'],
  };

  return composeClassNames(slots, getFormClassName, classNamesFromProps);
};

function FormItem(props) {
  const {
    children,
    label,
    labelCol,
    wrapperCol,
    noStyle,
    help,
    validateTrigger,
    trigger = 'onChange',
    validateStatus = 'info',
    name,
    requiredMark,
    className,
    keepHelpMounted,
  } = props;
  const theme = useTheme();

  const hasName = hasValidName(name);

  const { name: formName, requiredMark: requiredMarkForm } = React.useContext(KuFoxFormContext);

  const mergedRequiredMark = requiredMark || requiredMarkForm;

  const notifyParentMetaChange = React.useContext(KuFoxFormNoStyleItemContext);

  const { validateTrigger: contextValidateTrigger } = React.useContext(FieldContext);

  const mergedValidateTrigger =
    validateTrigger !== undefined ? validateTrigger : contextValidateTrigger;

  const { labelCol: labelColContext, wrapperCol: wrapperColContext, layout } =
    React.useContext(KuFoxFormContext) || {};

  const listContext = React.useContext(ListContext);
  const fieldKeyPathRef = React.useRef();

  const [subFieldErrors, setSubFieldErrors] = useFrameState({});

  const [meta, setMeta] = React.useState(() => genEmptyMeta());

  const onMetaChange = (nextMeta) => {
    const keyInfo = listContext?.getKey(nextMeta.name);

    setMeta(nextMeta.destroy ? genEmptyMeta() : nextMeta, true);

    if (noStyle && notifyParentMetaChange) {
      let namePath = nextMeta.name;

      if (!nextMeta.destroy) {
        if (keyInfo !== undefined) {
          const [fieldKey, restPath] = keyInfo;
          namePath = [fieldKey, ...restPath];
          fieldKeyPathRef.current = namePath;
        }
      } else {
        namePath = fieldKeyPathRef.current || namePath;
      }
      notifyParentMetaChange(nextMeta, namePath);
    }
  };

  const onSubItemMetaChange = (subMeta, uniqueKeys) => {
    // Only `noStyle` sub item will trigger
    setSubFieldErrors((prevSubFieldErrors) => {
      const clone = {
        ...prevSubFieldErrors,
      };

      // name: ['user', 1] + key: [4] = ['user', 4]
      const mergedNamePath = [...subMeta.name.slice(0, -1), ...uniqueKeys];
      const mergedNameKey = mergedNamePath.join(NAME_SPLIT);

      if (subMeta.destroy) {
        // Remove
        delete clone[mergedNameKey];
      } else {
        // Update
        clone[mergedNameKey] = subMeta;
      }

      return clone;
    });
  };

  const [mergedErrors, mergedWarnings] = React.useMemo(() => {
    const errorList = [...meta.errors];
    const warningList = [...meta.warnings];

    Object.values(subFieldErrors).forEach((subFieldError) => {
      errorList.push(...(subFieldError.errors || []));
      warningList.push(...(subFieldError.warnings || []));
    });

    return [errorList, warningList];
  }, [subFieldErrors, meta.errors, meta.warnings]);

  const debounceErrors = useDebounce(mergedErrors);
  const debounceWarnings = useDebounce(mergedWarnings);

  const getItemRef = useItemRef();

  let mergedValidateStatus = '';
  if (validateStatus !== undefined) {
    mergedValidateStatus = validateStatus;
  } else if (meta?.validating) {
    mergedValidateStatus = 'validating';
  } else if (debounceErrors.length) {
    mergedValidateStatus = 'error';
  } else if (debounceWarnings.length) {
    mergedValidateStatus = 'warning';
  } else if (meta?.touched) {
    mergedValidateStatus = 'success';
  }

  const _classNames = useClassNames({ ...props, error: debounceErrors.length > 0 });

  const renderHelpNode = useCallback(
    ({ error }) => {
      const innerError = debounceErrors && debounceErrors?.length ? debounceErrors[0] : help;
      if (!keepHelpMounted && !innerError) {
        return null;
      }
      return (
        <HelperWrapper className={_classNames.help}>
          <Fade direction="up" in={error || help} mountOnEnter unmountOnExit>
            <FormItemErrorLabel
              className={_classNames.error}
              theme={theme}
              type={error ? 'secondary' : ColorTypeMap[mergedValidateStatus]}
            >
              {innerError}
            </FormItemErrorLabel>
          </Fade>
        </HelperWrapper>
      );
    },
    [_classNames, debounceErrors, help, mergedValidateStatus, theme, keepHelpMounted],
  );

  const renderDom = (childNode, fieldId, isRequired) => {
    if (noStyle) {
      return childNode;
    }

    const error = debounceErrors.length > 0;

    const mergedLabelCol = labelCol || labelColContext;

    const mergedWrapperCol = wrapperCol || wrapperColContext;

    return (
      <FormItemContainer className={clsx(_classNames.item, className)}>
        <StyledRow wrap layout={layout} className={_classNames.container}>
          {/* {label ? (
            <StyledLabelCol layout={layout} {...mergedLabelCol}>
              <FormItemLabel
                requiredMark={mergedRequiredMark}
                isRequired={isRequired}
                htmlFor={fieldId}
                className={_classNames.label}
                theme={theme}
              >
                {label}
              </FormItemLabel>
            </StyledLabelCol>
          ) : null} */}
          <StyledCol layout={layout} {...mergedWrapperCol}>
            <KuFoxFormNoStyleItemContext.Provider value={onSubItemMetaChange}>
              {childNode}
            </KuFoxFormNoStyleItemContext.Provider>
            {renderHelpNode({ error })}
          </StyledCol>
        </StyledRow>
      </FormItemContainer>
    );
  };

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
      {(control, renderMeta, context) => {
        const mergedName = toArray(props.name).length && renderMeta ? renderMeta.name : [];
        const fieldId = getFieldId(mergedName, formName);

        const isRequired =
          props.required !== undefined
            ? props.required
            : !!(
                props.rules &&
                props.rules.some((rule) => {
                  if (rule && typeof rule === 'object' && rule.required && !rule.warningOnly) {
                    return true;
                  }
                  if (typeof rule === 'function') {
                    const ruleEntity = rule(context);
                    return ruleEntity && ruleEntity.required && !ruleEntity.warningOnly;
                  }
                  return false;
                })
              );

        const mergedControl = {
          ...control,
        };
        const { errors } = renderMeta;

        const error = errors.length > 0;
        const childProps = { ...children.props, ...mergedControl, error };
        if (!childProps.id) {
          childProps.id = fieldId;
        }

        if (supportRef(children)) {
          childProps.ref = getItemRef(mergedName, children);
        }

        const triggers = new Set([...toArray(trigger), ...toArray(mergedValidateTrigger)]);

        triggers.forEach((eventName) => {
          childProps[eventName] = (...args) => {
            mergedControl[eventName]?.(...args);
            children.props[eventName]?.(...args);
          };
        });

        childProps.label = label;

        const childNode = React.cloneElement(children, childProps);

        return <>{renderDom(childNode, fieldId, isRequired)}</>;
      }}
    </Field>
  );
}

FormItem.defaultProps = {
  requiredMark: true,
  keepHelpMounted: true,
};

export default FormItem;
