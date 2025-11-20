/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import Form from './Form';

function withForm(options) {
  return (Comp) => {
    return (props) => {
      return (
        <Form {...options}>
          {(values, form) => {
            return <Comp {...props} values={values} form={form} />;
          }}
        </Form>
      );
    };
  };
}

export default withForm;
