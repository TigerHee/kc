/**
 * Owner: terry@kupotech.com
 */
import { useElementVisible } from 'src/hooks/useElementVisible.js';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useElementVisible', () => {
  beforeEach(() => {
    document.body.innerHTML = `
  <div id="parent">
  <!-- Initial children can be added here if needed -->
  </div>
  `;
  });

  it('should return el and show true when child element is added', () => {
    const { result } = renderHook(() => useElementVisible('parent', 'child'));

    act(() => {
      const parent = document.getElementById('parent');
      const child = document.createElement('div');
      child.id = 'child';
      parent.appendChild(child);
    });

  });

  it('should return el null and show false when child element is removed', () => {
    const { result } = renderHook(() => useElementVisible('parent', 'child'));

    act(() => {
      const parent = document.getElementById('parent');
      const child = document.createElement('div');
      child.id = 'child';
      parent.appendChild(child);
    });

    act(() => {
      const parent = document.getElementById('parent');
      const child = document.getElementById('child');
      parent.removeChild(child);
    });

    
  });

  it('should not update when parentDomId is not found', () => {
    const { result } = renderHook(() => useElementVisible('non-existent-parent', 'child'));

  });

  it('should not update when MutationObserver is not available', () => {
    const originalMutationObserver = global.MutationObserver;
    // Temporarily remove MutationObserver
    delete global.MutationObserver;

    const { result } = renderHook(() => useElementVisible('parent', 'child'));

    

    // Restore MutationObserver
    global.MutationObserver = originalMutationObserver;
  });
});