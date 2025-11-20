import React from 'react';
import {Text} from 'react-native';

import Form from 'components/Common/Form';
import {customRender as render} from '../../setup';

describe('Form', () => {
  it('renders children', () => {
    const {getByText} = render(
      <Form>
        <Text>Child</Text>
      </Form>,
    );
    expect(getByText('Child')).toBeTruthy();
  });

  it('applies style prop', () => {
    const style = {backgroundColor: 'red'};
    render(
      <Form style={style}>
        <Text>Styled</Text>
      </Form>,
    );
  });

  it('passes formMethods to FormProvider', () => {
    const formMethods = {test: 'test'};
    render(
      <Form formMethods={formMethods}>
        <Text>FormProvider</Text>
      </Form>,
    );
  });
});
