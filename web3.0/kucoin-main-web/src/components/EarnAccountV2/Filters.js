/**
 * Owner: pike@kupotech.com
 */
import React, { useImperativeHandle, forwardRef } from 'react';
import { Row, Col, Form, Box } from '@kux/mui';
import { useResponsive } from '@kux/mui/hooks';
import { useLocale } from '@kucoin-base/i18n';

const { FormItem } = Form;

const Filters = forwardRef((props, ref) => {
  const { isRTL } = useLocale();
  const [form] = Form.useForm();
  const { extra, ExportCsvButton, fields, values } = props;
  const responsive = useResponsive();

  const fieldsData = [];
  Object.keys(values).forEach((key) => {
    fieldsData.push({
      name: [key],
      value: values[key],
    });
  });
  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      return form.getFieldsValue();
    },
  }));
  return (
    <Form
      fields={fieldsData}
      form={form}
      onValuesChange={(..._props) => {
        if (props.onFilterChange) {
          props.onFilterChange(..._props);
        }
      }}
    >
      <Row justify={responsive.sm ? 'start' : 'space-between'}>
        {fields.map((item, index) => {
          const { id, ocx, decoratorConfig = {}, colStyle = { minWidth: '200px' } } = item;
          const even = index % 2 === 0;
          const marginRight = responsive.sm ? '12px' : even ? '12px' : 0;
          const boxStyle = isRTL
            ? { margin: `0 0 12px ${marginRight}`, color: 'red' }
            : { margin: `0 ${marginRight} 12px 0` };
          return (
            <Box
              width={{ xs: 'calc((100% - 12px) / 2)', sm: 160 }}
              key={id}
              style={{ lineHeight: 0, ...boxStyle }}
            >
              <FormItem noStyle name={id} {...decoratorConfig}>
                {ocx}
              </FormItem>
            </Box>
          );
        })}
        {extra && (
          <Col flex="auto" key="extra">
            {extra}
          </Col>
        )}
        {ExportCsvButton && (
          <Box width={{ xs: 'calc((100% - 12px) / 2)', sm: 'auto' }} key="ExportCsvButton">
            {ExportCsvButton}
          </Box>
        )}
      </Row>
    </Form>
  );
});

export default Filters;
