import React from 'react';
import {Text} from 'react-native';
import {fireEvent} from '@testing-library/react-native';

import Collapse from 'components/Common/Collapse';
import {customRender as render} from '../../setup';

describe('Collapse', () => {
  it('renders label and children', () => {
    const {getByText} = render(
      <Collapse label="Title">
        <Text>Content</Text>
      </Collapse>,
    );
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Content')).toBeTruthy();
  });

  it('toggles collapsed state on press', () => {
    const {getByText} = render(
      <Collapse label="Title">
        <Text>Content</Text>
      </Collapse>,
    );
    fireEvent.press(getByText('Title'));
    expect(getByText('Content')).toBeTruthy();
  });

  it('calls onCollapsedChange', () => {
    const onCollapsedChange = jest.fn();
    const {getByText} = render(
      <Collapse label="Title" onCollapsedChange={onCollapsedChange}>
        <Text>Content</Text>
      </Collapse>,
    );
    fireEvent.press(getByText('Title'));
    expect(onCollapsedChange).toHaveBeenCalled();
  });
});
