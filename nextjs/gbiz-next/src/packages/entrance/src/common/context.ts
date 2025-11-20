/**
 * Owner: sean.shi@kupotech.com
 */
import { createContext } from 'react';

export const LocalLangContext = createContext<{ currentLocale: string; locales: Record<string, string>; } | null>(null);
