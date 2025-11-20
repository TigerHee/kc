import React from "react";
import { screen, act, waitFor } from "@testing-library/react";
import createStore from "src/pages/Trade3.0/stores/createStore.js";
import "@testing-library/jest-dom";
import { renderWithTheme } from "_tests_/test-setup";

describe("createStore", () => {
  const storeName = "testStore";
  const initStateProps = {
    count: 0,
  };
  const { Context, handler, ProviderWrap, columnStoreHoc } = createStore(
    storeName,
    initStateProps
  );

  const TestComponent = ({ children }) => {
    return <ProviderWrap>{children}</ProviderWrap>;
  };

  const TestCounter = columnStoreHoc(({ count }) => {
    return <div data-testid="counter">{count}</div>;
  });

  it("should render the counter", async () => {
    await act(async () => {
      renderWithTheme(
        <TestComponent>
          <TestCounter />
        </TestComponent>
      );
    });

    waitFor(() => {
      expect(screen.getByTestId("counter")).toHaveTextContent("0");
    });
  });

  it("should update the counter", async () => {
    await act(async () => {
      await handler.update({ count: 1 });
    });

    waitFor(() => {
      expect(screen.getByTestId("counter")).toHaveTextContent("1");
    });
  });

  it("should select the counter", async () => {
    const selectFn = jest.fn().mockReturnValue(2);

    await act(async () => {
      const result = await handler.select(({ testStore }) => {
        return selectFn(testStore.count);
      });

      waitFor(() => {
        expect(result).toEqual(2);
        expect(selectFn).toHaveBeenCalledWith(1);
      });
    });
  });
});
