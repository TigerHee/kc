import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";

import SafeLink from "src/components/SafeLink";

afterEach(cleanup);
describe("SafeLink", () => {
  it("should render with href and children", () => {
    const {
      wrapper: { getByRole },
    } = renderWithTheme(<SafeLink href="/example">Example</SafeLink>);
    const linkElement = getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/example");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkElement).toHaveTextContent("Example");
  });

  it("should have _self target if isSelf is true", () => {
    const {
      wrapper: { getByRole },
    } = renderWithTheme(
      <SafeLink href="/example" isSelf>
        Example
      </SafeLink>
    );
    const linkElement = getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/example");
    expect(linkElement).toHaveAttribute("target", "_self");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkElement).toHaveTextContent("Example");
  });

  it("should add className to the link", () => {
    const {
      wrapper: { getByRole },
    } = renderWithTheme(
      <SafeLink href="/example" className="custom-link">
        Example
      </SafeLink>
    );
    const linkElement = getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/example");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkElement).toHaveClass("custom-link");
    expect(linkElement).toHaveTextContent("Example");
  });
});
