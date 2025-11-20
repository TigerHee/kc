import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import withLocale from "src/hocs/withLocale.js";

import { LocaleContext } from "components/App";

afterEach(cleanup);

const DummyComponent = ({ lang }) => <div>{lang.currentLang}</div>;

describe("withLocale HOC", () => {
  it("passes the lang prop to the wrapped component", () => {
    const WrappedComponent = withLocale()(DummyComponent);
    const testLang = { currentLang: "en" };

    const {
      wrapper: { getByText },
    } = renderWithTheme(
      <LocaleContext.Provider value={testLang}>
        <WrappedComponent />
      </LocaleContext.Provider>
    );

    expect(getByText(testLang.currentLang)).toBeInTheDocument();
  });
});
