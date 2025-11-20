/**
 * Owner: larvide.peng@kupotech.com
 */
import React from 'react';
import ArticleTree from 'src/components/SecurityMenu/ArticleTree.js';
import { customRender } from 'test/setup';

describe('test SecurityMenu ArticleTree', () => {
  test('test SecurityMenu ArticleTree', () => {
    const handleClose = jest.fn()
    const { container } = customRender(
      <ArticleTree
        isHomePage={false}
        onClose={handleClose}
      />,
    );

    expect(container.querySelectorAll('.ul-1')[0]).toBeInTheDocument();
    container.querySelectorAll('.parent-title')[0].click();
    expect(container.querySelectorAll('.ul-2')[0]).toBeInTheDocument();
    expect(container.querySelectorAll('.article-title')[0]).toBeInTheDocument();
    expect(document.querySelectorAll('.parent-title').length).toBe(6);
  });
});
