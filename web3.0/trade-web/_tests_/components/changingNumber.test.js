import React from "react";
import "@testing-library/jest-dom";
import { cleanup, waitFor } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import ChangingNumber from "src/components/common/ChangingNumber";

afterEach(cleanup);
test("test ChangingNumber", () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <ChangingNumber value={1234} />
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("1234");

  rerenderWithTheme(<ChangingNumber value={1235} compare={100} />);
  waitFor(() => {
    expect(container).toHaveTextContent("1235");
  });

  rerenderWithTheme(<ChangingNumber value={1234} compare={4321} />);
  waitFor(() => {
    expect(container).toHaveTextContent("1234");
  });
});
