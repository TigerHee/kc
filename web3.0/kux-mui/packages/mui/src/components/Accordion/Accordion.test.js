import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Accordion from './Accordion';
import AccordionPanel from './AccordionPanel';

describe('Accordion and AccordionPanel', () => {
  let mockOnChange;
  const { render } = createRender();

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  it('should render Accordion correctly', () => {
    const { container } = render(
      <Accordion onChange={mockOnChange}>
        <AccordionPanel panelKey="1">
          <div>Panel Content</div>
        </AccordionPanel>
      </Accordion>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle onChange correctly in Accordion', () => {
    const { getByText } = render(
      <Accordion onChange={mockOnChange}>
        <AccordionPanel header="Panel Content Header">
          <div>Panel Content</div>
        </AccordionPanel>
      </Accordion>,
    );
    fireEvent.click(getByText('Panel Content Header'));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should handle activeKey correctly in Accordion', () => {
    const { getByText } = render(
      <Accordion onChange={mockOnChange} activeKey="0">
        <AccordionPanel header="Panel Content Header1">
          <div>Panel Content1</div>
        </AccordionPanel>
      </Accordion>,
    );
    expect(getByText('Panel Content Header1')).toHaveClass('KuxAccordion-active');
  });

  it('should handle defaultActiveKey correctly in Accordion', () => {
    const { getByText } = render(
      <Accordion onChange={mockOnChange} defaultActiveKey="1">
        <AccordionPanel header="Panel Content Header1">
          <div>Panel Content1</div>
        </AccordionPanel>
        <AccordionPanel header="Panel Content Header2">
          <div>Panel Content2</div>
        </AccordionPanel>
      </Accordion>,
    );
    expect(getByText('Panel Content Header2')).toHaveClass('KuxAccordion-active');
  });
});
