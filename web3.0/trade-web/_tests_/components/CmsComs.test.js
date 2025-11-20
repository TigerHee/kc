import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "_tests_/test-setup";
import CmsComponents from 'components/CmsComs';
import Helmet from 'react-helmet';

afterEach(cleanup);

test("test CmsComs Heads", () => {
  const { wrapper } = renderWithTheme(
    <CmsComponents.Heads/>
  );
  const helmet = Helmet.peek();
  const { metaTags, linkTags} = helmet || {};
  expect(metaTags.length).toBe(3);
  expect(linkTags.length).toBe(1);
  expect(metaTags[0].name).toBe('google');
  expect(linkTags[0].href).toBe('https://assets.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png');
});

test("test CmsComs Load", () => {
  const { wrapper } = renderWithTheme(<CmsComponents.Load run="com.newFooter.copyright"/>);
  const { container } = wrapper;
  expect(container).toHaveTextContent('CopyRight © 2017 - 2021 KuCoin.com. All Rights Reserved.');
})