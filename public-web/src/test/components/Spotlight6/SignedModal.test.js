/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import SignedModal from 'src/components/Spotlight/SpotlightR6/SignedModal.js';
import { customRender } from 'src/test/setup';

describe('SignedModal', () => {
  it('renders SignedModal without onOk', () => {
    customRender(
      <SignedModal title="title" open={true} status={true} okText="okText">
        children
      </SignedModal>,
    );

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });

  it('renders SignedModal with onOk', () => {
    customRender(
      <SignedModal
        title="title"
        open={false}
        status={false}
        okText="okText"
        onOk="a"
        onCancel={() => {}}
      >
        children
      </SignedModal>,
    );

    customRender(
      <SignedModal
        title="title"
        open={true}
        status={true}
        okText="okText"
        onOk="a"
        onCancel={() => {}}
      >
        <p>
          children childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
          childrenchildren childrenchildren childrenchildrenc hildrenchildrenchild renchildren
        </p>
      </SignedModal>,
    );

    // const content = document.getElementById('content');
    // if (content) {
    //   // 模拟滚动事件
    //   const event = new Event('scroll');
    //   // 设置滚动位置，这里设置为100
    //   Object.defineProperty(content, 'scrollY', { value: 100 });
    // }

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });
});
