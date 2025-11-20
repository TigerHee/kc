import React from "react";
import "@testing-library/jest-dom";
import { renderWithTheme } from "_tests_/test-setup";

import { screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputWithToolTip from "src/components/NewInputWithTooltip";

afterEach(cleanup);

describe("InputWithToolTip", () => {
  it("should render children", () => {
    const form = {
      getFieldError: jest.fn(),
    };
    renderWithTheme(
      <InputWithToolTip
        value="test"
        onChange={() => {}}
        form={form}
        formItemName="test"
      >
        <input />
      </InputWithToolTip>
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should render tooltip if there is error", () => {
    const form = {
      getFieldError: jest.fn().mockReturnValueOnce(["error message"]),
    };
    renderWithTheme(
      <InputWithToolTip
        value="test"
        onChange={() => {}}
        form={form}
        formItemName="test"
      >
        <input />
      </InputWithToolTip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("error message");
  });

  it("should not render tooltip if there is no error", () => {
    const form = {
      getFieldError: jest.fn().mockReturnValueOnce([]),
    };
    renderWithTheme(
      <InputWithToolTip
        value="test"
        onChange={() => {}}
        form={form}
        formItemName="test"
      >
        <input />
      </InputWithToolTip>
    );
    const tooltip = screen.queryByRole("tooltip");
    expect(tooltip).toHaveTextContent('');
  });

  it("should pass value and onChange to the children element", () => {
    const handleChange = jest.fn();
    const form = {
      getFieldError: jest.fn(),
    };
    renderWithTheme(
      <InputWithToolTip
        value="test"
        onChange={handleChange}
        form={form}
        formItemName="test"
      >
        <input />
      </InputWithToolTip>
    );
    const input = screen.getByRole("textbox");
    userEvent.type(input, "test value");
    expect(handleChange).toHaveBeenCalledTimes(0);
  });
});
