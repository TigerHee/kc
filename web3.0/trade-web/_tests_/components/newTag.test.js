import React from "react";
import { addLangToPath } from 'utils/lang';
import { cleanup, fireEvent, waitFor, act  } from "@testing-library/react";
import NewTag from "src/components/common/NewTag/index.js";
import { renderWithTheme } from "_tests_/test-setup";
import "@testing-library/jest-dom";

afterEach(cleanup);

describe("NewTag component", () => {
  it("should render with correct values", async () => {
    const {
      wrapper: { container }
    } = renderWithTheme(
      <NewTag />
    );
    expect(container).toHaveTextContent('new');
  });
});