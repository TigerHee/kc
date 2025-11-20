/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * locale context
 * runtime: next/browser
 */
import { createContext } from 'react';

const context = createContext();

context.Provider.displayName = 'Locale.Provider';
context.Consumer.displayName = 'Locale.Consumer';

export default context;
