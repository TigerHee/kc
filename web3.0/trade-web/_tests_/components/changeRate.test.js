import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import ChangeRate from "src/components/common/ChangeRate";

afterEach(cleanup);
test("test ChangeRate", () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <ChangeRate value={1234} />
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("1234");

  rerenderWithTheme(<ChangeRate value={-1235} />);
  expect(container).toHaveTextContent("1235");

  rerenderWithTheme(
    <ChangeRate value={'1234'}  />,
  );
  expect(container).toHaveTextContent('1234');
});
