import '@kux/app-sdk';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
// @ts-expect-error ignore missing types
globalThis.jest = vi as unknown as typeof jest;