/**
 * Owner: willen@kupotech.com
 */
import { default as useHtmlToReact } from 'src/hooks/useHtmlToReact';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useHtmlToReact', () => {
  // 测试基本的HTML转换功能
  test('should convert basic HTML to React elements', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useHtmlToReact({ html: '<div>hello jest</div>' })
    );
    
    // 初始状态应该是空字符串
    expect(result.current.eles).toBe('');
    
    // 等待异步转换完成
    await waitForNextUpdate();
    
    // 验证转换后的结果
    expect(result.current.eles).toBeTruthy();
  });

  // 测试XSS过滤功能
  test('should filter out dangerous HTML content', async () => {
    const dangerousHtml = '<div>Safe content<script>alert("xss")</script></div>';
    const { result, waitForNextUpdate } = renderHook(() => 
      useHtmlToReact({ html: dangerousHtml })
    );
    
    await waitForNextUpdate();
    
    // script标签应该被移除
    expect(result.current.eles.props.children).toBe('Safe content');
  });

  // 测试HTML更新
  test('should update when HTML content changes', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ html }) => useHtmlToReact({ html }), 
      { initialProps: { html: '<div>Initial</div>' } }
    );
    
    await waitForNextUpdate();
    
    // 验证初始内容
    expect(result.current.eles.props.children).toBe('Initial');
    
    // 更新HTML内容
    rerender({ html: '<div>Updated</div>' });
    await waitForNextUpdate();
    
    // 验证更新后的内容
    expect(result.current.eles.props.children).toBe('Updated');
  });
});
