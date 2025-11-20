/*
 * Owner: jesse.shao@kupotech.com
 */
// import { getText } from './main';
// main.test.js
import { getText } from 'src/components/$/LeGo/config';
import { getText as getText2 } from 'src/components/$/Nps/config';

describe('getText', () => {
  const contents = {
    title: 'This is a title',
    body: 'This is the first line.\nThis is the second line.\nThis is the third line.',
  };

  it('returns an empty string when key or contents is missing or invalid', () => {
    expect(getText('', contents)).toEqual('');
    expect(getText('invalidKey', contents)).toEqual('');
    expect(getText('title', null)).toEqual('');
  });

  it('returns contents[key] as a string when toArray is false', () => {
    expect(getText()).toEqual('');
    expect(getText(null, 0, true)).toEqual([]);
  });

  it('returns contents[key] as an array when toArray is true', () => {
    expect(getText('title', contents, true)).toEqual(['This is a title']);
    expect(getText('body', contents, true)).toEqual([
      'This is the first line.',
      'This is the second line.',
      'This is the third line.',
    ]);
  });
});

describe('getText2', () => {
  const contents = {
    title: 'This is a title',
    body: 'This is the first line.\nThis is the second line.\nThis is the third line.',
  };

  it('returns an empty string when key or contents is missing or invalid', () => {
    expect(getText2('', contents)).toEqual('');
    expect(getText2('invalidKey', contents)).toEqual('');
    expect(getText2('title', null)).toEqual('');
  });

  it('returns contents[key] as a string when toArray is false', () => {
    expect(getText2()).toEqual('');
    expect(getText2(null, 0, true)).toEqual([]);
  });

  it('returns contents[key] as an array when toArray is true', () => {
    expect(getText2('title', contents, true)).toEqual(['This is a title']);
    expect(getText2('body', contents, true)).toEqual([
      'This is the first line.',
      'This is the second line.',
      'This is the third line.',
    ]);
  });
});
