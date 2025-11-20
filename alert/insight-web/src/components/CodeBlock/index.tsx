import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface CodeBlockProps {
  data: {
    code: string;
    lineNumber: number;
  }[];
  highlineRow: number;
}

const Warp = styled.div`
  .code-block-custom {
    background: #282c34;
    color: #f8f8f2;
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;

    .line {
      /* display: flex; */
      line-height: 1.5;
      /* align-items: center; */
    }

    .line-number {
      color: #888;
      user-select: none;
      padding-right: 1em; /* 行号与代码间的间隙 */
      border-right: 1px solid #444; /* 行号右边的分隔线 */
      width: 30px; /* 行号宽度可以根据需要调整 */
      text-align: right; /* 行号右对齐 */
    }

    /* IDE错误行，高亮样式 */
    .highlight {
      background-color: #ff5555;
      width: fit-content;
    }
    pre code.hljs {
      display: block;
      overflow-x: auto;
      padding: 1em;
    }
    code.hljs {
      padding: 3px 5px;
    }
    .hljs {
      color: #abb2bf;
      background: #282c34;
    }
    .hljs-comment,
    .hljs-quote {
      color: #5c6370;
      font-style: italic;
    }
    .hljs-doctag,
    .hljs-keyword,
    .hljs-formula {
      color: #c678dd;
    }
    .hljs-section,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-deletion,
    .hljs-subst {
      color: #e06c75;
    }
    .hljs-literal {
      color: #56b6c2;
    }
    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta .hljs-string {
      color: #98c379;
    }
    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-type,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-number {
      color: #d19a66;
    }
    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-title {
      color: #61aeee;
    }
    .hljs-built_in,
    .hljs-title.class_,
    .hljs-class .hljs-title {
      color: #e6c07b;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: bold;
    }
    .hljs-link {
      text-decoration: underline;
    }
  }
`;
export const CodeBlock: React.FC<CodeBlockProps> = ({ data, highlineRow }) => {
  const codeRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState<string>('');

  const renderWithLineNumbers = (lineStart: number, code: string) => {
    const lines = code.split('\n') as string[];
    return lines
      .map((line, index) => {
        const lineNumber = lineStart + index; // 计算行号
        const isHighlighted = lineNumber === highlineRow; // 是否高亮
        return `<div class="line ${isHighlighted ? 'highlight' : ''}" ><pre><span class="line-number">${lineNumber}</span>${line}</pre></div>`;
      })
      .join('');
  };

  useLayoutEffect(() => {
    hljs.registerLanguage('javascript', javascript);
    // 高亮代码
    const highlighted = hljs.highlight(data.map((line) => line.code).join('\n'), {
      language: 'javascript',
    }).value;
    // 渲染带行号的高亮代码
    if (codeRef.current) {
      // codeRef.current.innerHTML = renderWithLineNumbers(data[0].lineNumber, highlighted);
      setCode(renderWithLineNumbers(data[0].lineNumber, highlighted));
    }
  }, [data]);

  return (
    <Warp>
      <pre>
        <div
          className="code-block-custom"
          ref={codeRef}
          dangerouslySetInnerHTML={{ __html: code }}
        ></div>
      </pre>
    </Warp>
  );
};
