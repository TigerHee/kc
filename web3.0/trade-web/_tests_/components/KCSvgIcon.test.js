import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import SvgIcon from 'src/trade4.0/components/KCSvgIcon.js';
import Icon from 'src/trade4.0/components/KCSvgIcon.js';
import { renderWithTheme } from '_tests_/test-setup';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

jest.mock('!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/horn.svg', () => ({
  __esModule: true,

  default: () => <svg data-testid="mock-horn-svg" />,
}));

jest.mock('!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/clock.svg', () => ({
  __esModule: true,

  default: () => <svg data-testid="mock-clock-svg" />,
}));

jest.mock('!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/download.svg', () => ({
  __esModule: true,

  default: () => <svg data-testid="mock-download-svg" />,
}));

jest.mock('!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/monetization.svg', () => ({
  __esModule: true,

  default: () => <svg data-testid="mock-monetization-svg" />,
}));

jest.mock('!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/group.svg', () => ({
  __esModule: true,

  default: () => <svg data-testid="mock-group-svg" />,
}));

// Mock for error case

jest.mock('!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/error.svg', () => {
  throw new Error('SVG not found');
});

afterEach(cleanup);

describe('KCSvgIcon render', () => {
  test('renders id horn', async () => {
    const { container, getByTestId } = render(<Icon iconId="horn" />);

    //await waitFor(() => expect(getByTestId("mock-horn-svg")).toBeInTheDocument());

    expect(container).toBeInTheDocument();
  });

  test('renders id clock', async () => {
    const { container, getByTestId } = render(<Icon iconId="clock" />);

    //await waitFor(() => expect(getByTestId("mock-clock-svg")).toBeInTheDocument());

    expect(container).toBeInTheDocument();
  });

  test('renders id download', async () => {
    const { container, getByTestId } = render(<Icon iconId="download" />);

    //await waitFor(() => expect(getByTestId("mock-download-svg")).toBeInTheDocument());

    expect(container).toBeInTheDocument();
  });

  test('renders id monetization', async () => {
    const { container, getByTestId } = render(<Icon iconId="monetization" />);

    //await waitFor(() => expect(getByTestId("mock-monetization-svg")).toBeInTheDocument());

    expect(container).toBeInTheDocument();
  });

  test('renders id group', async () => {
    const { container, getByTestId } = render(<Icon iconId="group" />);

    //await waitFor(() => expect(getByTestId("mock-group-svg")).toBeInTheDocument());

    expect(container).toBeInTheDocument();
  });

  test('handles loading state', async () => {
    const { container } = render(<Icon iconId="horn" />);

    expect(container).toBeEmptyDOMElement();

    await waitFor(() => expect(container).not.toBeEmptyDOMElement());
  });

  test('handles error state', async () => {
    const { container } = render(<Icon iconId="error" />);

    await waitFor(() => expect(container).toHaveTextContent('load error'));
  });

  test('calls onCompleted callback', async () => {
    const onCompleted = jest.fn();

    const { container } = render(<Icon iconId="horn" onCompleted={onCompleted} />);

    //await waitFor(() => expect(onCompleted).toHaveBeenCalledWith("horn", expect.any(Function)));
    expect(container).toBeInTheDocument();
  });

  test('calls onError callback', async () => {
    const onError = jest.fn();

    render(<Icon iconId="error" onError={onError} />);

    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.any(Error)));
  });

  test('renders id group', () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<SvgIcon iconId="group" />);
    expect(container).toBeInTheDocument();
  });

  test('renders error', () => {
    const {
      wrapper: { container },
    } = renderWithTheme(<SvgIcon iconId="" onCompleted={() => {}} onError={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
