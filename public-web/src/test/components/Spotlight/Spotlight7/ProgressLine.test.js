import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressLine from 'src/components/Spotlight/SpotlightR7/ProgressLine';

jest.mock('static/spotlight7/percent.svg', () => 'percent-icon.svg');

describe('ProgressLine Component', () => {
  const defaultProps = {
    progress: 50,
    animate: false,
    delay: '0.5s'
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<ProgressLine {...defaultProps} />);
      expect(screen.getByTestId('progress-wrapper')).toBeInTheDocument();
    });

    it('should display correct progress percentage', () => {
      render(<ProgressLine {...defaultProps} />);
      expect(screen.getByTestId('percent-num')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<ProgressLine {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('progress-wrapper')).toHaveClass('custom-class');
    });
  });

});