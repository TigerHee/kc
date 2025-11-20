import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

const testingLibrary = require('@testing-library/dom');

testingLibrary.configure({
  computedStyleSupportsPseudoElements: false
});
