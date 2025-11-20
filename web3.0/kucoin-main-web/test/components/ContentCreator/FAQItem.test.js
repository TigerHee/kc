/**
 * Owner: lori@kupotech.com
 */
import React from 'react';
import FAQItem from 'src/components/ContentCreator/FAQItem';
import { customRender } from 'test/setup';
import { fireEvent, screen } from '@testing-library/react';

describe('test components/ContentCreator/FAQItem', () => {
  const question = 'Sample question';
  const answer = 'Sample answer';
  const theme = {
    breakpoints: {
      down: () => {},
    },
  };

  test('renders question and arrow icon', () => {
    const { rerender } = customRender(<FAQItem />);
    rerender(<FAQItem question={question} answer={answer} theme={theme} />);
    expect(screen.getByText(question)).toBeInTheDocument();
    expect(screen.getByAltText('arrow-icon')).toBeInTheDocument();
  });

  test('toggles answer visibility and arrow rotation on click', () => {
    const { rerender } = customRender(<FAQItem />);
    rerender(<FAQItem question={question} answer={answer} theme={theme} />);
    const arrowIcon = screen.getByAltText('arrow-icon');
    const questionElement = screen.getByText(question);
    expect(screen.queryByText(answer)).not.toBeInTheDocument();
    expect(arrowIcon.style.transform).toBe('rotate(0deg)');
    fireEvent.click(questionElement);
    expect(screen.getByText(answer)).toBeInTheDocument();
    expect(arrowIcon.style.transform).toBe('rotate(-180deg)');
    fireEvent.click(questionElement);
    expect(screen.queryByText(answer)).not.toBeInTheDocument();
    expect(arrowIcon.style.transform).toBe('rotate(0deg)');
  });

  test('opens PDF link in a new window when answer link is clicked', () => {
    const { rerender } = customRender(<FAQItem />);
    rerender(<FAQItem question={question} answer={<a href="#">{answer}</a>} theme={theme} />);
    fireEvent.click(screen.getByText(question));
    const answerLink = screen.getByText(answer);
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => ({ opener: null }));
    fireEvent.click(answerLink);
    windowOpenSpy.mockRestore();
  });
});
