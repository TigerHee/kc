import React from "react";
import prices from "../_mock_/prices.json";
import { cleanup, waitFor } from "@testing-library/react";
import { 
  VirtualizedMaskFilter,
  VirtualizedList
} from "src/components/VirtualizedFixList";
import { renderWithTheme } from "_tests_/test-setup";
import "@testing-library/jest-dom";
import { map } from "lodash";

afterEach(cleanup);

const showRender = (showData) => {
  console.log('====showData',showData);
  return map(showData, ({currency, price}) => {
    return (
      <div key={currency} style={{height: 100}}>{currency}:{price}</div>
    )
  })
};

const priceList = map(Object.keys(prices), (key) => ({
  currency: key,
  price: prices[key],
}));

describe("Virtualized component", () => {
  it("should render with correct values", () => {
    global.innerWidth = 500;
    global.innerHeight = 500;
    const {
      wrapper: { getByText, container, debug },
    } = renderWithTheme(
      <VirtualizedMaskFilter useWindow={true} >
          <VirtualizedMaskFilter.RectBindHook >
            <VirtualizedList
                bufferSize={5}
                data={priceList}
                rowHeight={100}
                showRender={showRender}
                noRowsRender={() => null}
              />
          </VirtualizedMaskFilter.RectBindHook>
      </VirtualizedMaskFilter>
    );
    expect(container).toBeInTheDocument();
    
  });
});