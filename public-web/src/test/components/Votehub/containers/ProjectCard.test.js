/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import ProjectCard, {
  SymbolInfo,
} from 'src/components/Votehub/containers/components/ProjectCard/index.js';
import { customRender } from 'src/test/setup';

describe('test ProjectCard', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: (func) => func(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('test SymbolInfo', async () => {
    customRender(<SymbolInfo />, { user: { user: {} } });
  });

  test('test ProjectCard', async () => {
    customRender(
      <ProjectCard logoUrl="" name="name" subName="subName" description="description" />,
      { user: { user: {} }, votehub: { activityStatus: 2 } },
    );

    customRender(
      <ProjectCard logoUrl="" name="name" subName="subName" description="description" rank={1} />,
      { user: { user: {} }, votehub: { activityStatus: 2 } },
    );

    customRender(
      <ProjectCard
        logoUrl=""
        name="name"
        subName="subName"
        description="description"
        rank={1}
        isProcessing={true}
      />,
      { user: { user: {} }, votehub: { activityStatus: 2 } },
    );

    customRender(
      <ProjectCard
        logoUrl=""
        name="name"
        subName="subName"
        description="description"
        rank={1}
        hot={110}
        status={1}
        isProcessing={true}
      />,
      { user: { user: {} }, votehub: { activityStatus: 2 } },
    );

    customRender(
      <ProjectCard
        logoUrl=""
        name="name"
        subName="subName"
        description="description"
        rank={1}
        hot={110}
        status={2}
        isProcessing={true}
        isSpecial={true}
      />,
      { user: { user: {} }, votehub: { activityStatus: 1 } },
    );
  });
});
