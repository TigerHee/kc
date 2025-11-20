/**
 * Owner: willen@kupotech.com
 */
import { Col, Form, Row, styled } from '@kux/mui';
import useObserver from 'hooks/useResizeObserver';
import { useCallback, useEffect, useRef, useState } from 'react';

const { FormItem, useForm } = Form;

const btnStyle = {
  minWidth: '200px',
  alignSelf: 'flex-start',
  height: '64px',
};

const defaultStyle = {
  large: {
    minWidth: '200px',
  },
  middle: {
    minWidth: '170px',
  },
  small: {
    minWidth: '170px',
    width: '50%',
  },
};

const FilterWrapper = styled.div`
  [dir='rtl'] & {
    .KuxForm-itemRowContainer {
      .KuxCol-col div > div {
        > span {
          right: unset;
          left: 12px;
        }
        > div {
          padding-right: unset;
          padding-left: 26px;
          text-align: left;
        }
      }
    }
  }
`;

const Filters = (props) => {
  const { extra, ExportCsvButton, fields } = props;
  const [screenSize, setScreenSize] = useState('large');

  const measuredRef = useRef(null);
  useObserver({
    elementRef: measuredRef,
    callback: () => {
      const clientWidth = window.innerWidth;
      if (clientWidth <= 1024 && clientWidth > 768) {
        setScreenSize('middle');
      } else if (clientWidth <= 768) {
        setScreenSize('small');
      } else {
        setScreenSize('large');
      }
    },
  });

  return (
    <FilterWrapper ref={measuredRef}>
      <Row gutter={12} align="center">
        {fields.map((item) => {
          const { id, ocx, decoratorConfig = {}, colStyle = defaultStyle[screenSize] } = item;
          return (
            <Col style={colStyle} key={id}>
              <FormItem name={id} {...decoratorConfig}>
                {ocx}
              </FormItem>
            </Col>
          );
        })}
        {extra && (
          <Col key="extra" style={{ ...btnStyle, ...defaultStyle[screenSize] }}>
            {extra}
          </Col>
        )}
        {ExportCsvButton && (
          <Col key="ExportCsvButton" style={{ ...btnStyle, ...defaultStyle[screenSize] }}>
            {ExportCsvButton}
          </Col>
        )}
      </Row>
    </FilterWrapper>
  );
};

const FilterForm = ({ onFilterChange, values, fields, ...otherProps }) => {
  const [form] = useForm();

  const handleValuesChange = useCallback(
    (changedValues, values) => {
      const _changedValues = { ...changedValues };
      if (_changedValues.rangeDate === null) {
        delete _changedValues.rangeDate;
      }
      if (onFilterChange) {
        onFilterChange(_changedValues);
      }
    },
    [onFilterChange],
  );

  useEffect(() => {
    let newVal = {};
    fields.forEach((item) => {
      newVal[item.id] = undefined;
    });
    newVal = { ...newVal, ...values };
    form.setFieldsValue(newVal);
  }, [values, form, fields]);

  return (
    <Form form={form} onValuesChange={handleValuesChange} initialValues={values}>
      <Filters fields={fields} {...otherProps} />
    </Form>
  );
};

export default FilterForm;
